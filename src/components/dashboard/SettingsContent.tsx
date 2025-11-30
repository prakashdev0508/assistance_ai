"use client";

import React, { useState } from "react";

export default function SettingsContent() {
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

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-black">Settings</h1>
        <p className="mt-3 text-base text-black/60">
          Manage your account settings and preferences
        </p>
      </div>

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
                  <button className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black/70 hover:bg-black/5 hover:text-black transition-colors">
                    Upload Photo
                  </button>
                  <button className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black/70 hover:bg-black/5 hover:text-black transition-colors">
                    Remove
                  </button>
                </div>
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
                <button className="rounded-lg border border-black/10 bg-white px-5 py-2.5 text-sm font-medium text-black/70 hover:bg-black/5 transition-colors">
                  Cancel
                </button>
                <button className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-black/90 transition-colors">
                  Save Changes
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
            ].map((item, index) => (
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
        </section>
      </div>
    </div>
  );
}
