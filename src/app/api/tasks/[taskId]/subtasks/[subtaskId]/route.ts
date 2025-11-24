import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "~/lib/auth";
import { db } from "~/server/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string; subtaskId: string }> },
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

    const { taskId, subtaskId } = await params;
    const taskIdNum = parseInt(taskId);
    const subtaskIdNum = parseInt(subtaskId);

    if (isNaN(taskIdNum) || isNaN(subtaskIdNum)) {
      return NextResponse.json(
        { error: "Invalid task or subtask ID" },
        { status: 400 },
      );
    }

    // Verify task belongs to user
    const task = await db.task.findFirst({
      where: {
        id: taskIdNum,
        userId: user.id,
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const body = (await request.json()) as {
      title?: string;
      description?: string | null;
      status?: string;
    };

    const updateData: {
      title?: string;
      description?: string | null;
      status?: string;
    } = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined)
      updateData.description = body.description ?? null;
    if (body.status !== undefined) updateData.status = body.status;

    const subtask = await db.subTask.updateMany({
      where: {
        id: subtaskIdNum,
        taskId: taskIdNum,
      },
      data: updateData,
    });

    if (subtask.count === 0) {
      return NextResponse.json(
        { error: "Subtask not found" },
        { status: 404 },
      );
    }

    const updatedSubtask = await db.subTask.findUnique({
      where: { id: subtaskIdNum },
    });

    return NextResponse.json({ subtask: updatedSubtask });
  } catch (error) {
    console.error("[subtasks] Failed to update subtask", error);
    return NextResponse.json(
      { error: "Failed to update subtask" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string; subtaskId: string }> },
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

    const { taskId, subtaskId } = await params;
    const taskIdNum = parseInt(taskId);
    const subtaskIdNum = parseInt(subtaskId);

    if (isNaN(taskIdNum) || isNaN(subtaskIdNum)) {
      return NextResponse.json(
        { error: "Invalid task or subtask ID" },
        { status: 400 },
      );
    }

    // Verify task belongs to user
    const task = await db.task.findFirst({
      where: {
        id: taskIdNum,
        userId: user.id,
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const subtask = await db.subTask.deleteMany({
      where: {
        id: subtaskIdNum,
        taskId: taskIdNum,
      },
    });

    if (subtask.count === 0) {
      return NextResponse.json(
        { error: "Subtask not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[subtasks] Failed to delete subtask", error);
    return NextResponse.json(
      { error: "Failed to delete subtask" },
      { status: 500 },
    );
  }
}

