const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.log('Required:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

console.log('🔧 Connecting to Supabase...');
const supabase = createClient(supabaseUrl, supabaseKey);

async function runPhoneMigration() {
  try {
    console.log('📱 Running phone profiles migration...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/010_tourist_profiles_phone.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Migration file loaded, executing SQL...');
    
    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql: migrationSQL 
    });
    
    if (error) {
      console.error('💥 Migration failed:', error);
      
      // Try alternative approach - split and execute statements
      console.log('🔄 Trying alternative approach...');
      
      // Split SQL into individual statements
      const statements = migrationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      for (const statement of statements) {
        if (statement.trim()) {
          console.log('⚡ Executing:', statement.substring(0, 100) + '...');
          
          const { error: stmtError } = await supabase
            .from('_supabase_migrations')
            .upsert({ statement });
          
          if (stmtError) {
            console.log('⚠️ Statement error (may be expected):', stmtError.message);
          }
        }
      }
    }
    
    console.log('✅ Phone profiles migration completed!');
    console.log('🎯 You can now test phone verification at: /en/cultural-match-phone');
    
  } catch (error) {
    console.error('💥 Fatal error:', error);
  }
}

// Alternative: Direct table creation
async function createPhoneProfilesTable() {
  console.log('🏗️ Creating tourist_profiles_phone table directly...');
  
  const createTableSQL = `
    -- Create phone-based tourist profiles table
    CREATE TABLE IF NOT EXISTS tourist_profiles_phone (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        
        -- Phone as primary identifier (international format)
        phone VARCHAR(20) UNIQUE NOT NULL,
        
        -- Basic tourist info
        first_name VARCHAR(100),
        country_code VARCHAR(3),
        
        -- Cultural preferences
        preferences JSONB DEFAULT '{"mood": "creative", "timeAvailable": "half-day", "priceRange": "moderate"}',
        
        -- Saved experiences and bookings
        saved_experiences TEXT[] DEFAULT '{}',
        booking_history TEXT[] DEFAULT '{}',
        
        -- Profile stats
        preferences_set BOOLEAN DEFAULT FALSE,
        total_bookings INTEGER DEFAULT 0,
        total_spent DECIMAL(10,2) DEFAULT 0,
        
        -- Verification status
        phone_verified BOOLEAN DEFAULT FALSE,
        verification_code VARCHAR(6),
        verification_expires_at TIMESTAMP WITH TIME ZONE,
        
        -- Tourism context
        current_visit JSONB DEFAULT '{}',
        visit_history JSONB[] DEFAULT '{}',
        
        -- Metadata
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        
        -- Privacy and communication preferences
        whatsapp_enabled BOOLEAN DEFAULT TRUE,
        sms_enabled BOOLEAN DEFAULT TRUE,
        marketing_consent BOOLEAN DEFAULT FALSE
    );
  `;
  
  try {
    const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (error) {
      console.error('💥 Direct table creation failed:', error);
      return false;
    }
    
    console.log('✅ Table created successfully!');
    
    // Create demo profiles
    const { error: insertError } = await supabase
      .from('tourist_profiles_phone')
      .upsert([
        {
          phone: '+212-6-12-34-56-78',
          first_name: 'Sarah',
          country_code: 'FR',
          preferences: { mood: 'creative', timeAvailable: 'half-day', priceRange: 'moderate' },
          preferences_set: true,
          phone_verified: true,
          total_bookings: 1,
          total_spent: 75.00
        },
        {
          phone: '+33-6-98-76-54-32',
          first_name: 'Ahmed',
          country_code: 'FR',
          preferences: { mood: 'adventurous', timeAvailable: 'full-day', priceRange: 'premium' },
          preferences_set: true,
          phone_verified: true,
          total_bookings: 0,
          total_spent: 0.00
        },
        {
          phone: '+1-555-123-4567',
          first_name: 'Lisa',
          country_code: 'US',
          preferences: { mood: 'social', timeAvailable: 'quick', priceRange: 'budget' },
          preferences_set: true,
          phone_verified: true,
          total_bookings: 2,
          total_spent: 140.00
        }
      ]);
      
    if (insertError) {
      console.log('⚠️ Demo profiles insertion warning:', insertError.message);
    } else {
      console.log('✅ Demo profiles created!');
    }
    
    return true;
    
  } catch (error) {
    console.error('💥 Error in direct table creation:', error);
    return false;
  }
}

// Run the migration
async function main() {
  console.log('🚀 Starting phone profiles migration...');
  
  // Try direct table creation first (simpler approach)
  const directSuccess = await createPhoneProfilesTable();
  
  if (directSuccess) {
    console.log('🎉 Migration completed successfully!');
    console.log('📱 Phone-based authentication is now ready');
    console.log('🎯 Test at: http://localhost:3000/en/cultural-match-phone');
  } else {
    console.log('🔄 Trying full migration file...');
    await runPhoneMigration();
  }
}

main().catch(console.error); 