import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "~/lib/auth";
import { db } from "~/server/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ entryId: string }> },
) {
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

    const { entryId } = await params;
    const entryIdNum = parseInt(entryId);

    if (isNaN(entryIdNum)) {
      return NextResponse.json({ error: "Invalid entry ID" }, { status: 400 });
    }

    const entry = await db.journalEntry.findFirst({
      where: {
        id: entryIdNum,
        userId: user.id,
      },
    });

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({ entry });
  } catch (error) {
    console.error("[journal] Failed to fetch entry", error);
    return NextResponse.json(
      { error: "Failed to fetch entry" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ entryId: string }> },
) {
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

    const { entryId } = await params;
    const entryIdNum = parseInt(entryId);

    if (isNaN(entryIdNum)) {
      return NextResponse.json({ error: "Invalid entry ID" }, { status: 400 });
    }

    const body = (await request.json()) as {
      date?: string;
      title?: string | null;
      content?: string;
      mood?: string | null;
      tags?: string[];
    };

    const updateData: {
      date?: Date;
      title?: string | null;
      content?: string;
      mood?: string | null;
      tags?: string[];
    } = {};

    if (body.date !== undefined) updateData.date = new Date(body.date);
    if (body.title !== undefined) updateData.title = body.title ?? null;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.mood !== undefined) updateData.mood = body.mood ?? null;
    if (body.tags !== undefined) updateData.tags = body.tags;

    // If date is being updated, check for uniqueness
    if (body.date !== undefined) {
      const existingEntry = await db.journalEntry.findUnique({
        where: {
          userId_date: {
            userId: user.id,
            date: new Date(body.date),
          },
        },
      });

      if (existingEntry && existingEntry.id !== entryIdNum) {
        return NextResponse.json(
          { error: "Journal entry already exists for this date" },
          { status: 409 },
        );
      }
    }

    const entry = await db.journalEntry.updateMany({
      where: {
        id: entryIdNum,
        userId: user.id,
      },
      data: updateData,
    });

    if (entry.count === 0) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    const updatedEntry = await db.journalEntry.findUnique({
      where: { id: entryIdNum },
    });

    return NextResponse.json({ entry: updatedEntry });
  } catch (error) {
    console.error("[journal] Failed to update entry", error);
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
      { error: "Failed to update entry" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ entryId: string }> },
) {
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

    const { entryId } = await params;
    const entryIdNum = parseInt(entryId);

    if (isNaN(entryIdNum)) {
      return NextResponse.json({ error: "Invalid entry ID" }, { status: 400 });
    }

    const entry = await db.journalEntry.deleteMany({
      where: {
        id: entryIdNum,
        userId: user.id,
      },
    });

    if (entry.count === 0) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[journal] Failed to delete entry", error);
    return NextResponse.json(
      { error: "Failed to delete entry" },
      { status: 500 },
    );
  }
}

