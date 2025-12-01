import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "~/lib/auth";
import { db } from "~/server/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const mood = searchParams.get("mood");
    const tag = searchParams.get("tag");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const limit = searchParams.get("limit");

    const where: {
      userId: number;
      mood?: string;
      tags?: { has: string };
      date?: { gte?: Date; lte?: Date };
      OR?: Array<
        | { title: { contains: string; mode: "insensitive" } }
        | { content: { contains: string; mode: "insensitive" } }
      >;
    } = {
      userId: user.id,
    };

    if (mood) {
      where.mood = mood;
    }

    if (tag) {
      where.tags = { has: tag };
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const entries = await db.journalEntry.findMany({
      where,
      orderBy: {
        date: "desc",
      },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("[journal] Failed to fetch entries", error);
    return NextResponse.json(
      { error: "Failed to fetch entries" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = (await request.json()) as {
      date: string;
      title?: string | null;
      content: string;
      mood?: string | null;
      tags?: string[];
    };

    if (!body.content || typeof body.content !== "string") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 },
      );
    }

    if (!body.date || typeof body.date !== "string") {
      return NextResponse.json(
        { error: "Date is required" },
        { status: 400 },
      );
    }

    // Check if entry already exists for this date
    const existingEntry = await db.journalEntry.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: new Date(body.date),
        },
      },
    });

    if (existingEntry) {
      return NextResponse.json(
        { error: "Journal entry already exists for this date" },
        { status: 409 },
      );
    }

    const entry = await db.journalEntry.create({
      data: {
        userId: user.id,
        date: new Date(body.date),
        title: body.title,
        content: body.content,
        mood: body.mood,
        tags: body.tags ?? [],
      },
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error("[journal] Failed to create entry", error);
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint")
    ) {
      return NextResponse.json(
        { error: "Journal entry already exists for this date" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create entry" },
      { status: 500 },
    );
  }
}

