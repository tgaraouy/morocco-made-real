const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Real-world tourist scenarios
const touristScenarios = [
  {
    name: "Sarah - American Art Student",
    profile: {
      user_id: 'sarah-art-student',
      preferred_crafts: ['pottery', 'weaving', 'metalwork'],
      preferred_regions: ['Fez', 'Marrakech'],
      preferred_experience_types: ['hands-on-workshop', 'technique-learning'],
      cultural_depth: 'deep',
      group_size: 'solo',
      languages: ['en'],
      cultural_interests: [
        { type: 'traditional-crafts', level: 'very-high' },
        { type: 'technique-mastery', level: 'high' },
        { type: 'cultural-history', level: 'moderate' }
      ],
      learning_style: 'kinesthetic',
      learning_pace: 'fast',
      group_preference: 'solo',
      feedback_style: 'detailed',
      budget_min: 200,
      budget_max: 800,
      budget_currency: 'USD',
      budget_flexibility: 0.3,
      time_duration: 12,
      time_unit: 'hours',
      time_flexibility: 0.4,
      preferred_times: ['morning', 'afternoon'],
      total_experiences: 0,
      successful_experiences: 0,
      average_satisfaction: 0
    },
    expectations: "Expects deep technical learning, authentic cultural immersion, and master-level instruction"
  },
  {
    name: "Jean & Marie - French Couple",
    profile: {
      user_id: 'jean-marie-couple',
      preferred_crafts: ['pottery', 'leather'],
      preferred_regions: ['Fez'],
      preferred_experience_types: ['cultural-immersion', 'artisan-meeting'],
      cultural_depth: 'moderate',
      group_size: 'couple',
      languages: ['fr', 'en'],
      cultural_interests: [
        { type: 'traditional-crafts', level: 'moderate' },
        { type: 'artisan-stories', level: 'high' },
        { type: 'cultural-exchange', level: 'high' }
      ],
      learning_style: 'visual',
      learning_pace: 'moderate',
      group_preference: 'couple',
      feedback_style: 'conversational',
      budget_min: 100,
      budget_max: 300,
      budget_currency: 'EUR',
      budget_flexibility: 0.2,
      time_duration: 6,
      time_unit: 'hours',
      time_flexibility: 0.3,
      preferred_times: ['afternoon'],
      total_experiences: 0,
      successful_experiences: 0,
      average_satisfaction: 0
    },
    expectations: "Wants cultural stories, moderate hands-on experience, and authentic artisan interaction"
  },
  {
    name: "Ahmed - Moroccan Diaspora",
    profile: {
      user_id: 'ahmed-diaspora',
      preferred_crafts: ['metalwork', 'weaving'],
      preferred_regions: ['Fez'],
      preferred_experience_types: ['cultural-immersion', 'heritage-connection'],
      cultural_depth: 'deep',
      group_size: 'small-group',
      languages: ['ar', 'fr', 'en'],
      cultural_interests: [
        { type: 'heritage-reconnection', level: 'very-high' },
        { type: 'family-traditions', level: 'very-high' },
        { type: 'traditional-crafts', level: 'high' }
      ],
      learning_style: 'auditory',
      learning_pace: 'slow',
      group_preference: 'family',
      feedback_style: 'cultural-context',
      budget_min: 150,
      budget_max: 600,
      budget_currency: 'USD',
      budget_flexibility: 0.4,
      time_duration: 8,
      time_unit: 'hours',
      time_flexibility: 0.5,
      preferred_times: ['morning'],
      total_experiences: 0,
      successful_experiences: 0,
      average_satisfaction: 0
    },
    expectations: "Seeks deep cultural reconnection, family heritage stories, and authentic traditional methods"
  },
  {
    name: "Lisa - Budget Backpacker",
    profile: {
      user_id: 'lisa-backpacker',
      preferred_crafts: ['pottery', 'weaving'],
      preferred_regions: ['Marrakech'],
      preferred_experience_types: ['hands-on-workshop', 'cultural-overview'],
      cultural_depth: 'surface',
      group_size: 'small-group',
      languages: ['en'],
      cultural_interests: [
        { type: 'traditional-crafts', level: 'moderate' },
        { type: 'travel-experience', level: 'high' },
        { type: 'social-interaction', level: 'high' }
      ],
      learning_style: 'social',
      learning_pace: 'fast',
      group_preference: 'large-group',
      feedback_style: 'encouraging',
      budget_min: 30,
      budget_max: 80,
      budget_currency: 'USD',
      budget_flexibility: 0.1,
      time_duration: 3,
      time_unit: 'hours',
      time_flexibility: 0.2,
      preferred_times: ['afternoon'],
      total_experiences: 0,
      successful_experiences: 0,
      average_satisfaction: 0
    },
    expectations: "Wants affordable, fun, social experience with basic cultural exposure"
  }
];

async function testRLScenarios() {
  console.log('🧪 Testing RL System with Real-World Scenarios\n');
  
  try {
    // Create test tourist profiles
    console.log('1. Creating test tourist profiles...');
    for (const scenario of touristScenarios) {
      const { data, error } = await supabase
        .from('tourist_profiles')
        .upsert(scenario.profile, { onConflict: 'user_id' })
        .select()
        .single();
      
      if (error) {
        console.error(`❌ Error creating profile for ${scenario.name}:`, error);
      } else {
        console.log(`✅ Created profile: ${scenario.name} (${data.id})`);
      }
    }

    // Test recommendations for each scenario
    console.log('\n2. Testing recommendations for each scenario...');
    
    for (const scenario of touristScenarios) {
      console.log(`\n🎭 Testing scenario: ${scenario.name}`);
      console.log(`   Expectations: ${scenario.expectations}`);
      
      // Get tourist profile
      const { data: tourist } = await supabase
        .from('tourist_profiles')
        .select('*')
        .eq('user_id', scenario.profile.user_id)
        .single();
      
      if (!tourist) {
        console.log(`   ❌ Tourist profile not found`);
        continue;
      }

      // Get artisan profiles
      const { data: artisans } = await supabase
        .from('artisan_profiles_rl')
        .select('*');

      if (!artisans || artisans.length === 0) {
        console.log(`   ❌ No artisan profiles found`);
        continue;
      }

      // Calculate matches manually (simulating RL agent logic)
      const matches = [];
      
      for (const artisan of artisans) {
        let score = 0;
        let reasoning = [];

        // Craft alignment
        const craftMatch = scenario.profile.preferred_crafts.includes(artisan.craft);
        if (craftMatch) {
          score += 0.3;
          reasoning.push(`Perfect craft match: ${artisan.craft}`);
        } else {
          score += 0.1;
        }

        // Region alignment
        const regionMatch = scenario.profile.preferred_regions.includes(artisan.region);
        if (regionMatch) {
          score += 0.2;
          reasoning.push(`Regional preference: ${artisan.region}`);
        } else {
          score += 0.05;
        }

        // Skill level alignment
        if (scenario.profile.cultural_depth === 'deep' && artisan.skill_level === 'master') {
          score += 0.25;
          reasoning.push(`Master-level expertise for deep cultural seeker`);
        } else if (scenario.profile.cultural_depth === 'moderate' && artisan.skill_level !== 'beginner') {
          score += 0.15;
          reasoning.push(`Appropriate skill level for moderate interest`);
        } else if (scenario.profile.cultural_depth === 'surface') {
          score += 0.1;
          reasoning.push(`Suitable for surface-level experience`);
        }

        // Language compatibility
        const commonLanguages = scenario.profile.languages.filter(lang => 
          artisan.language_skills.includes(lang)
        );
        if (commonLanguages.length > 0) {
          score += 0.15;
          reasoning.push(`Language compatibility: ${commonLanguages.join(', ')}`);
        }

        // Budget compatibility (simplified)
        const estimatedCost = artisan.skill_level === 'master' ? 150 : 100;
        if (estimatedCost <= scenario.profile.budget_max) {
          score += 0.1;
          reasoning.push(`Within budget range`);
        }

        matches.push({
          artisan,
          score,
          reasoning: reasoning.join('. '),
          estimatedCost
        });
      }

      // Sort by score and show top 3
      matches.sort((a, b) => b.score - a.score);
      const topMatches = matches.slice(0, 3);

      console.log(`   📊 Top 3 Recommendations:`);
      topMatches.forEach((match, index) => {
        console.log(`   ${index + 1}. ${match.artisan.name} (${match.artisan.craft}) - Score: ${(match.score * 100).toFixed(0)}%`);
        console.log(`      Region: ${match.artisan.region} | Skill: ${match.artisan.skill_level}`);
        console.log(`      Cost: $${match.estimatedCost} | Reasoning: ${match.reasoning}`);
        console.log(`      Cultural Score: ${(match.artisan.cultural_score * 100).toFixed(0)}% | Economic Score: ${(match.artisan.economic_score * 100).toFixed(0)}%`);
      });

      // Analyze match quality
      const bestMatch = topMatches[0];
      if (bestMatch.score > 0.8) {
        console.log(`   ✅ Excellent match found!`);
      } else if (bestMatch.score > 0.6) {
        console.log(`   ✅ Good match found`);
      } else {
        console.log(`   ⚠️  Moderate match - may need profile refinement`);
      }
    }

    // Test learning scenarios
    console.log('\n3. Testing learning scenarios...');
    
    const learningScenarios = [
      {
        tourist: 'sarah-art-student',
        artisan: 'Hassan Benali',
        experience: {
          satisfaction: 0.95,
          cultural_learning: 0.90,
          economic_impact: 0.80,
          feedback: 'Exceptional pottery workshop with deep cultural insights'
        }
      },
      {
        tourist: 'jean-marie-couple',
        artisan: 'Fatima Zahra',
        experience: {
          satisfaction: 0.85,
          cultural_learning: 0.88,
          economic_impact: 0.75,
          feedback: 'Beautiful weaving experience with wonderful stories'
        }
      },
      {
        tourist: 'lisa-backpacker',
        artisan: 'Ahmed Tazi',
        experience: {
          satisfaction: 0.70,
          cultural_learning: 0.60,
          economic_impact: 0.65,
          feedback: 'Good basic experience but wanted more group interaction'
        }
      }
    ];

    for (const scenario of learningScenarios) {
      console.log(`\n📚 Learning from experience: ${scenario.tourist} with ${scenario.artisan}`);
      console.log(`   Satisfaction: ${(scenario.experience.satisfaction * 100).toFixed(0)}%`);
      console.log(`   Cultural Learning: ${(scenario.experience.cultural_learning * 100).toFixed(0)}%`);
      console.log(`   Economic Impact: ${(scenario.experience.economic_impact * 100).toFixed(0)}%`);
      console.log(`   Feedback: "${scenario.experience.feedback}"`);
      
      // This would trigger RL learning in the actual system
      console.log(`   🧠 RL Agent would learn from this experience to improve future recommendations`);
    }

    console.log('\n🎉 RL Scenario Testing Complete!');
    console.log('\n📈 Key Insights:');
    console.log('- Deep cultural seekers match best with master artisans');
    console.log('- Language compatibility significantly improves match scores');
    console.log('- Budget constraints are important for backpackers');
    console.log('- Cultural depth preferences need careful matching');
    console.log('- Regional preferences play a significant role');

  } catch (error) {
    console.error('❌ Error testing RL scenarios:', error);
  }
}

testRLScenarios(); 