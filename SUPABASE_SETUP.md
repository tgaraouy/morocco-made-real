# 🚀 Supabase Setup Guide for Morocco Made Real

## Quick Setup Steps

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: `morocco-made-real`
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users (Europe for Morocco)
5. Click "Create new project"
6. Wait for the project to be ready (2-3 minutes)

### 2. Get Your Supabase Credentials

Once your project is ready:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)
   - **service_role** key (starts with `eyJ`) - **Keep this secret!**

### 3. Create .env.local File

Create a file named `.env.local` in your project root with:

```bash
# Morocco Made Real - Local Environment Configuration

# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI API Configuration (Optional for now)
OPENAI_API_KEY=your_openai_api_key_here

# Development Environment
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Other configurations (optional for basic setup)
SMART_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
BLOCKCHAIN_PRIVATE_KEY=your_blockchain_private_key_here
BLOCKCHAIN_NETWORK_ID=polygon-mumbai
POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com/
```

### 4. Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase/migrations/001_initial_schema.sql`
3. Paste it into the SQL Editor
4. Click **Run** to create all tables and functions

### 5. Test the Setup

1. Save your `.env.local` file
2. Restart your development server:
   ```bash
   npm run dev
   ```
3. Visit `http://localhost:3000/en/ai-blockchain`
4. You should see the page load without Supabase errors

## 🔧 Troubleshooting

### Common Issues

**Error: "Missing Supabase environment variables"**
- Make sure `.env.local` exists in your project root
- Check that variable names match exactly (including `NEXT_PUBLIC_` prefix)
- Restart your development server after creating/editing `.env.local`

**Database connection errors**
- Verify your Supabase project is active (not paused)
- Check that you've run the database migration script
- Ensure your API keys are correct

**SQL errors when running migration**
- Make sure you're using the SQL Editor in Supabase dashboard
- Run the migration script in one go (don't run parts separately)
- Check for any syntax errors in the console

### Verification Steps

1. **Check Environment Variables**:
   ```bash
   # In your terminal, run:
   node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"
   ```

2. **Test Database Connection**:
   - Go to Supabase dashboard → **Table Editor**
   - You should see tables: `artisans`, `artisan_pieces`, `digital_certificates`, etc.

3. **Test Application**:
   - Visit the AI & Blockchain page
   - Try generating an itinerary (should work with mock data)
   - Check browser console for any errors

## 📋 Environment Variables Reference

### Required for Basic Functionality
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public API key for client-side access
- `SUPABASE_SERVICE_ROLE_KEY` - Private key for server-side operations

### Optional (for full features)
- `OPENAI_API_KEY` - For AI itinerary generation
- `SMART_CONTRACT_ADDRESS` - For blockchain features
- `BLOCKCHAIN_PRIVATE_KEY` - For blockchain transactions
- `AWS_ACCESS_KEY_ID` - For file storage
- `AWS_SECRET_ACCESS_KEY` - For file storage

## 🎯 Next Steps

Once Supabase is set up:

1. **Test the Enhanced Blockchain Service**:
   - The mock mode will be disabled
   - Real database operations will work
   - You can create and verify artisan pieces

2. **Add Sample Data**:
   - The migration includes sample artisans
   - You can add more through the Supabase dashboard

3. **Configure OpenAI** (optional):
   - Get an API key from OpenAI
   - Add it to your `.env.local`
   - Test AI itinerary generation

4. **Set up Blockchain** (advanced):
   - Configure Polygon testnet
   - Set up smart contracts
   - Test certificate generation

## 🔒 Security Notes

- **Never commit `.env.local` to git** (it's already in `.gitignore`)
- Keep your `service_role` key secret
- Use environment variables for all sensitive data
- In production, use Vercel/Netlify environment variables

## 📞 Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Check the terminal for server errors
3. Verify your Supabase project is active
4. Ensure all environment variables are set correctly

The application will work in mock mode without Supabase, but you'll get the full experience with a proper database setup! 