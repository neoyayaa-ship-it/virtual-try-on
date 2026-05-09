import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/tryon(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) return;
  auth().protect();
});

export const config = {
  // Webhook paths never enter this middleware — Clerk's handshake logic
  // runs even on early-return public routes and can emit a 307.
  matcher: [
    '/((?!_next|api/webhooks|.*\\..*).*)',
    '/(api(?!/webhooks)|trpc)(.*)',
  ],
};
