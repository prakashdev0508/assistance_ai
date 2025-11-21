import React from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '~/lib/auth'

export default async function DashboardPage() {
  // Only fetch session if we need user data, middleware already protects this route
  const session = await getServerSession(authOptions);
  return (
    <div>
      <div className='flex flex-col gap-4'>
        <h1 className='text-2xl font-bold'>Dashboard</h1>
        <p className='text-sm text-gray-500'>Welcome back, {session?.user?.name ?? "User"}</p>
      </div>
    </div>
  )
}