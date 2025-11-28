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
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    const where: {
      userId: number;
      status?: string;
      type?: string;
      OR?: Array<
        | { title: { contains: string; mode: "insensitive" } }
        | { description: { contains: string; mode: "insensitive" } }
      >;
    } = {
      userId: user.id,
    };

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const goals = await db.goal.findMany({
      where,
      orderBy: [
        { deadline: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ goals });
  } catch (error) {
    console.error("[goals] Failed to fetch goals", error);
    return NextResponse.json(
      { error: "Failed to fetch goals" },
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
      title: string;
      description?: string | null;
      type: string;
      deadline?: string | null;
      status?: string;
    };

    if (!body.title || typeof body.title !== "string") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 },
      );
    }

    if (!body.type || !["short_term", "long_term"].includes(body.type)) {
      return NextResponse.json(
        { error: "Type must be 'short_term' or 'long_term'" },
        { status: 400 },
      );
    }

    const goal = await db.goal.create({
      data: {
        userId: user.id,
        title: body.title,
        description: body.description,
        type: body.type,
        deadline: body.deadline ? new Date(body.deadline) : null,
        status: body.status ?? "pending",
      },
    });

    return NextResponse.json({ goal }, { status: 201 });
  } catch (error) {
    console.error("[goals] Failed to create goal", error);
    return NextResponse.json(
      { error: "Failed to create goal" },
      { status: 500 },
    );
  }
}

