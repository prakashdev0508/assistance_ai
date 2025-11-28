import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "~/lib/auth";
import { db } from "~/server/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ goalId: string }> },
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

    const { goalId } = await params;
    const goalIdNum = parseInt(goalId);

    if (isNaN(goalIdNum)) {
      return NextResponse.json({ error: "Invalid goal ID" }, { status: 400 });
    }

    const goal = await db.goal.findFirst({
      where: {
        id: goalIdNum,
        userId: user.id,
      },
    });

    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    return NextResponse.json({ goal });
  } catch (error) {
    console.error("[goals] Failed to fetch goal", error);
    return NextResponse.json(
      { error: "Failed to fetch goal" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ goalId: string }> },
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

    const { goalId } = await params;
    const goalIdNum = parseInt(goalId);

    if (isNaN(goalIdNum)) {
      return NextResponse.json({ error: "Invalid goal ID" }, { status: 400 });
    }

    const body = (await request.json()) as {
      title?: string;
      description?: string | null;
      type?: string;
      deadline?: string | null;
      status?: string;
    };

    const updateData: {
      title?: string;
      description?: string | null;
      type?: string;
      deadline?: Date | null;
      status?: string;
    } = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined)
      updateData.description = body.description ?? null;
    if (body.type !== undefined) {
      if (!["short_term", "long_term"].includes(body.type)) {
        return NextResponse.json(
          { error: "Type must be 'short_term' or 'long_term'" },
          { status: 400 },
        );
      }
      updateData.type = body.type;
    }
    if (body.deadline !== undefined)
      updateData.deadline = body.deadline ? new Date(body.deadline) : null;
    if (body.status !== undefined) updateData.status = body.status;

    const goal = await db.goal.updateMany({
      where: {
        id: goalIdNum,
        userId: user.id,
      },
      data: updateData,
    });

    if (goal.count === 0) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    const updatedGoal = await db.goal.findUnique({
      where: { id: goalIdNum },
    });

    return NextResponse.json({ goal: updatedGoal });
  } catch (error) {
    console.error("[goals] Failed to update goal", error);
    return NextResponse.json(
      { error: "Failed to update goal" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ goalId: string }> },
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

    const { goalId } = await params;
    const goalIdNum = parseInt(goalId);

    if (isNaN(goalIdNum)) {
      return NextResponse.json({ error: "Invalid goal ID" }, { status: 400 });
    }

    const goal = await db.goal.deleteMany({
      where: {
        id: goalIdNum,
        userId: user.id,
      },
    });

    if (goal.count === 0) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[goals] Failed to delete goal", error);
    return NextResponse.json(
      { error: "Failed to delete goal" },
      { status: 500 },
    );
  }
}

