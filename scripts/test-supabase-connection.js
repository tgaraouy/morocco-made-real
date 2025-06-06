const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...\n');

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('📋 Environment Variables:');
  console.log(`- NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
  console.log(`- NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ Set' : '❌ Missing'}\n`);

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('❌ Supabase environment variables are not configured.');
    console.log('📝 Create a .env.local file with:');
    console.log(`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co`);
    console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key`);
    return false;
  }

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    console.log('🔗 Testing basic connection...');
    
    // Test basic connection by attempting to fetch data
    const { data: testData, error: testError } = await supabase
      .from('cultural_experiences')
      .select('count', { count: 'exact', head: true });

    if (testError) {
      console.log('❌ Connection failed:', testError.message);
      
      if (testError.message.includes('relation "cultural_experiences" does not exist')) {
        console.log('\n📋 The cultural_experiences table does not exist yet.');
        console.log('🚀 To create it:');
        console.log('1. Go to your Supabase dashboard: https://app.supabase.com/');
        console.log('2. Navigate to: Project → SQL Editor');
        console.log('3. Run the migration: supabase/migrations/008_cultural_experiences.sql');
        return false;
      }
      
      return false;
    }

    console.log('✅ Basic connection successful!');
    console.log(`📊 Found ${testData || 0} experiences in the database.\n`);

    // Test fetching actual data
    console.log('📋 Testing data fetch...');
    const { data: experiences, error: fetchError } = await supabase
      .from('cultural_experiences')
      .select('id, title, artisan_name, price')
      .limit(3);

    if (fetchError) {
      console.log('❌ Data fetch failed:', fetchError.message);
      return false;
    }

    if (!experiences || experiences.length === 0) {
      console.log('⚠️ No experiences found in the database.');
      console.log('📝 The table exists but is empty. Run the migration to populate it.');
      return false;
    }

    console.log('✅ Data fetch successful!');
    console.log('📝 Sample experiences:');
    experiences.forEach((exp, index) => {
      console.log(`   ${index + 1}. ${exp.title} - ${exp.artisan_name} (€${exp.price})`);
    });

    console.log('\n🎉 Supabase integration is working correctly!');
    console.log('✅ Environment variables configured');
    console.log('✅ Database connection established');
    console.log('✅ cultural_experiences table exists');
    console.log('✅ Data is populated');

    return true;

  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
    return false;
  }
}

// Test ExperiencesService
async function testExperiencesService() {
  console.log('\n🧪 Testing ExperiencesService...\n');

  try {
    // Import the service (need to use require for Node.js)
    const ExperiencesService = require('../lib/experiences-service.ts');
    
    if (!ExperiencesService || !ExperiencesService.default) {
      console.log('❌ Could not import ExperiencesService');
      return false;
    }

    const service = ExperiencesService.default;

    // Test getting all experiences
    console.log('📋 Testing getExperiences()...');
    const experiences = await service.getExperiences();
    
    if (experiences && experiences.length > 0) {
      console.log(`✅ Retrieved ${experiences.length} experiences`);
      console.log(`📝 First experience: ${experiences[0].title}`);
    } else {
      console.log('⚠️ No experiences returned from service');
    }

    // Test filtering by mood
    console.log('\n📋 Testing mood filtering...');
    const creativeExperiences = await service.getMatchingExperiences('creative');
    console.log(`✅ Found ${creativeExperiences.length} creative experiences`);

    return true;

  } catch (error) {
    console.log('❌ ExperiencesService test failed:', error.message);
    return false;
  }
}

// Run tests
async function runAllTests() {
  console.log('🚀 Morocco Made Real - Supabase Validation\n');
  
  const connectionTest = await testSupabaseConnection();
  
  if (connectionTest) {
    await testExperiencesService();
  }
  
  console.log('\n🏁 Test completed.');
}

runAllTests().catch(console.error); 