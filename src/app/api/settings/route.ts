import { getServerSession } from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "~/lib/auth";
import { db } from "~/server/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        emailSignature: true,
        notificationPreferences: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse name into firstName and lastName
    const nameParts = user.name.split(" ");
    const firstName = nameParts[0] ?? "";
    const lastName = nameParts.slice(1).join(" ") ?? "";

    // Default notification preferences if not set
    const defaultNotifications = {
      email: true,
      push: false,
      sms: false,
      marketing: false,
    };

    const notificationPreferences =
      (user.notificationPreferences as {
        email?: boolean;
        push?: boolean;
        sms?: boolean;
        marketing?: boolean;
      }) ?? defaultNotifications;

    return NextResponse.json({
      profile: {
        firstName,
        lastName,
        email: user.email,
        bio: user.bio ?? "",
        emailSignature: user.emailSignature ?? "",
      },
      notifications: {
        email: notificationPreferences.email ?? defaultNotifications.email,
        push: notificationPreferences.push ?? defaultNotifications.push,
        sms: notificationPreferences.sms ?? defaultNotifications.sms,
        marketing:
          notificationPreferences.marketing ?? defaultNotifications.marketing,
      },
    });
  } catch (error) {
    console.error("[settings] Failed to fetch settings", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch settings",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
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
      profile?: {
        firstName?: string;
        lastName?: string;
        email?: string;
        bio?: string;
        emailSignature?: string;
      };
      notifications?: {
        email?: boolean;
        push?: boolean;
        sms?: boolean;
        marketing?: boolean;
      };
    };

    const updateData: {
      name?: string;
      email?: string;
      bio?: string | null;
      emailSignature?: string | null;
      notificationPreferences?: object;
    } = {};

    // Update profile data
    if (body.profile) {
      if (body.profile.firstName !== undefined || body.profile.lastName !== undefined) {
        const currentUser = await db.user.findUnique({
          where: { id: user.id },
          select: { name: true },
        });
        const currentNameParts = currentUser?.name.split(" ") ?? [];
        const currentFirstName = currentNameParts[0] ?? "";
        const currentLastName = currentNameParts.slice(1).join(" ") ?? "";

        const firstName = body.profile.firstName ?? currentFirstName;
        const lastName = body.profile.lastName ?? currentLastName;
        updateData.name = `${firstName} ${lastName}`.trim();
      }

      if (body.profile.email !== undefined) {
        updateData.email = body.profile.email;
      }

      if (body.profile.bio !== undefined) {
        updateData.bio = body.profile.bio ?? null;
      }

      if (body.profile.emailSignature !== undefined) {
        updateData.emailSignature = body.profile.emailSignature ?? null;
      }
    }

    // Update notification preferences
    if (body.notifications) {
      const currentPreferences =
        ((await db.user.findUnique({
          where: { id: user.id },
          select: { notificationPreferences: true },
        }))?.notificationPreferences as {
          email?: boolean;
          push?: boolean;
          sms?: boolean;
          marketing?: boolean;
        }) || {};

      updateData.notificationPreferences = {
        ...currentPreferences,
        ...body.notifications,
      };
    }

    // Only update if there's data to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No data provided to update" },
        { status: 400 },
      );
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        emailSignature: true,
        notificationPreferences: true,
      },
    });

    // Parse name into firstName and lastName
    const nameParts = updatedUser.name.split(" ");
    const firstName = nameParts[0] ?? "";
    const lastName = nameParts.slice(1).join(" ") ?? "";

    const notificationPreferences =
      (updatedUser.notificationPreferences as {
        email?: boolean;
        push?: boolean;
        sms?: boolean;
        marketing?: boolean;
      }) ?? {
        email: true,
        push: false,
        sms: false,
        marketing: false,
      };

    return NextResponse.json({
      success: true,
      profile: {
        firstName,
        lastName,
        email: updatedUser.email,
        bio: updatedUser.bio ?? "",
        emailSignature: updatedUser.emailSignature ?? "",
      },
      notifications: {
        email: notificationPreferences.email ?? true,
        push: notificationPreferences.push ?? false,
        sms: notificationPreferences.sms ?? false,
        marketing: notificationPreferences.marketing ?? false,
      },
    });
  } catch (error) {
    console.error("[settings] Failed to update settings", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update settings",
      },
      { status: 500 },
    );
  }
}

