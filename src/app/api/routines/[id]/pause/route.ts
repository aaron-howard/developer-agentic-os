import { NextResponse } from "next/server";

import { createRoutineRegistry } from "@/server/routines/routine-registry";
import { repositoryContextForRequest } from "@/server/workspace/request-context";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json().catch(() => ({}));
    const context = await repositoryContextForRequest(request, body);
    return NextResponse.json(await createRoutineRegistry({ root: context.path }).pauseRoutine(id));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown routine error" }, { status: 404 });
  }
}