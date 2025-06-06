import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'fr', 'ar', 'es'],

  // Used when no locale matches
  defaultLocale: 'en',
  
  // Always use locale prefix for better clarity
  localePrefix: 'always'
});

export const config = {
  // Match only internationalized pathnames, exclude API routes
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',
    
    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(en|fr|ar|es)/:path*',
    
    // Enable redirects that add missing locales
    // Exclude API routes, _next, _vercel, and files with extensions
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
}; 