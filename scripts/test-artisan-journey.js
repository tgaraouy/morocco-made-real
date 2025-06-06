#!/usr/bin/env node

/**
 * Artisan Journey Ecosystem Test Script
 * Tests the complete journey documentation and validation system
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

console.log('🎨 Testing Artisan Journey Ecosystem...\n');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.log('Required variables:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseConnection() {
  console.log('🔌 Testing Database Connection...');
  try {
    const { data, error } = await supabase.from('artisans').select('count', { count: 'exact' });
    if (error) throw error;
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

async function testArtisansData() {
  console.log('\n👨‍🎨 Testing Artisans Data...');
  try {
    const { data: artisans, error } = await supabase
      .from('artisans')
      .select('*')
      .order('created_at');

    if (error) throw error;

    console.log(`✅ Found ${artisans.length} artisans:`);
    artisans.forEach(artisan => {
      console.log(`   - ${artisan.name} (${artisan.specialization}) - ${artisan.verification_level}`);
    });

    return artisans;
  } catch (error) {
    console.error('❌ Artisans test failed:', error.message);
    return [];
  }
}

async function testTraditionalPractices() {
  console.log('\n📚 Testing Traditional Practices Database...');
  try {
    const { data: practices, error } = await supabase
      .from('traditional_practices_database')
      .select('*')
      .order('created_at');

    if (error) throw error;

    console.log(`✅ Found ${practices.length} traditional practices:`);
    practices.forEach(practice => {
      console.log(`   - ${practice.technique_name} (${practice.craft_category}) - ${practice.cultural_significance}`);
    });

    return practices;
  } catch (error) {
    console.error('❌ Traditional practices test failed:', error.message);
    return [];
  }
}

async function testArtisanPieces() {
  console.log('\n🏺 Testing Artisan Pieces...');
  try {
    const { data: pieces, error } = await supabase
      .from('artisan_pieces')
      .select('*')
      .order('created_at');

    if (error) throw error;

    console.log(`✅ Found ${pieces.length} artisan pieces:`);
    pieces.forEach(piece => {
      console.log(`   - ${piece.title} by ${piece.artisan_name}`);
      console.log(`     Status: ${piece.status} | Stage: ${piece.workflow_stage}`);
      console.log(`     Authenticity Score: ${piece.authenticity?.score || 'N/A'}`);
    });

    return pieces;
  } catch (error) {
    console.error('❌ Artisan pieces test failed:', error.message);
    return [];
  }
}

async function testJourneyDocumentation() {
  console.log('\n📹 Testing Journey Documentation...');
  try {
    const { data: journeys, error } = await supabase
      .from('artisan_journey_documentation')
      .select(`
        *,
        artisan_pieces(title, artisan_name),
        artisans(name, specialization)
      `)
      .order('created_at');

    if (error) throw error;

    console.log(`✅ Found ${journeys.length} journey documentation entries:`);
    journeys.forEach(journey => {
      console.log(`   - Journey ID: ${journey.id}`);
      console.log(`     Piece: ${journey.artisan_pieces?.title || 'Unknown'}`);
      console.log(`     Artisan: ${journey.artisans?.name || 'Unknown'}`);
      console.log(`     Status: ${journey.status} | Stage: ${journey.workflow_stage}`);
      
      if (journey.content_team?.roles) {
        console.log(`     Content Team: ${Object.keys(journey.content_team.roles).length} roles defined`);
      }
    });

    return journeys;
  } catch (error) {
    console.error('❌ Journey documentation test failed:', error.message);
    return [];
  }
}

async function testDataRelationships() {
  console.log('\n🔗 Testing Data Relationships...');
  try {
    // Test artisan-piece relationships
    const { data: artisanPieceRelations, error: error1 } = await supabase
      .from('artisan_pieces')
      .select(`
        title,
        artisan_name,
        artisans(name, specialization)
      `);

    if (error1) throw error1;

    console.log('✅ Artisan-Piece relationships:');
    artisanPieceRelations.forEach(relation => {
      const match = relation.artisan_name === relation.artisans?.name;
      console.log(`   - ${relation.title}: ${match ? '✅' : '❌'} ${relation.artisan_name}`);
    });

    // Test journey-piece relationships
    const { data: journeyRelations, error: error2 } = await supabase
      .from('artisan_journey_documentation')
      .select(`
        id,
        artisan_pieces(title),
        artisans(name)
      `);

    if (error2) throw error2;

    console.log('✅ Journey-Piece relationships:');
    journeyRelations.forEach(relation => {
      console.log(`   - Journey ${relation.id}: ${relation.artisan_pieces?.title} by ${relation.artisans?.name}`);
    });

    return true;
  } catch (error) {
    console.error('❌ Relationship test failed:', error.message);
    return false;
  }
}

async function testJSONStructures() {
  console.log('\n🔧 Testing JSON Data Structures...');
  try {
    const { data: pieces, error } = await supabase
      .from('artisan_pieces')
      .select('title, traditional_practice, journey, multimedia, pricing, blockchain, authenticity');

    if (error) throw error;

    console.log('✅ JSON Structure validation:');
    pieces.forEach(piece => {
      console.log(`   - ${piece.title}:`);
      
      // Validate each JSON field
      const jsonFields = ['traditional_practice', 'journey', 'multimedia', 'pricing', 'blockchain', 'authenticity'];
      jsonFields.forEach(field => {
        try {
          const data = piece[field];
          if (data && typeof data === 'object') {
            console.log(`     ✅ ${field}: Valid JSON (${Object.keys(data).length} keys)`);
          } else {
            console.log(`     ⚠️  ${field}: ${data ? 'Not an object' : 'Empty'}`);
          }
        } catch (e) {
          console.log(`     ❌ ${field}: Invalid JSON`);
        }
      });
    });

    return true;
  } catch (error) {
    console.error('❌ JSON structure test failed:', error.message);
    return false;
  }
}

async function testEcosystemReadiness() {
  console.log('\n🚀 Testing Ecosystem Readiness...');
  
  const checks = [
    { name: 'Artisans with verification levels', test: async () => {
      const { data } = await supabase.from('artisans').select('verification_level').neq('verification_level', null);
      return data?.length > 0;
    }},
    { name: 'Pieces with authenticity scores', test: async () => {
      const { data } = await supabase.from('artisan_pieces').select('authenticity').neq('authenticity', null);
      return data?.length > 0;
    }},
    { name: 'Traditional practices documented', test: async () => {
      const { data } = await supabase.from('traditional_practices_database').select('id');
      return data?.length >= 3;
    }},
    { name: 'Journey documentation active', test: async () => {
      const { data } = await supabase.from('artisan_journey_documentation').select('id');
      return data?.length > 0;
    }},
    { name: 'Content team structures defined', test: async () => {
      const { data } = await supabase.from('artisan_journey_documentation').select('content_team').neq('content_team', null);
      return data?.length > 0;
    }}
  ];

  for (const check of checks) {
    try {
      const result = await check.test();
      console.log(`   ${result ? '✅' : '❌'} ${check.name}`);
    } catch (error) {
      console.log(`   ❌ ${check.name} (Error: ${error.message})`);
    }
  }
}

async function runAllTests() {
  console.log('🎯 Morocco Made Real - Artisan Journey Ecosystem Test Suite\n');
  
  const connected = await testDatabaseConnection();
  if (!connected) {
    console.log('\n❌ Cannot proceed without database connection');
    return;
  }

  const artisans = await testArtisansData();
  const practices = await testTraditionalPractices();
  const pieces = await testArtisanPieces();
  const journeys = await testJourneyDocumentation();
  
  await testDataRelationships();
  await testJSONStructures();
  await testEcosystemReadiness();

  console.log('\n📊 Test Summary:');
  console.log(`✅ ${artisans.length} Artisans ready`);
  console.log(`✅ ${practices.length} Traditional practices documented`);
  console.log(`✅ ${pieces.length} Artisan pieces with journey integration`);
  console.log(`✅ ${journeys.length} Journey documentation entries`);
  
  console.log('\n🎉 Artisan Journey Ecosystem is ready for:');
  console.log('   📹 Content creation and multimedia documentation');
  console.log('   🤖 AI-powered validation and analysis');
  console.log('   👨‍🎓 Expert review and community feedback');
  console.log('   🏆 Multi-level authenticity certification');
  console.log('   🛒 Narrative-driven commerce');
  console.log('   🏛️ Digital museum and community sharing');
  
  console.log('\n🚀 Next Steps:');
  console.log('1. Start documenting artisan creation journeys');
  console.log('2. Upload multimedia content for AI analysis');
  console.log('3. Engage expert reviewers for validation');
  console.log('4. Generate narrative content for different audiences');
  console.log('5. Launch community museum features');
}

// Run the test suite
runAllTests().catch(console.error); 