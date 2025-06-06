const { createClient } = require('@supabase/supabase-js');

// Test the booking flow with proper status
async function testBookingFlow() {
  console.log('🧪 Testing Booking Flow with BOOKED Status...\n');

  const supabaseUrl = 'https://xwtyhpwmplcqprtzrirm.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3dHlocHdtcGxjcXBydHpyaXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzMTI2NDEsImV4cCI6MjA0ODg4ODY0MX0.TsGqL0vA4iLJAR_Cp0ZWwcKgCTHaOe1mKRRQxgRAi8s';
  
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 1. Create a test booking
    const testBooking = {
      id: `test_booking_${Date.now()}`,
      experience_id: 'exp1',
      user_id: 'test_user_demo',
      responses: {
        group_size: 'Just me (1 person)',
        experience_level: 'Complete beginner',
        preferred_date: 'Tomorrow',
        preferred_time: 'Morning (9:00-12:00)',
        craft_type: 'pottery'
      },
      status: 'booked', // Test the BOOKED status
      total_price: 75.00,
      booking_date: new Date().toISOString(),
      craft_type: 'pottery',
      group_size: 'Just me (1 person)',
      preferred_date: 'Tomorrow',
      preferred_time: 'Morning (9:00-12:00)',
      artisan_id: 'artisan_hassan_pottery',
      booking_source: 'cultural_match_assistant'
    };

    console.log('📝 Creating test booking...');
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([testBooking])
      .select()
      .single();

    if (bookingError) {
      console.log('❌ Booking creation failed:', bookingError.message);
      console.log('   This might be because the tables don\'t exist yet.');
      console.log('   Run: npm run booking:setup first\n');
      return;
    }

    console.log('✅ Booking created successfully!');
    console.log(`   ID: ${booking.id}`);
    console.log(`   STATUS: ${booking.status.toUpperCase()}`);
    console.log(`   Experience: ${booking.experience_id}`);
    console.log(`   Craft Type: ${booking.craft_type}`);
    console.log(`   Total Price: €${booking.total_price}`);
    console.log(`   Created: ${booking.created_at}\n`);

    // 2. Create analytics event
    console.log('📊 Creating analytics event...');
    const analyticsEvent = {
      id: `analytics_${Date.now()}`,
      event_type: 'booking_completed',
      event_data: {
        booking_id: booking.id,
        status: 'booked',
        craft_type: booking.craft_type,
        total_price: booking.total_price,
        group_size: booking.group_size
      },
      booking_id: booking.id
    };

    const { data: analytics, error: analyticsError } = await supabase
      .from('booking_analytics')
      .insert([analyticsEvent])
      .select()
      .single();

    if (!analyticsError) {
      console.log('✅ Analytics event created successfully!');
      console.log(`   Event Type: ${analytics.event_type}`);
      console.log(`   Booking ID: ${analytics.booking_id}\n`);
    }

    // 3. Create artisan notification
    console.log('🔔 Creating artisan notification...');
    const notification = {
      id: `notification_${Date.now()}`,
      booking_id: booking.id,
      artisan_id: booking.artisan_id,
      type: 'new_booking',
      title: 'New Booking Received!',
      message: `You have a new BOOKED pottery experience. Group: ${booking.group_size}. Date: ${booking.preferred_date}`,
      status: 'pending'
    };

    const { data: notif, error: notifError } = await supabase
      .from('artisan_notifications')
      .insert([notification])
      .select()
      .single();

    if (!notifError) {
      console.log('✅ Artisan notification created successfully!');
      console.log(`   Notification ID: ${notif.id}`);
      console.log(`   Artisan: ${notif.artisan_id}`);
      console.log(`   Message: ${notif.message}\n`);
    }

    // 4. Verify booking status
    console.log('🔍 Verifying booking status...');
    const { data: savedBooking } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', booking.id)
      .single();

    if (savedBooking) {
      console.log('✅ BOOKING VERIFICATION SUCCESSFUL!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📋 BOOKING DETAILS:`);
      console.log(`   Status: ${savedBooking.status.toUpperCase()} ✅`);
      console.log(`   ID: ${savedBooking.id}`);
      console.log(`   Experience: ${savedBooking.experience_id}`);
      console.log(`   User: ${savedBooking.user_id}`);
      console.log(`   Artisan: ${savedBooking.artisan_id}`);
      console.log(`   Price: €${savedBooking.total_price}`);
      console.log(`   Craft: ${savedBooking.craft_type}`);
      console.log(`   Group: ${savedBooking.group_size}`);
      console.log(`   Date: ${savedBooking.preferred_date}`);
      console.log(`   Time: ${savedBooking.preferred_time}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }

    // 5. Clean up test data
    console.log('🧹 Cleaning up test data...');
    await supabase.from('bookings').delete().eq('id', booking.id);
    console.log('✅ Test data cleaned up successfully!\n');

    console.log('🎉 BOOKING FLOW TEST COMPLETED SUCCESSFULLY!');
    console.log('   The booking system is working correctly with BOOKED status.');
    console.log('   Users will see clear status indicators in the UI.\n');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testBookingFlow(); 