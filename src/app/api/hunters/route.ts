import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const hunters = await prisma.hunter.findMany({
    orderBy: { addedAt: "desc" },
    include: {
      _count: { select: { activities: true } },
      activities: {
        where: { isNew: true },
        select: { id: true },
      },
    },
  });

  const result = hunters.map((h) => ({
    ...h,
    activityCount: h._count.activities,
    unreadCount: h.activities.length,
    activities: undefined,
    _count: undefined,
  }));

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username } = body;

  if (!username || typeof username !== "string" || username.trim().length === 0) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  const slug = username.trim().toLowerCase();

  const existing = await prisma.hunter.findUnique({
    where: { username: username.trim() },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Hunter already in watchlist" },
      { status: 409 }
    );
  }

  const hunter = await prisma.hunter.create({
    data: {
      username: username.trim(),
      slug,
    },
  });

  return NextResponse.json(hunter, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Hunter id is required" }, { status: 400 });
  }

  await prisma.hunter.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
