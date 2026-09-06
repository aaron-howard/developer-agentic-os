export type IncomingSignalSource = "manual" | "email" | "integration";
export type IncomingSignalProvider = "github" | "vercel";
export type IncomingSignalStatus = "new" | "snoozed" | "dismissed" | "triaged";
export type IncomingSignalDerivedReference = { kind: "work_item" | "skill_run" | "artifact"; ref: string };

export type IncomingSignal = {
  id: string;
  source: IncomingSignalSource;
  sourceId: string | null;
  provider?: IncomingSignalProvider;
  title: string;
  body: string;
  repositoryId: string;
  createdAt: string;
  updatedAt: string;
  status: IncomingSignalStatus;
  snoozedUntil: string | null;
  derivedRefs: IncomingSignalDerivedReference[];
};

export type CreateIncomingSignalInput = {
  source: IncomingSignalSource;
  sourceId?: string | null;
  provider?: IncomingSignalProvider;
  title: string;
  body?: string;
  repositoryId: string;
};

export type ListIncomingSignalsOptions = {
  repositoryId?: string;
  source?: IncomingSignalSource;
  status?: IncomingSignalStatus;
};

export type UpdateIncomingSignalInput = {
  status: IncomingSignalStatus;
  snoozedUntil?: string | null;
  derivedRefs?: IncomingSignalDerivedReference[];
};