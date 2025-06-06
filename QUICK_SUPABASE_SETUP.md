# 🚀 Quick Supabase Setup for RL System

## Current Status
Your RL system is currently running in **MOCK MODE** because Supabase is not configured. This means:
- ✅ All functionality works for demonstration
- ⚠️ No data is actually saved to a database
- ⚠️ Data resets when you restart the application

## Enable Real Database (Optional)

If you want to enable real database persistence:

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/login and create a new project
3. Wait for the project to be ready (2-3 minutes)

### 2. Get Your Credentials
1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy your **Project URL** and **anon public key**

### 3. Configure Environment
Create a `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Run Database Migration
```bash
# Apply the RL database schema
npm run db:migrate
```

### 5. Seed Sample Data
```bash
# Populate with sample artisan data
npm run rl:seed
```

### 6. Restart Development Server
```bash
npm run dev
```

## What You Get With Real Database

- 🗄️ **Persistent Data**: Tourist profiles, artisan data, and learning experiences saved permanently
- 🧠 **Continuous Learning**: AI agent improvements persist between sessions
- 📊 **Real Analytics**: Actual performance metrics and recommendation tracking
- 🔄 **Data Sync**: Multiple users can interact with the same data

## Current Mock Mode Features

Even without Supabase, you can still:
- ✅ Test all RL functionality
- ✅ See AI recommendations
- ✅ Experience the full user interface
- ✅ View performance metrics (simulated)
- ✅ Interact with sample artisan profiles

The system is designed to work seamlessly in both modes!

---

**Need Help?** Check the full setup guide in `SUPABASE_SETUP.md` or the main documentation in `RL_REAL_IMPLEMENTATION.md`. 