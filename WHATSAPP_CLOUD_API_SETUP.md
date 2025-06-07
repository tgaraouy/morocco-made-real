# WhatsApp Cloud API Setup Guide

## Overview
This guide walks you through setting up WhatsApp Cloud API by Meta for phone verification in your Morocco Made Real app.

## Prerequisites
- Facebook Business Account
- Meta Developer Account
- WhatsApp Business Account
- A verified Facebook Business Manager account

## Step 1: Create WhatsApp Business App

### 1.1 Go to Meta Developers Console
1. Visit [developers.facebook.com](https://developers.facebook.com)
2. Click "My Apps" → "Create App"
3. Select "Business" as the app type
4. Fill in app details:
   - **App Name**: Morocco Made Real WhatsApp
   - **App Contact Email**: your-email@domain.com

### 1.2 Add WhatsApp Product
1. In your app dashboard, click "Add Product"
2. Find "WhatsApp" and click "Set Up"
3. You'll be redirected to the WhatsApp setup page

## Step 2: Configure WhatsApp Business API

### 2.1 Get Your Credentials
After setting up WhatsApp, you'll get:

1. **App ID**: Found in App Settings → Basic
2. **App Secret**: Found in App Settings → Basic  
3. **Phone Number ID**: Found in WhatsApp → API Setup
4. **Access Token**: Found in WhatsApp → API Setup

### 2.2 Set Up Webhook
1. In WhatsApp → Configuration, set:
   - **Webhook URL**: `https://yourapp.com/api/whatsapp-webhook`
   - **Verify Token**: `morocco_made_real_webhook_2024` (or your custom token)

2. Subscribe to these webhook fields:
   - `messages`
   - `message_deliveries` (optional)
   - `message_reads` (optional)

## Step 3: Environment Variables

Add these to your `.env.local` file:

```bash
# WhatsApp Cloud API Configuration
WHATSAPP_BUSINESS_API_TOKEN=EAAQ00xlDBt0BO3UDGZAAq9TZBPAmPa5GDw4VZAnyEXBdaERWZB05GH7BVYUXyXzVixAw3hBnut3FZCZA4BPtZAY6VShRLWOesFo3wzt29ZBeKacfgtTRZBS46wlPoZBbArktyQm3aJm32r5fvHpJZAqPRNXR2NZBLtLpk6lG7Y1zZBOxVgbbWcyKfpZBmaItWQ9DLsP7aMDALFlwINGf1hAA0m9lPaspdntNgk7BDGzWSZAwK9g02WgD4AZD
WHATSAPP_BUSINESS_PHONE_ID=117271847926609
WHATSAPP_WEBHOOK_VERIFICATION_TOKEN=2025_morocco_made_real_2025

# Meta App Credentials
META_APP_ID=1183981173409501
META_APP_SECRET=7264e9adcc057689f57afe58daf2f5ea
```

## Step 4: Test Phone Number Setup

### 4.1 Add Test Numbers
1. In WhatsApp → API Setup → Phone numbers
2. Add test phone numbers (up to 5 for development)
3. These numbers can receive messages during development

### 4.2 Verify Test Integration
1. Start your development server: `npm run dev`
2. Go to your app's verification page
3. Enter a test phone number
4. Check that WhatsApp message is received

## Step 5: Production Setup

### 5.1 Business Verification
1. Complete Facebook Business Verification
2. This is required for production WhatsApp messaging

### 5.2 Phone Number Registration
1. Add your business phone number
2. Complete the verification process
3. This number will be the sender for production messages

### 5.3 Message Templates (Optional)
Create pre-approved templates for:
- Verification codes
- Welcome messages
- Booking confirmations

## Step 6: Testing Your Integration

### 6.1 Development Testing
Use the test flow:
```bash
# Send test code
curl -X POST http://localhost:3000/api/whatsapp-send-code \
  -H "Content-Type: application/json" \
  -d '{"phone": "+212612345678"}'

# Verify code manually
curl -X POST http://localhost:3000/api/whatsapp-verify-code \
  -H "Content-Type: application/json" \
  -d '{"phone": "+212612345678", "code": "123456"}'
```

### 6.2 Webhook Testing
1. Use ngrok for local webhook testing:
   ```bash
   ngrok http 3000
   ```
2. Update webhook URL in Meta console to ngrok URL

## API Endpoints Created

### 1. `/api/whatsapp-send-code`
Sends verification code via WhatsApp Cloud API
- Method: POST
- Body: `{ "phone": "+212612345678" }`
- Response: `{ "success": true, "session": {...} }`

### 2. `/api/whatsapp-verify-code`
Verifies the code entered by user
- Method: POST  
- Body: `{ "phone": "+212612345678", "code": "123456" }`
- Response: `{ "success": true, "profile": {...} }`

### 3. `/api/whatsapp-webhook`
Receives webhook from Meta for auto-verification
- Method: GET (verification)
- Method: POST (message handling)

## Message Flow

### Standard Flow:
1. User enters phone number
2. App calls `/api/whatsapp-send-code`
3. WhatsApp message sent via Cloud API
4. User receives code on WhatsApp
5. User enters code in app
6. App calls `/api/whatsapp-verify-code`
7. Phone verified ✅

### Auto-Verification Flow:
1. User enters phone number  
2. App calls `/api/whatsapp-send-code`
3. WhatsApp message sent via Cloud API
4. User receives code on WhatsApp
5. User replies to WhatsApp with code
6. Webhook receives reply automatically
7. Phone verified ✅ (no manual entry needed)

## Error Handling

### Common Issues:
1. **Invalid phone number**: Ensure international format (+212...)
2. **Token expired**: Refresh access token in Meta console
3. **Webhook not working**: Check ngrok/domain configuration
4. **Rate limiting**: Meta has daily message limits

### Debug Logs:
All WhatsApp API calls are logged with emoji prefixes:
- 📱 Message sending
- ✅ Success responses
- ❌ Error responses
- 🔍 Webhook processing

## Security Considerations

1. **Webhook Verification**: Always verify webhook tokens
2. **Rate Limiting**: Implement rate limiting for code requests
3. **Token Security**: Keep access tokens secure, rotate regularly
4. **Phone Validation**: Validate phone number formats

## Production Checklist

- [ ] Business verification completed
- [ ] Production phone number verified
- [ ] Webhook URL uses HTTPS
- [ ] Environment variables configured
- [ ] Rate limiting implemented
- [ ] Error handling tested
- [ ] Message templates approved (if using)
- [ ] Monitoring/logging set up

## Cost Considerations

WhatsApp Cloud API pricing (as of 2024):
- **Free Tier**: 1,000 conversations/month
- **Business Messaging**: ~$0.005-0.025 per message (varies by country)
- **Template Messages**: Higher cost than standard messages

For Morocco Made Real's use case (verification only), costs should be minimal.

## Support Resources

- [WhatsApp Cloud API Documentation](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Meta Business Help Center](https://business.facebook.com/help)
- [WhatsApp Business API Support](https://developers.facebook.com/support)

## Next Steps

After setup completion:
1. Test with real phone numbers
2. Monitor webhook performance
3. Set up analytics/logging
4. Plan for scale (rate limits, costs)
5. Consider message templates for better UX 