import { NextResponse } from "next/server";
import { runPoll } from "@/lib/poller";

export async function POST() {
  const result = await runPoll();
  return NextResponse.json(result, { status: result.status === "error" ? 500 : 200 });
}
