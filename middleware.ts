import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/tryon',
    '/sign-in(.*)',
    '/sign-up(.*)',
  ],
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next|api/webhooks/clerk).*)",
    "/",
    "/(api(?!/webhooks/clerk)|trpc)(.*)"
  ],
};
