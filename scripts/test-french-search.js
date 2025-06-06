#!/usr/bin/env node

/**
 * Test script for French text search functionality
 * Verifies that the search vector works correctly with French language configuration
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testFrenchSearch() {
  console.log('🇫🇷 Testing French Text Search...\n');

  // Test queries in French
  const frenchQueries = [
    'poterie',
    'artisan',
    'traditionnel',
    'marocain',
    'céramique',
    'Safi'
  ];

  console.log('📝 Testing French search queries:');
  for (const query of frenchQueries) {
    try {
      const { data, error } = await supabase
        .from('experience_submissions')
        .select('title, artisan_name, craft, location')
        .textSearch('search_vector', query, { config: 'french' })
        .limit(3);

      if (error) {
        console.log(`❌ Error searching for "${query}": ${error.message}`);
      } else {
        console.log(`✅ Query: "${query}" -> ${data.length} results`);
        data.forEach(item => {
          console.log(`   - ${item.title} by ${item.artisan_name} (${item.craft})`);
        });
      }
    } catch (err) {
      console.log(`❌ Exception for "${query}": ${err.message}`);
    }
    console.log('');
  }

  // Test multilingual search function
  console.log('🌍 Testing multilingual search function:');
  try {
    const { data, error } = await supabase.rpc('search_experiences_multilingual', {
      search_query: 'poterie',
      search_language: 'french'
    });

    if (error) {
      console.log(`❌ Multilingual search error: ${error.message}`);
    } else {
      console.log(`✅ Multilingual search: ${data.length} results`);
      data.forEach(item => {
        console.log(`   - ${item.title} by ${item.artisan_name} (rank: ${item.rank})`);
      });
    }
  } catch (err) {
    console.log(`❌ Multilingual search exception: ${err.message}`);
  }

  console.log('\n🎯 French search configuration test complete!');
}

// Run the test
testFrenchSearch().catch(console.error); 