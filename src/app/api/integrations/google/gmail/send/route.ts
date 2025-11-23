import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "~/lib/auth";
import { db } from "~/server/db";
import { sendGoogleGmailMessage } from "~/server/integrations/googleGmail";

type SendEmailRequestBody = {
  to: string;
  subject: string;
  body: string;
  cc?: string;
  bcc?: string;
};

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

    const body = (await request.json()) as unknown as SendEmailRequestBody;

    // Validate required fields
    if (!body.to) {
      return NextResponse.json(
        { error: "Recipient email is required" },
        { status: 400 },
      );
    }

    if (!body.subject) {
      return NextResponse.json(
        { error: "Subject is required" },
        { status: 400 },
      );
    }

    if (!body.body) {
      return NextResponse.json(
        { error: "Email body is required" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.to)) {
      return NextResponse.json(
        { error: `Invalid recipient email format: ${body.to}` },
        { status: 400 },
      );
    }

    if (body.cc && !emailRegex.test(body.cc)) {
      return NextResponse.json(
        { error: `Invalid CC email format: ${body.cc}` },
        { status: 400 },
      );
    }

    if (body.bcc && !emailRegex.test(body.bcc)) {
      return NextResponse.json(
        { error: `Invalid BCC email format: ${body.bcc}` },
        { status: 400 },
      );
    }

    const message = await sendGoogleGmailMessage(user.id, {
      to: body.to,
      subject: body.subject,
      body: body.body,
      cc: body.cc,
      bcc: body.bcc,
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("[gmail] Failed to send email", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to send email",
      },
      { status: 500 },
    );
  }
}

