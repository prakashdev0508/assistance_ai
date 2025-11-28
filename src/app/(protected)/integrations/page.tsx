import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "~/lib/auth";
import { db } from "~/server/db";
import { GOOGLE_CALENDAR_PROVIDER } from "~/server/integrations/googleCalendar";
import { GOOGLE_GMAIL_PROVIDER } from "~/server/integrations/googleGmail";
import { GOOGLE_MEET_PROVIDER } from "~/server/integrations/googleMeet";
import DisconnectCalendarButton from "~/components/integrations/DisconnectCalendarButton";
import DisconnectGmailButton from "~/components/integrations/DisconnectGmailButton";
import DisconnectMeetButton from "~/components/integrations/DisconnectMeetButton";

export default async function IntegrationsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user?.email
    ? await db.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      })
    : null;

  const [calendarIntegration, gmailIntegration, meetIntegration] = user
    ? await Promise.all([
        db.integration.findUnique({
          where: {
            userId_provider: {
              userId: user.id,
              provider: GOOGLE_CALENDAR_PROVIDER,
            },
          },
        }),
        db.integration.findUnique({
          where: {
            userId_provider: {
              userId: user.id,
              provider: GOOGLE_GMAIL_PROVIDER,
            },
          },
        }),
        db.integration.findUnique({
          where: {
            userId_provider: {
              userId: user.id,
              provider: GOOGLE_MEET_PROVIDER,
            },
          },
        }),
      ])
    : [null, null, null];

  const isCalendarConnected = Boolean(calendarIntegration);
  const isGmailConnected = Boolean(gmailIntegration);
  const isMeetConnected = Boolean(meetIntegration);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-black/50">Connect services</p>
        <h1 className="text-3xl font-semibold text-black">Integrations</h1>
        <p className="text-sm text-black/60">
          Enable Google-powered automations for planning, communication, and files.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Link
          href={isCalendarConnected ? "/calendar" : "/api/integrations/google/calendar/start"}
          className="rounded-[28px] border border-white/60 bg-white/80 p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.6)] backdrop-blur hover:shadow-[0_25px_60px_-30px_rgba(0,0,0,0.7)] transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#4285F4] text-white">
                <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                  <path
                    d="M7 4h10v4H7zM5 8h14v12H5z"
                    fill="white"
                  />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-black">Google Calendar</div>
                <div className="text-xs text-black/60">
                  Sync events, availability, and reminders.
                </div>
              </div>
            </div>
            <span className="text-xs text-black/60">
              {isCalendarConnected ? "Connected" : "Not connected"}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-black/50">
            <span>Scope: calendar (read & write)</span>
            {isCalendarConnected ? (
              <div className="flex items-center gap-2">
                <DisconnectCalendarButton />
                <span className="rounded-full bg-black px-4 py-1.5 text-xs font-semibold text-white">
                  View Calendar
                </span>
              </div>
            ) : (
              <span className="rounded-full bg-black px-4 py-1.5 text-xs font-semibold text-white">
                Connect
              </span>
            )}
          </div>
        </Link>

        <Link
          href={isGmailConnected ? "/gmail" : "/api/integrations/google/gmail/start"}
          className="rounded-[28px] border border-white/60 bg-white/80 p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.6)] backdrop-blur hover:shadow-[0_25px_60px_-30px_rgba(0,0,0,0.7)] transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-[#ea4335] via-[#fbbc05] to-[#34a853] text-white">
                <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                  <path
                    d="M3 7l9 6 9-6v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
                    fill="white"
                  />
                  <path d="M3 7l9 6 9-6-9-5-9 5Z" fill="white" opacity="0.6" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-black">Gmail</div>
                <div className="text-xs text-black/60">
                  Draft and send emails, summarize threads.
                </div>
              </div>
            </div>
            <span className="text-xs text-black/60">
              {isGmailConnected ? "Connected" : "Not connected"}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-black/50">
            <span>Scope: gmail (read, send & modify)</span>
            {isGmailConnected ? (
              <div className="flex items-center gap-2">
                <DisconnectGmailButton />
                <span className="rounded-full bg-black px-4 py-1.5 text-xs font-semibold text-white">
                  View Emails
                </span>
              </div>
            ) : (
              <span className="rounded-full bg-black px-4 py-1.5 text-xs font-semibold text-white">
                Connect
              </span>
            )}
          </div>
        </Link>

        <Link
          href={isMeetConnected ? "/chat" : "/api/integrations/google/meet/start"}
          className="rounded-[28px] border border-white/60 bg-white/80 p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.6)] backdrop-blur hover:shadow-[0_25px_60px_-30px_rgba(0,0,0,0.7)] transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0f9d58] text-white">
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path
                    d="M5 6h8l4 4v8H5z"
                    fill="white"
                  />
                  <path d="M17 10v5l3 2v-9z" fill="white" opacity="0.6" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-black">Google Meet</div>
                <div className="text-xs text-black/60">
                  Generate meeting links, log recaps, and follow-ups.
                </div>
              </div>
            </div>
            <span className="text-xs text-black/60">
              {isMeetConnected ? "Connected" : "Not connected"}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-black/50">
            <span>Scope: meet (read & create spaces)</span>
            {isMeetConnected ? (
              <div className="flex items-center gap-2">
                <DisconnectMeetButton />
                <span className="rounded-full bg-black px-4 py-1.5 text-xs font-semibold text-white">
                  View Assistant
                </span>
              </div>
            ) : (
              <span className="rounded-full bg-black px-4 py-1.5 text-xs font-semibold text-white">
                Connect
              </span>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}
