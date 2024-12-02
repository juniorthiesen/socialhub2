export const config = {
  apiVersion: 'v21.0',
  baseUrl: `https://graph.facebook.com/v21.0`,
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  webhookToken: process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN,
  facebook: {
    appId: process.env.FACEBOOK_APP_ID,
    appSecret: process.env.FACEBOOK_APP_SECRET
  }
};