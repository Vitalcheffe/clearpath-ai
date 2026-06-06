'use client'

import { useSession, signIn, signOut } from 'next-auth/react'

export function useAuth() {
  const { data: session, status } = useSession()

  const isAuthenticated = status === 'authenticated'
  const isLoading = status === 'loading'
  const user = session?.user ?? null

  return {
    session,
    status,
    isAuthenticated,
    isLoading,
    user,
    signIn,
    signOut,
  }
}
