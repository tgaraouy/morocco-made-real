# Production Setup Guide

## Environment Variables
```bash
NODE_ENV=production
SMS_PROVIDER=auto
ENABLE_SMART_METHOD_SELECTION=true
PREFER_WHATSAPP=false
WHATSAPP_METHOD=link
SHOW_VERIFICATION_CODES=false
ENABLE_MOCK_VERIFICATION=false
```

## WhatsApp Business API Setup
- 1. Create Facebook Developer Account (developers.facebook.com)
- 2. Create a new App → Add WhatsApp Business API
- 3. Generate Access Token
- 4. Add Phone Number to WhatsApp Business Account
- 5. Create Message Template for verification codes
- 6. Set Webhook URL: https://yourdomain.com/api/whatsapp-webhook
- 7. Configure Webhook Verify Token

## Deployment Checklist
- [ ] 1. Set all environment variables in hosting platform
- [ ] 2. Run database migrations
- [ ] 3. Configure domain and SSL certificate
- [ ] 4. Test webhook endpoints
- [ ] 5. Verify WhatsApp Business API connection
- [ ] 6. Test end-to-end verification flow
- [ ] 7. Monitor logs and error rates

## Testing Production Setup

### 1. Test Basic Verification
```bash
curl -X POST https://yourdomain.com/api/verify-phone \
  -H "Content-Type: application/json" \
  -d '{"phone": "+212612345678", "method": "whatsapp"}'
```

### 2. Test QR Auto-Validation
Visit: `https://yourdomain.com/en/test-whatsapp-qr`

### 3. Monitor Dashboard
Visit: `https://yourdomain.com/en/admin/whatsapp`

## Support
- Documentation: ./WHATSAPP_VERIFICATION_SETUP.md
- Test Page: /en/test-whatsapp-qr
- Admin Dashboard: /en/admin/whatsapp
