/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://dudemw.com',
  generateRobotsTxt: true,
  exclude: [
    '/admin/*',
    '/api/*',
    '/sso-callback',
    '/verify-otp',
    '/reset-password',
    '/forgot-password',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/account/'],
      },
    ],
  },
}