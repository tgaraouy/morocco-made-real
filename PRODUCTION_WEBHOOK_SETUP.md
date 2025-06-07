# WhatsApp Webhook Production Setup

## 🚨 CRITICAL: Webhook Required for Production

Your Morocco Made Real app is now deployed on Vercel, but the WhatsApp verification system needs a **real webhook** to work in production. The development simulator won't work in production.

## 📋 Step-by-Step Setup

### **Step 1: Configure Vercel Environment Variables**

In your Vercel dashboard (https://vercel.com/dashboard):

1. Go to your `morocco-made-real` project
2. Click **Settings** → **Environment Variables**
3. Add these variables:

```bash
# Required for WhatsApp webhook verification
WHATSAPP_WEBHOOK_VERIFICATION_TOKEN=morocco_made_real_webhook_2024

# Your existing variables
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-key
```

### **Step 2: Get Your Webhook URL**

Your webhook URL will be:
```
https://your-vercel-domain.vercel.app/api/whatsapp-webhook
```

**Example:** `https://morocco-made-real-xyz.vercel.app/api/whatsapp-webhook`

### **Step 3: WhatsApp Business API Setup**

You need to configure WhatsApp Business API to call your webhook:

#### **Option A: Facebook Developer Console**
1. Go to https://developers.facebook.com/
2. Create/access your WhatsApp Business app
3. Go to **WhatsApp** → **Configuration**
4. Set **Webhook URL**: `https://your-vercel-domain.vercel.app/api/whatsapp-webhook`
5. Set **Verify Token**: `morocco_made_real_webhook_2024`
6. Subscribe to **messages** events

#### **Option B: WhatsApp Business API Provider**
If using a provider like Twilio, MessageBird, etc.:
1. Configure webhook URL in their dashboard
2. Set verification token
3. Enable message receiving

### **Step 4: Test the Webhook**

1. **Verify Webhook**: WhatsApp will call your webhook with a verification challenge
2. **Test Message Flow**:
   - User scans QR code → Opens WhatsApp
   - User sends verification code
   - Your webhook receives the message
   - Code is automatically verified
   - User proceeds to cultural matching

### **Step 5: Monitor Webhook**

Check your Vercel function logs:
```bash
# In Vercel dashboard → Functions → View Function Logs
✅ WhatsApp Webhook verified successfully
📞 Message from +1234567890: 123456
🔢 Extracted code: 123456
✅ Phone +1234567890 verified with session qr_xyz
```

## 🔧 Debugging Common Issues

### Issue 1: Webhook Verification Fails
**Symptoms**: WhatsApp shows "Webhook verification failed"
**Solution**: 
- Check WHATSAPP_WEBHOOK_VERIFICATION_TOKEN in Vercel
- Ensure webhook URL is correct
- Check Vercel function logs

### Issue 2: Messages Not Received
**Symptoms**: User sends code but verification doesn't work
**Solution**:
- Verify WhatsApp Business API is sending to correct webhook
- Check phone number format in webhook payload
- Monitor Vercel function logs for incoming messages

### Issue 3: Session Not Found
**Symptoms**: Code received but no matching session
**Solution**:
- Check phone number formatting (international format)
- Verify session hasn't expired (5 minute limit)
- Check QR code generation flow

## 🚀 Alternative: Quick Test Solution

**For immediate testing/demo**, you can use the existing simulate webhook:

1. User scans QR → Opens WhatsApp
2. **Instead of sending to WhatsApp**, have them:
   - Copy the verification code from WhatsApp message
   - Go to: `https://your-vercel-domain.vercel.app/api/simulate-webhook`
   - This will auto-verify their session

**Note**: This is only for testing. Production needs real webhook.

## 📞 Need Help?

**Webhook URL to configure**: `https://your-vercel-domain.vercel.app/api/whatsapp-webhook`
**Verification Token**: `morocco_made_real_webhook_2024`

Your app is production-ready except for this webhook configuration! 