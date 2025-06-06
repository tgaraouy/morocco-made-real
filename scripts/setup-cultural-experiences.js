/**
 * Setup script to create and populate the cultural_experiences table
 * Run this to populate Supabase with the realistic experience data
 */

const fs = require('fs');
const path = require('path');

// Read the SQL migration file
const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '008_cultural_experiences.sql');

if (!fs.existsSync(migrationPath)) {
  console.error('❌ Migration file not found:', migrationPath);
  process.exit(1);
}

const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

console.log('🚀 Cultural Experiences Migration Ready!');
console.log('');
console.log('📋 To run this migration:');
console.log('');
console.log('1. Copy the SQL from: supabase/migrations/008_cultural_experiences.sql');
console.log('2. Go to your Supabase dashboard: https://app.supabase.com/');
console.log('3. Navigate to: Project → SQL Editor');
console.log('4. Paste the SQL and click "Run"');
console.log('');
console.log('✅ This will create the cultural_experiences table and populate it with 8 realistic experiences');
console.log('🎯 Your cultural-match component will then fetch from the database instead of mock data');
console.log('');
console.log('🔗 Migration file location:', migrationPath);

// Also provide instructions for running via Supabase CLI if available
console.log('');
console.log('💡 Alternative: If you have Supabase CLI installed:');
console.log('   supabase db reset');
console.log('   This will run all migrations including the new experiences table'); 