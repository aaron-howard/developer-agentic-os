import type { SignalTriageAction, SignalTriageResult } from "@/types/signal-triage";
import { ArtifactStore } from "../artifacts/artifact-store";
import { IncomingSignalError, IncomingSignalStore } from "./incoming-signal-store";
import { createSkillRegistry } from "../skills/skill-registry";
import { WorkItemError, WorkItemStore } from "../work-items/work-item-store";

export class SignalTriageError extends Error {
  constructor(readonly code: "INVALID_INPUT" | "NOT_FOUND", message: string) {
    super(message);
    this.name = "SignalTriageError";
  }
}

export async function triageSignal(root: string, signalId: string, input: SignalTriageAction, repositoryId: string): Promise<SignalTriageResult> {
  validateAction(input);
  const signalStore = new IncomingSignalStore(root);
  const workItems = new WorkItemStore(root);
  const signal = (await signalStore.list({ repositoryId })).find((item) => item.id === signalId);
  if (!signal) throw new SignalTriageError("NOT_FOUND", "Incoming signal not found.");

  const signalRef = { kind: "incoming_signal" as const, ref: signal.id, label: signal.title };
  const integrationRef = signal.provider && signal.sourceId ? { kind: "integration_event" as const, ref: signal.sourceId, label: signal.provider } : null;
  if (input.action === "dismiss") return { action: input.action, signal: await signalStore.update(signal.id, { status: "dismissed" }, repositoryId) };
  if (input.action === "snooze") return { action: input.action, signal: await signalStore.update(signal.id, { status: "snoozed", snoozedUntil: input.snoozedUntil ?? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() }, repositoryId) };

  if (input.action === "create_work_item") {
    let workItem;
    try {
      workItem = await workItems.create({
        title: input.title?.trim() || signal.title,
        notes: input.notes?.trim() || signal.body,
        priority: input.priority,
        repositoryId: signal.repositoryId,
        contextRefs: [signalRef, ...(integrationRef ? [integrationRef] : [])],
      });
    } catch (error) {
      if (error instanceof WorkItemError) throw new SignalTriageError("INVALID_INPUT", error.message);
      throw error;
    }
    return { action: input.action, signal: await markTriaged(signal, signalStore, { kind: "work_item", ref: workItem.id }), workItem };
  }

  if (input.action === "attach_work_item") {
    const matches = await workItems.list({ repositoryId });
    const workItem = matches.find((item) => item.id === input.workItemId);
    if (!workItem) throw new SignalTriageError("NOT_FOUND", "Work item not found.");
    const alreadyAttached = workItem.contextRefs.some((reference) => reference.kind === "incoming_signal" && reference.ref === signal.id);
    const updated = alreadyAttached ? workItem : await workItems.update(workItem.id, { contextRefs: [...workItem.contextRefs, signalRef] }, repositoryId);
    return { action: input.action, signal: await markTriaged(signal, signalStore, { kind: "work_item", ref: updated.id }), workItem: updated };
  }

  if (input.action === "invoke_skill") {
    if (!input.skillId?.trim()) throw new SignalTriageError("INVALID_INPUT", "skillId is required.");
    const result = await createSkillRegistry({ root }).runSkill(input.skillId, input.input ?? {}, { workflowRefs: [signalRef] });
    return { action: input.action, signal: await markTriaged(signal, signalStore, { kind: "skill_run", ref: result.run.id }), skillRun: result.run };
  }

  const artifact = await new ArtifactStore(root).createArtifact({
    name: input.name?.trim() || signal.title,
    type: input.type?.trim() || "signal_triage",
    content: input.content ?? signal.body,
    tags: input.tags ?? ["incoming-signal"],
    contextRefs: [signalRef],
    provenance: { repositoryId: signal.repositoryId, repositoryRoot: root, workflowRefs: [signalRef] },
  });
  return { action: input.action, signal: await markTriaged(signal, signalStore, { kind: "artifact", ref: artifact.id }), artifact };
}

async function markTriaged(signal: Awaited<ReturnType<IncomingSignalStore["list"]>>[number], store: IncomingSignalStore, derivedRef: { kind: "work_item" | "skill_run" | "artifact"; ref: string }) {
  const derivedRefs = signal.derivedRefs.some((reference) => reference.kind === derivedRef.kind && reference.ref === derivedRef.ref) ? signal.derivedRefs : [...signal.derivedRefs, derivedRef];
  return store.update(signal.id, { status: "triaged", derivedRefs }, signal.repositoryId);
}

function validateAction(input: SignalTriageAction): void {
  if (!input || typeof input !== "object" || !["create_work_item", "attach_work_item", "invoke_skill", "create_artifact", "dismiss", "snooze"].includes(input.action)) {
    throw new SignalTriageError("INVALID_INPUT", "Invalid signal triage action.");
  }
  if (input.action === "attach_work_item" && (!input.workItemId || typeof input.workItemId !== "string")) throw new SignalTriageError("INVALID_INPUT", "workItemId is required.");
  if (input.action === "create_artifact" && input.tags !== undefined && (!Array.isArray(input.tags) || input.tags.some((tag) => typeof tag !== "string"))) throw new SignalTriageError("INVALID_INPUT", "tags must be strings.");
  if (input.action === "snooze" && input.snoozedUntil !== undefined && (typeof input.snoozedUntil !== "string" || Number.isNaN(Date.parse(input.snoozedUntil)))) throw new SignalTriageError("INVALID_INPUT", "snoozedUntil must be a valid date.");
}

export function isTriageStoreError(error: unknown): error is IncomingSignalError | WorkItemError {
  return error instanceof IncomingSignalError || error instanceof WorkItemError;
}