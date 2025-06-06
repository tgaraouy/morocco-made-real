// Test Supabase integration using Next.js environment loading
const { loadEnvConfig } = require('@next/env');
const { createClient } = require('@supabase/supabase-js');

async function testNextJSSupabase() {
  console.log('🔍 Testing Supabase with Next.js Environment Loading...\n');

  // Load environment variables the same way Next.js does
  const projectDir = process.cwd();
  loadEnvConfig(projectDir);

  // Check environment variables after Next.js loading
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('📋 Environment Variables (Next.js style):');
  console.log(`- NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
  console.log(`- NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ Set' : '❌ Missing'}`);

  if (supabaseUrl) {
    console.log(`- URL: ${supabaseUrl.substring(0, 30)}...`);
  }
  if (supabaseAnonKey) {
    console.log(`- Key: ${supabaseAnonKey.substring(0, 20)}...`);
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('\n❌ Supabase environment variables are not properly configured.');
    console.log('📝 This means the app is running in MOCK MODE.');
    return false;
  }

  // Test actual Supabase connection
  console.log('\n🔗 Testing Supabase connection...');
  
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test connection by checking for cultural_experiences table
    const { data, error, count } = await supabase
      .from('cultural_experiences')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log('❌ Connection failed:', error.message);
      
      if (error.message.includes('relation "cultural_experiences" does not exist')) {
        console.log('\n📋 The cultural_experiences table does not exist.');
        console.log('🚀 To create it:');
        console.log('1. Go to: https://app.supabase.com/');
        console.log('2. Open your project: xwtyhpwmplcqprtzrirm');
        console.log('3. Go to SQL Editor');
        console.log('4. Run: supabase/migrations/008_cultural_experiences.sql');
        return false;
      }
      
      return false;
    }

    console.log('✅ Supabase connection successful!');
    console.log(`📊 Found ${count || 0} cultural experiences in database`);

    // Test fetching actual data
    if (count && count > 0) {
      const { data: experiences, error: fetchError } = await supabase
        .from('cultural_experiences')
        .select('id, title, artisan_name, price')
        .limit(3);

      if (fetchError) {
        console.log('⚠️ Could not fetch experience data:', fetchError.message);
      } else {
        console.log('\n✅ Sample experiences from database:');
        experiences.forEach((exp, index) => {
          console.log(`   ${index + 1}. ${exp.title} by ${exp.artisan_name} (€${exp.price})`);
        });
      }
    }

    console.log('\n🎉 Supabase is properly configured and working!');
    console.log('✅ Environment variables loaded correctly');
    console.log('✅ Database connection established');
    console.log('✅ The cultural-match page should use REAL data');

    return true;

  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
    return false;
  }
}

// Test if ExperiencesService works with the real environment
async function testExperiencesServiceReal() {
  console.log('\n🧪 Testing ExperiencesService with real environment...\n');

  try {
    // Import the ExperiencesService
    const { default: ExperiencesService } = await import('../lib/experiences-service.js');
    
    console.log('📋 Testing getExperiences() method...');
    const experiences = await ExperiencesService.getExperiences({ limit: 3 });
    
    if (experiences && experiences.length > 0) {
      console.log(`✅ ExperiencesService returned ${experiences.length} experiences`);
      console.log(`📝 First experience: "${experiences[0].title}" by ${experiences[0].artisan_name}`);
      
      // Test filtering
      const creativeExperiences = await ExperiencesService.getMatchingExperiences('creative');
      console.log(`✅ Found ${creativeExperiences.length} creative experiences`);
      
      return true;
    } else {
      console.log('⚠️ ExperiencesService returned no experiences');
      console.log('📝 This suggests the database table is empty or doesn\'t exist');
      return false;
    }

  } catch (error) {
    console.log('❌ ExperiencesService test failed:', error.message);
    return false;
  }
}

// Main test function
async function main() {
  console.log('🚀 Morocco Made Real - Next.js Supabase Validation\n');
  
  const connectionTest = await testNextJSSupabase();
  
  if (connectionTest) {
    await testExperiencesServiceReal();
  }
  
  console.log('\n🏁 Test completed.');
  
  if (connectionTest) {
    console.log('\n💡 Result: Your app is using REAL Supabase data!');
    console.log('🎯 The cultural-match page fetches experiences from the database.');
  } else {
    console.log('\n💡 Result: Your app is running in MOCK MODE.');
    console.log('🎯 The cultural-match page uses hardcoded mock data.');
  }
}

main().catch(console.error); 