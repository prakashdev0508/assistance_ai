"use client";

import React, { useState, useEffect } from "react";

export default function SettingsContent() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    marketing: false,
  });

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    emailSignature: "",
  });

  const [originalData, setOriginalData] = useState({
    profile: { ...profileData },
    notifications: { ...notifications },
  });

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/settings");
        
        if (!response.ok) {
          throw new Error("Failed to fetch settings");
        }

        const data = (await response.json()) as {
          profile: {
            firstName: string;
            lastName: string;
            email: string;
            bio: string;
            emailSignature: string;
          };
          notifications: {
            email: boolean;
            push: boolean;
            sms: boolean;
            marketing: boolean;
          };
        };
        
        setProfileData({
          firstName: data.profile.firstName ?? "",
          lastName: data.profile.lastName ?? "",
          email: data.profile.email ?? "",
          bio: data.profile.bio ?? "",
          emailSignature: data.profile.emailSignature ?? "",
        });

        setNotifications({
          email: data.notifications.email ?? true,
          push: data.notifications.push ?? false,
          sms: data.notifications.sms ?? false,
          marketing: data.notifications.marketing ?? false,
        });

        setOriginalData({
          profile: {
            firstName: data.profile.firstName ?? "",
            lastName: data.profile.lastName ?? "",
            email: data.profile.email ?? "",
            bio: data.profile.bio ?? "",
            emailSignature: data.profile.emailSignature ?? "",
          },
          notifications: {
            email: data.notifications.email ?? true,
            push: data.notifications.push ?? false,
            sms: data.notifications.sms ?? false,
            marketing: data.notifications.marketing ?? false,
          },
        });
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        setMessage({
          type: "error",
          text: "Failed to load settings. Please refresh the page.",
        });
      } finally {
        setLoading(false);
      }
    };

    void fetchSettings();
  }, []);

  // Auto-save notifications when changed
  useEffect(() => {
    if (loading) return; // Don't save on initial load

    const saveNotifications = async () => {
      try {
        const response = await fetch("/api/settings", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notifications,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save notification preferences");
        }

        const data = (await response.json()) as {
          notifications: {
            email: boolean;
            push: boolean;
            sms: boolean;
            marketing: boolean;
          };
        };
        setOriginalData((prev) => ({
          ...prev,
          notifications: data.notifications,
        }));
      } catch (error) {
        console.error("Failed to save notifications:", error);
        setMessage({
          type: "error",
          text: "Failed to save notification preferences.",
        });
      }
    };

    // Debounce the save
    const timeoutId = setTimeout(() => {
      void saveNotifications();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [notifications, loading]);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile: profileData,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error ?? "Failed to save profile");
      }

      const data = (await response.json()) as {
        profile: {
          firstName: string;
          lastName: string;
          email: string;
          bio: string;
          emailSignature: string;
        };
      };
      
      setOriginalData((prev) => ({
        ...prev,
        profile: data.profile,
      }));

      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      });

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to save profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setProfileData(originalData.profile);
    setMessage(null);
  };

  const hasChanges = JSON.stringify(profileData) !== JSON.stringify(originalData.profile);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-black">Settings</h1>
          <p className="mt-3 text-base text-black/60">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-black/10 border-t-black"></div>
            <p className="mt-4 text-sm text-black/60">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-black">Settings</h1>
        <p className="mt-3 text-base text-black/60">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Message Banner */}
      {message && (
        <div
          className={`mb-6 rounded-lg border px-4 py-3 ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{message.text}</p>
            <button
              onClick={() => setMessage(null)}
              className="ml-4 text-black/40 hover:text-black/60"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* Profile Section */}
        <section className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
          <div className="border-b border-black/5 bg-black/2 px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-black">Profile</h2>
              <p className="mt-1 text-sm text-black/50">
                Your personal information and email signature
              </p>
            </div>
          </div>

          <div className="p-6 lg:p-8">
            {/* Profile Picture */}
            <div className="mb-8 flex items-start gap-6 border-b border-black/5 pb-8">
              <div className="relative">
                <div className="h-24 w-24 overflow-hidden rounded-2xl bg-gradient-to-br from-black/10 to-black/5 flex items-center justify-center ring-2 ring-black/5">
                  <span className="text-3xl">👤</span>
                </div>
                <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-1.5 shadow-sm ring-2 ring-white">
                  <svg className="h-4 w-4 text-black/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-black">Profile Photo</h3>
                <p className="mt-1 text-sm text-black/50">
                  JPG, PNG or GIF. Max size 2MB. Recommended: 400x400px
                </p>
                <div className="mt-4 flex gap-3">
                  <button 
                    disabled
                    className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black/40 cursor-not-allowed"
                  >
                    Upload Photo
                  </button>
                  <button 
                    disabled
                    className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black/40 cursor-not-allowed"
                  >
                    Remove
                  </button>
                </div>
                <p className="mt-2 text-xs text-black/40 italic">
                  Photo upload will be available soon
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-black">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) =>
                      setProfileData({ ...profileData, firstName: e.target.value })
                    }
                    placeholder="John"
                    className="w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm text-black placeholder:text-black/30 transition-all focus:border-black/20 focus:outline-none focus:ring-2 focus:ring-black/5"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-black">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) =>
                      setProfileData({ ...profileData, lastName: e.target.value })
                    }
                    placeholder="Doe"
                    className="w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm text-black placeholder:text-black/30 transition-all focus:border-black/20 focus:outline-none focus:ring-2 focus:ring-black/5"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  placeholder="john.doe@example.com"
                  className="w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm text-black placeholder:text-black/30 transition-all focus:border-black/20 focus:outline-none focus:ring-2 focus:ring-black/5"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Bio
                </label>
                <textarea
                  rows={4}
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData({ ...profileData, bio: e.target.value })
                  }
                  placeholder="Tell us about yourself..."
                  className="w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm text-black placeholder:text-black/30 transition-all focus:border-black/20 focus:outline-none focus:ring-2 focus:ring-black/5 resize-none"
                />
                <p className="mt-2 text-xs text-black/40">
                  A brief description of yourself
                </p>
              </div>

              <div className="rounded-xl border border-black/5 bg-black/1 p-5">
                <div className="mb-3">
                  <label className="mb-2 block text-sm font-medium text-black">
                    Email Signature
                  </label>
                  <p className="text-xs text-black/50">
                    This signature will be automatically added to the end of your emails when sending messages.
                  </p>
                </div>
                <textarea
                  rows={6}
                  value={profileData.emailSignature}
                  onChange={(e) =>
                    setProfileData({ ...profileData, emailSignature: e.target.value })
                  }
                  placeholder="Best regards,&#10;John Doe&#10;Your Company Name&#10;Email: john.doe@example.com&#10;Phone: +1 (555) 123-4567"
                  className="w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm text-black placeholder:text-black/30 transition-all focus:border-black/20 focus:outline-none focus:ring-2 focus:ring-black/5 resize-none font-mono"
                />
                <p className="mt-2 text-xs text-black/40">
                  You can use plain text or basic formatting. This will be included at the bottom of all emails you send.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleCancel}
                  disabled={!hasChanges || saving}
                  className="rounded-lg border border-black/10 bg-white px-5 py-2.5 text-sm font-medium text-black/70 hover:bg-black/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={!hasChanges || saving}
                  className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving && (
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
          <div className="border-b border-black/5 bg-black/2 px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-black">Notifications</h2>
              <p className="mt-1 text-sm text-black/50">
                Manage how you receive notifications and updates
              </p>
            </div>
          </div>

          <div className="divide-y divide-black/5">
            {[
              {
                key: "email",
                title: "Email Notifications",
                description: "Receive notifications via email",
                icon: (
                  <svg className="h-5 w-5 text-black/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                key: "push",
                title: "Push Notifications",
                description: "Receive push notifications in your browser",
                icon: (
                  <svg className="h-5 w-5 text-black/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                ),
              },
              {
                key: "sms",
                title: "SMS Notifications",
                description: "Receive notifications via text message",
                icon: (
                  <svg className="h-5 w-5 text-black/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                ),
              },
              {
                key: "marketing",
                title: "Marketing Emails",
                description: "Receive updates about new features and offers",
                icon: (
                  <svg className="h-5 w-5 text-black/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between px-6 py-5 transition-colors hover:bg-black/1"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-0.5 shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-black">{item.title}</h3>
                    <p className="mt-1 text-sm text-black/50">{item.description}</p>
                  </div>
                </div>
                <label className="relative ml-4 inline-flex cursor-pointer items-center shrink-0">
                  <input
                    type="checkbox"
                    checked={notifications[item.key as keyof typeof notifications]}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        [item.key]: e.target.checked,
                      })
                    }
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-black/10 transition-all duration-200 ease-in-out peer-checked:bg-black peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black/20 peer-focus:ring-offset-2">
                    <div className="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></div>
                  </div>
                </label>
              </div>
            ))}
          </div>
          <div className="border-t border-black/5 bg-black/1 px-6 py-4">
            <p className="text-xs text-black/50">
              Notification preferences are saved automatically
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
