const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function seedSampleData() {
  console.log('🌱 Seeding sample data for RL system...');
  
  try {
    // 1. Create sample tourist profiles
    console.log('\n1. Creating sample tourist profiles...');
    const touristProfiles = [
      {
        user_id: 'demo-tourist-001',
        preferred_crafts: ['pottery', 'weaving'],
        preferred_regions: ['Fez', 'Marrakech'],
        preferred_experience_types: ['hands-on-workshop', 'cultural-immersion'],
        cultural_depth: 'moderate',
        group_size: 'couple',
        languages: ['en', 'fr'],
        cultural_interests: [
          { type: 'traditional-crafts', level: 'high' },
          { type: 'history', level: 'moderate' }
        ],
        learning_style: 'visual',
        learning_pace: 'moderate',
        group_preference: 'small-group',
        feedback_style: 'immediate',
        budget_min: 50,
        budget_max: 200,
        budget_currency: 'USD',
        budget_flexibility: 0.2,
        time_duration: 4,
        time_unit: 'hours',
        time_flexibility: 0.3,
        preferred_times: ['morning', 'afternoon'],
        total_experiences: 0,
        successful_experiences: 0,
        average_satisfaction: 0
      },
      {
        user_id: 'demo-tourist-002',
        preferred_crafts: ['leather', 'metalwork'],
        preferred_regions: ['Fez'],
        preferred_experience_types: ['technique-learning', 'artisan-meeting'],
        cultural_depth: 'deep',
        group_size: 'solo',
        languages: ['en'],
        cultural_interests: [
          { type: 'traditional-crafts', level: 'very-high' },
          { type: 'artisan-stories', level: 'high' }
        ],
        learning_style: 'kinesthetic',
        learning_pace: 'slow',
        group_preference: 'solo',
        feedback_style: 'detailed',
        budget_min: 100,
        budget_max: 500,
        budget_currency: 'USD',
        budget_flexibility: 0.1,
        time_duration: 8,
        time_unit: 'hours',
        time_flexibility: 0.2,
        preferred_times: ['morning'],
        total_experiences: 0,
        successful_experiences: 0,
        average_satisfaction: 0
      }
    ];

    for (const profile of touristProfiles) {
      const { data, error } = await supabase
        .from('tourist_profiles')
        .upsert(profile, { onConflict: 'user_id' })
        .select()
        .single();
      
      if (error) {
        console.error(`Error creating tourist profile ${profile.user_id}:`, error);
      } else {
        console.log(`✅ Created tourist profile: ${profile.user_id} (${data.id})`);
      }
    }

    // 2. Create sample artisan profiles
    console.log('\n2. Creating sample artisan profiles...');
    
    const artisanProfiles = [
      {
        artisan_id: '11111111-1111-1111-1111-111111111111',
        name: 'Hassan Benali',
        craft: 'pottery',
        region: 'Fez',
        skill_level: 'master',
        techniques: [
          { name: 'wheel-throwing', mastery: 0.95 },
          { name: 'glazing', mastery: 0.90 },
          { name: 'traditional-firing', mastery: 0.85 }
        ],
        cultural_knowledge: {
          traditions: ['Fassi pottery traditions', 'Islamic geometric patterns'],
          history: 'Third generation potter from Fez medina',
          techniques: ['Traditional wood firing', 'Natural clay preparation'],
          stories: ['Family pottery workshop stories', 'Medina craft traditions'],
          languages: ['ar', 'fr', 'en']
        },
        teaching_approach: 'traditional',
        patience_level: 0.9,
        adaptability: 0.7,
        cultural_sensitivity: 0.95,
        language_skills: ['ar', 'fr', 'en'],
        availability: {
          schedule: 'morning-afternoon',
          capacity: 4,
          booking_requirements: 'advance-booking'
        },
        monthly_target: 2000,
        yearly_target: 24000,
        growth_rate: 0.15,
        diversification_goals: ['online-workshops', 'cultural-tours'],
        total_tourists_hosted: 0,
        average_rating: 0,
        cultural_score: 0.9,
        economic_score: 0.7
      },
      {
        artisan_id: '22222222-2222-2222-2222-222222222222',
        name: 'Fatima Zahra',
        craft: 'weaving',
        region: 'Marrakech',
        skill_level: 'master',
        techniques: [
          { name: 'traditional-loom', mastery: 0.98 },
          { name: 'natural-dyeing', mastery: 0.92 },
          { name: 'pattern-design', mastery: 0.88 }
        ],
        cultural_knowledge: {
          traditions: ['Berber weaving traditions', 'Marrakech textile arts'],
          history: 'Learned from grandmother, master weaver',
          techniques: ['Traditional loom setup', 'Natural dye preparation'],
          stories: ['Berber women weaving traditions', 'Atlas mountain textile heritage'],
          languages: ['ar', 'ber', 'fr']
        },
        teaching_approach: 'traditional',
        patience_level: 0.95,
        adaptability: 0.8,
        cultural_sensitivity: 0.98,
        language_skills: ['ar', 'ber', 'fr'],
        availability: {
          schedule: 'morning',
          capacity: 3,
          booking_requirements: 'advance-booking'
        },
        monthly_target: 1800,
        yearly_target: 21600,
        growth_rate: 0.12,
        diversification_goals: ['textile-design', 'cultural-workshops'],
        total_tourists_hosted: 0,
        average_rating: 0,
        cultural_score: 0.95,
        economic_score: 0.65
      },
      {
        artisan_id: '33333333-3333-3333-3333-333333333333',
        name: 'Ahmed Tazi',
        craft: 'leather',
        region: 'Fez',
        skill_level: 'advanced',
        techniques: [
          { name: 'traditional-tanning', mastery: 0.85 },
          { name: 'hand-stitching', mastery: 0.90 },
          { name: 'embossing', mastery: 0.80 }
        ],
        cultural_knowledge: {
          traditions: ['Fez leather traditions', 'Chouara tannery methods'],
          history: 'Family leather business for generations',
          techniques: ['Traditional tanning process', 'Hand-crafted leather goods'],
          stories: ['Tannery quarter traditions', 'Leather craft heritage'],
          languages: ['ar', 'fr']
        },
        teaching_approach: 'hybrid',
        patience_level: 0.8,
        adaptability: 0.85,
        cultural_sensitivity: 0.88,
        language_skills: ['ar', 'fr'],
        availability: {
          schedule: 'afternoon',
          capacity: 2,
          booking_requirements: 'flexible'
        },
        monthly_target: 1500,
        yearly_target: 18000,
        growth_rate: 0.18,
        diversification_goals: ['modern-designs', 'international-markets'],
        total_tourists_hosted: 0,
        average_rating: 0,
        cultural_score: 0.85,
        economic_score: 0.75
      },
      {
        artisan_id: '44444444-4444-4444-4444-444444444444',
        name: 'Youssef El Fassi',
        craft: 'metalwork',
        region: 'Fez',
        skill_level: 'master',
        techniques: [
          { name: 'brass-engraving', mastery: 0.93 },
          { name: 'silver-inlay', mastery: 0.88 },
          { name: 'traditional-forging', mastery: 0.90 }
        ],
        cultural_knowledge: {
          traditions: ['Fassi metalwork traditions', 'Islamic calligraphy in metal'],
          history: 'Master metalworker trained in traditional methods',
          techniques: ['Hand-forging', 'Traditional engraving tools'],
          stories: ['Metalwork souk traditions', 'Artisan guild heritage'],
          languages: ['ar', 'fr', 'en']
        },
        teaching_approach: 'traditional',
        patience_level: 0.85,
        adaptability: 0.75,
        cultural_sensitivity: 0.92,
        language_skills: ['ar', 'fr', 'en'],
        availability: {
          schedule: 'morning-afternoon',
          capacity: 3,
          booking_requirements: 'advance-booking'
        },
        monthly_target: 2200,
        yearly_target: 26400,
        growth_rate: 0.10,
        diversification_goals: ['artistic-pieces', 'cultural-education'],
        total_tourists_hosted: 0,
        average_rating: 0,
        cultural_score: 0.92,
        economic_score: 0.80
      }
    ];

    for (const profile of artisanProfiles) {
      const { data, error } = await supabase
        .from('artisan_profiles_rl')
        .insert(profile)
        .select()
        .single();
      
      if (error) {
        console.error(`Error creating artisan profile ${profile.name}:`, error);
      } else {
        console.log(`✅ Created artisan profile: ${profile.name} (${data.id})`);
      }
    }

    // 3. Create sample recommendations
    console.log('\n3. Creating sample recommendations...');
    
    // Get the created tourist and artisan profiles
    const { data: tourists } = await supabase
      .from('tourist_profiles')
      .select('id, user_id');
    
    const { data: artisans } = await supabase
      .from('artisan_profiles_rl')
      .select('id, name, craft');

    if (tourists && artisans && tourists.length > 0 && artisans.length > 0) {
      const recommendations = [
        {
          agent_type: 'tourist-matching',
          tourist_profile_id: tourists[0].id,
          artisan_profile_id: artisans[0].id,
          confidence: 0.85,
          cultural_score: 0.90,
          economic_score: 0.75,
          overall_score: 0.83,
          reasoning: 'High cultural alignment with pottery interest and moderate budget',
          cultural_context: 'Traditional Fassi pottery workshop with master craftsman',
          experience_type: 'hands-on-workshop',
          estimated_duration: 4,
          estimated_cost: 120,
          presented_to_user: false,
          user_clicked: false,
          user_booked: false,
          user_completed: false,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          policy_version: 1
        },
        {
          agent_type: 'tourist-matching',
          tourist_profile_id: tourists[0].id,
          artisan_profile_id: artisans[1].id,
          confidence: 0.78,
          cultural_score: 0.88,
          economic_score: 0.70,
          overall_score: 0.79,
          reasoning: 'Good match for weaving interest and cultural immersion preference',
          cultural_context: 'Traditional Berber weaving experience with master weaver',
          experience_type: 'cultural-immersion',
          estimated_duration: 6,
          estimated_cost: 150,
          presented_to_user: false,
          user_clicked: false,
          user_booked: false,
          user_completed: false,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          policy_version: 1
        }
      ];

      for (const rec of recommendations) {
        const { data, error } = await supabase
          .from('rl_recommendations')
          .insert(rec)
          .select()
          .single();
        
        if (error) {
          console.error('Error creating recommendation:', error);
        } else {
          console.log(`✅ Created recommendation: ${artisans.find(a => a.id === rec.artisan_profile_id)?.name} for ${tourists.find(t => t.id === rec.tourist_profile_id)?.user_id}`);
        }
      }
    }

    // 4. Initialize agent performance
    console.log('\n4. Initializing agent performance...');
    const agentPerformance = {
      agent_type: 'tourist-matching',
      experience_count: 0,
      cultural_score: 0.8,
      economic_score: 0.7,
      satisfaction_score: 0.75,
      overall_performance: 0.75,
      policy_version: 1,
      learning_rate: 0.01,
      exploration_rate: 0.1,
      config: {
        learningRate: 0.01,
        explorationRate: 0.1,
        culturalWeight: 0.4,
        economicWeight: 0.3,
        satisfactionWeight: 0.3
      },
      is_learning: false
    };

    const { data: perfData, error: perfError } = await supabase
      .from('rl_agent_performance')
      .upsert(agentPerformance, { onConflict: 'agent_type' })
      .select()
      .single();
    
    if (perfError) {
      console.error('Error creating agent performance:', perfError);
    } else {
      console.log('✅ Initialized agent performance for tourist-matching');
    }

    console.log('\n🎉 Sample data seeding completed successfully!');
    console.log('\nYou can now test the RL system with:');
    console.log('- Tourist ID: demo-tourist-001');
    console.log('- Tourist ID: demo-tourist-002');
    console.log('- 4 artisan profiles with different crafts');
    console.log('- Sample recommendations');
    console.log('- Initialized agent performance');

  } catch (error) {
    console.error('❌ Error seeding sample data:', error);
  }
}

seedSampleData(); 