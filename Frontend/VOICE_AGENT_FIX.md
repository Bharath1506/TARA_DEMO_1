## AWS Amplify & Production Deployment Fixes

### ⚠️ CORS Error (AWS Amplify)
If you see `Access to fetch at ... blocked by CORS policy` in your deployed site:

1. **Vapi Dashboard Whitelisting**:
   - Go to [Vapi Dashboard Settings](https://dashboard.vapi.ai/settings).
   - Add your Amplify domain (e.g., `https://main.d1j5ocrlgmjbt5.amplifyapp.com`) to **Allowed Origins**.

2. **Amplify Console Variables**:
   - Go to **AWS Amplify Console** > **Environment Variables**.
   - Add your `VITE_` variables there.
   - **RE-DEPLOY** the app after saving. Amplify only injects these at build time.

3. **Public Key check**:
   - Ensure you are using the **Public Key** (prepended with `pub-`).
   - Using a Private Key on the frontend will always fail with CORS.

### Debugging in Production
I have updated the logs to show more detail. Open the Chrome DevTools (F12) on your deployed site and check the `Error details` object for the `status` and `stage`.

If you see `false` for any of these, your environment variables aren't loading correctly.

## Common Issues

### Issue 1: Environment Variables Not Loading
**Symptom:** Console shows `❌ VITE_VOICE_AGENT_PUBLIC_KEY is not set in .env file`

**Fix:** 
- Make sure the `.env` file is in the `Frontend` folder (same level as `package.json`)
- Restart the dev server after creating/editing `.env`
- Vite only loads `.env` files on startup

### Issue 2: Invalid API Keys
**Symptom:** 400 error persists even with correct `.env` file

**Fix:**
- Your API keys might be expired or invalid
- Generate new keys from Vapi dashboard
- Make sure you're using the **Public Key**, not the Private Key

### Issue 3: Assistant Not Found
**Symptom:** Error mentions assistant ID

**Fix:**
- Verify the assistant exists in your Vapi dashboard
- Make sure the assistant is published/active
- Check that your API key has access to this assistant

## Testing
After making changes:
1. Restart the dev server
2. Open the app in browser
3. Click "Connect with Tara"
4. Check the browser console for detailed error logs

## Need More Help?
Check the browser console for these new detailed logs:
- `🔑 Vapi Configuration:` - Shows if env vars are loaded
- `🚀 Starting Vapi call with assistant ID:` - Shows the call is starting
- `❌ Failed to start call:` - Shows detailed error information

The error logs now include:
- Error message
- Error type
- Stage where it failed
- Context information
