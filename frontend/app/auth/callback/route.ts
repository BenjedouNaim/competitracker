import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectUrl = requestUrl.searchParams.get('redirectUrl') || '/dashboard'
  
  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value
          },
          set(name, value, options) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name, options) {
            cookieStore.delete({ name, ...options })
          },
        },
      }
    )

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)
    
    // Redirect to the specified URL or dashboard if none provided
    return NextResponse.redirect(new URL(redirectUrl, requestUrl.origin))
  }

  // Handle error - redirect to login if there's no code
  return NextResponse.redirect(new URL('/auth/login', requestUrl.origin))
}