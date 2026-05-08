import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fetchHunterProfile } from "@/lib/crawler";

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

  const trimmed = username.trim();

  const existing = await prisma.hunter.findUnique({
    where: { username: trimmed },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Hunter already in watchlist" },
      { status: 409 }
    );
  }

  const profile = await fetchHunterProfile(trimmed);

  const hunter = await prisma.hunter.create({
    data: profile
      ? {
          username: profile.username,
          slug: profile.slug,
          avatarUrl: profile.avatar?.url ?? null,
          kycVerified: profile.kyc_status === "V",
          points: profile.points ?? 0,
          rank: profile.rank,
          nbReports: profile.nb_reports ?? 0,
          nationality: profile.nationality,
          firstName: profile.public_firstname,
          lastName: profile.public_lastname,
          website: profile.hunter_profile?.website ?? null,
          github: profile.hunter_profile?.github ?? null,
          twitter: profile.hunter_profile?.twitter ?? null,
        }
      : {
          username: trimmed,
          slug: trimmed.toLowerCase(),
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
