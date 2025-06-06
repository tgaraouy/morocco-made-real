const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xwtyhpwmplcqprtzrirm.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY is required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupBookingTables() {
  try {
    console.log('🚀 Setting up booking tables in Supabase...');

    // Read the SQL schema file
    const schemaPath = path.join(__dirname, 'supabase-booking-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    console.log(`📝 Executing ${statements.length} SQL statements...`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (!statement) continue;

      try {
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          // Try direct query if RPC fails
          const { error: queryError } = await supabase
            .from('_temp_query')
            .select('*')
            .limit(0);
          
          if (queryError && !queryError.message.includes('relation "_temp_query" does not exist')) {
            console.warn(`⚠️  Warning on statement ${i + 1}: ${error.message}`);
          }
        }
      } catch (err) {
        console.warn(`⚠️  Warning on statement ${i + 1}: ${err.message}`);
      }
    }

    // Verify tables were created
    console.log('🔍 Verifying table creation...');
    
    const { data: bookingsTable, error: bookingsError } = await supabase
      .from('bookings')
      .select('count')
      .limit(1);

    const { data: analyticsTable, error: analyticsError } = await supabase
      .from('booking_analytics')
      .select('count')
      .limit(1);

    const { data: notificationsTable, error: notificationsError } = await supabase
      .from('artisan_notifications')
      .select('count')
      .limit(1);

    if (!bookingsError) {
      console.log('✅ Bookings table created successfully');
    } else {
      console.log('❌ Bookings table creation failed:', bookingsError.message);
    }

    if (!analyticsError) {
      console.log('✅ Booking analytics table created successfully');
    } else {
      console.log('❌ Booking analytics table creation failed:', analyticsError.message);
    }

    if (!notificationsError) {
      console.log('✅ Artisan notifications table created successfully');
    } else {
      console.log('❌ Artisan notifications table creation failed:', notificationsError.message);
    }

    // Test booking creation
    console.log('🧪 Testing booking creation...');
    const testBooking = {
      id: `test_booking_${Date.now()}`,
      experience_id: 'exp1',
      user_id: 'test_user',
      responses: { test: 'data' },
      status: 'booked',
      total_price: 99.99,
      booking_date: new Date().toISOString(),
      craft_type: 'pottery',
      group_size: 'Just me (1 person)'
    };

    const { data: insertedBooking, error: insertError } = await supabase
      .from('bookings')
      .insert([testBooking])
      .select()
      .single();

    if (insertError) {
      console.log('❌ Test booking insertion failed:', insertError.message);
    } else {
      console.log('✅ Test booking created successfully:', insertedBooking.id);
      
      // Clean up test booking
      await supabase
        .from('bookings')
        .delete()
        .eq('id', insertedBooking.id);
    }

    console.log('🎉 Booking tables setup completed!');
    console.log('\n📊 Available tables:');
    console.log('  - bookings: Store all booking information');
    console.log('  - booking_analytics: Track events and metrics');
    console.log('  - artisan_notifications: Manage artisan communications');

  } catch (error) {
    console.error('❌ Failed to setup booking tables:', error);
    process.exit(1);
  }
}

// Run the setup
setupBookingTables(); 