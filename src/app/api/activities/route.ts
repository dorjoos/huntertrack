import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hunterId = searchParams.get("hunterId");
  const bugType = searchParams.get("bugType");
  const state = searchParams.get("state");
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  const where: Record<string, unknown> = {};
  if (hunterId) where.hunterId = parseInt(hunterId);
  if (bugType) where.bugTypeSlug = bugType;
  if (state) where.workflowState = state;

  const [activities, total] = await Promise.all([
    prisma.activity.findMany({
      where,
      include: { hunter: { select: { username: true, slug: true, avatarUrl: true } } },
      orderBy: { date: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.activity.count({ where }),
  ]);

  return NextResponse.json({ activities, total });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { ids, hunterId, markAll } = body;

  if (markAll && hunterId) {
    await prisma.activity.updateMany({
      where: { hunterId: parseInt(hunterId), isNew: true },
      data: { isNew: false },
    });
  } else if (ids && Array.isArray(ids)) {
    await prisma.activity.updateMany({
      where: { id: { in: ids.map(Number) } },
      data: { isNew: false },
    });
  } else {
    return NextResponse.json({ error: "Provide ids array or markAll + hunterId" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
