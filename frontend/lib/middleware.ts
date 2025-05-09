import { createServerClient } from "@supabase/ssr";
import { cp } from "fs";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/" || path.startsWith("/auth") || path.startsWith("/login");

  // Handle protected routes - if user is not authenticated, redirect to login
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    // Save the original URL as a searchParam to redirect after login
    url.searchParams.set("redirectUrl", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // If user is authenticated and trying to access login/signup pages, redirect to dashboard
  if (
    user &&
    (path.startsWith("/auth/login") || path.startsWith("/auth/sign-up"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Check role-based access for protected paths
  if (user) {
    // Fetch user role from the database
    const { data: userData } = await supabase
      .from("users")
      .select("role, status")
      .eq("id", user.id)
      .single();
    console.log("id :", user.id);
    console.log("userData :", userData);

    // Admin-only paths
    const isAdminOnlyPath = path.startsWith("/dashboard/admin");

    // If path requires admin role but user is not an admin, redirect to dashboard
    if (isAdminOnlyPath && (!userData || userData.role !== "admin")) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    // Check if user account is active
    if (
      userData &&
      userData.status !== "active" &&
      !path.startsWith("/auth/account-status")
    ) {
      // If account is pending or inactive, redirect to suspended account page
      const url = request.nextUrl.clone();
      url.pathname = "/auth/account-status";
      return NextResponse.redirect(url);
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
