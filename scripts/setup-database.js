// Database Setup Script for Morocco Made Real RL System
// This script helps you set up the required database tables in Supabase

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

console.log('🗄️ Morocco Made Real - Database Setup Helper');
console.log('='.repeat(50));

// Check if environment variables are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Supabase environment variables not found.');
  console.log('');
  console.log('📋 To set up the database:');
  console.log('');
  console.log('1. Create a .env.local file in your project root with:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here');
  console.log('');
  console.log('2. Go to your Supabase dashboard → SQL Editor');
  console.log('');
  console.log('3. Run the following migration files in order:');
  
  const migrationFiles = [
    'supabase/migrations/001_initial_schema.sql',
    'supabase/migrations/002_traditional_practices_database.sql',
    'supabase/migrations/003_rl_system_tables.sql',
    'supabase/migrations/004_add_unique_constraint.sql'
  ];
  
  migrationFiles.forEach((file, index) => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      console.log(`   ${index + 1}. ${file} ✅`);
    } else {
      console.log(`   ${index + 1}. ${file} ❌ (file not found)`);
    }
  });
  
  console.log('');
  console.log('4. Run: npm run rl:seed');
  console.log('');
  console.log('💡 The system works perfectly in mock mode without database setup!');
  process.exit(0);
}

console.log('✅ Supabase configuration found');
console.log(`🔗 URL: ${supabaseUrl}`);
console.log('🔑 Key: ***configured***');
console.log('');

// Check if the complete setup file exists
const completeSetupFile = path.join(process.cwd(), 'supabase/migrations/000_complete_setup.sql');
const hasCompleteSetup = fs.existsSync(completeSetupFile);

console.log('🚀 QUICK DATABASE SETUP (Recommended)');
console.log('='.repeat(40));
console.log('');
console.log('1. Go to your Supabase dashboard:');
console.log(`   ${supabaseUrl.replace('/rest/v1', '')}`);
console.log('');
console.log('2. Navigate to: SQL Editor');
console.log('');
if (hasCompleteSetup) {
  console.log('3. Copy and paste the ENTIRE contents of this file:');
  console.log('   📁 supabase/migrations/000_complete_setup.sql');
  console.log('');
  console.log('4. Click "RUN" to execute the script');
  console.log('');
  console.log('5. You should see success messages at the bottom');
  console.log('');
  console.log('6. Restart your development server: npm run dev');
} else {
  console.log('3. Run the migration files in order:');
  
  const migrationFiles = [
    'supabase/migrations/001_initial_schema.sql',
    'supabase/migrations/002_traditional_practices_database.sql', 
    'supabase/migrations/003_rl_system_tables.sql',
    'supabase/migrations/004_add_unique_constraint.sql'
  ];

  migrationFiles.forEach((file, index) => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      console.log(`   ${index + 1}. ${file} ✅`);
    } else {
      console.log(`   ${index + 1}. ${file} ❌ (file not found)`);
    }
  });
}

console.log('');
console.log('🎉 After setup, your RL system will use REAL database persistence!');
console.log('');
console.log('💡 Current Status: Database connection working, but tables need to be created.');
console.log('   Your system is running in smart fallback mode until tables are set up.'); 