/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://dudemenswear.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/api/*',
    '/auth/*',
    '/checkout',
    '/account',
    '/profile',
    '/sso-callback',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/auth/', '/checkout', '/account', '/profile', '/sso-callback'],
      },
    ],
  },
}
