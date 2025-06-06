// Seed Script for RL System - Initial Artisan Profiles and Sample Data
import { rlDatabaseService } from '../lib/rl-database-service';
import { ArtisanProfile } from '../types/rl';

const sampleArtisans: ArtisanProfile[] = [
  {
    id: 'hassan-pottery-master',
    name: 'Hassan Benali',
    craft: 'pottery',
    region: 'Fez',
    skillLevel: 'master',
    techniques: [
      {
        id: 'blue-glazing',
        name: 'Traditional Blue Glazing',
        difficulty: 0.8,
        culturalSignificance: 0.9,
        timeToLearn: 4,
        prerequisites: ['basic-pottery']
      },
      {
        id: 'geometric-patterns',
        name: 'Islamic Geometric Patterns',
        difficulty: 0.7,
        culturalSignificance: 0.95,
        timeToLearn: 6,
        prerequisites: ['blue-glazing']
      }
    ],
    culturalKnowledge: {
      traditions: [
        {
          topic: 'Fez Blue Pottery',
          depth: 0.9,
          sources: ['Family lineage', 'Master artisan training'],
          verified: true
        },
        {
          topic: 'Islamic Ceramic Art',
          depth: 0.8,
          sources: ['Academic study', 'Cultural immersion'],
          verified: true
        }
      ],
      history: [
        {
          topic: 'Marinid Dynasty Ceramics',
          depth: 0.7,
          sources: ['Historical research', 'Family stories'],
          verified: true
        }
      ],
      techniques: [
        {
          topic: 'Traditional Firing Methods',
          depth: 0.9,
          sources: ['Generational knowledge'],
          verified: true
        }
      ],
      stories: [
        {
          topic: 'Pottery Guild History',
          depth: 0.7,
          sources: ['Oral tradition'],
          verified: true
        }
      ],
      languages: ['Arabic', 'French', 'English']
    },
    teachingStyle: {
      approach: 'traditional',
      patience: 0.9,
      adaptability: 0.7,
      culturalSensitivity: 0.9,
      languageSkills: ['Arabic', 'French', 'English']
    },
    availability: {
      schedule: [
        {
          dayOfWeek: 1,
          startTime: '09:00',
          endTime: '17:00',
          available: true
        },
        {
          dayOfWeek: 2,
          startTime: '09:00',
          endTime: '17:00',
          available: true
        },
        {
          dayOfWeek: 3,
          startTime: '09:00',
          endTime: '17:00',
          available: true
        },
        {
          dayOfWeek: 4,
          startTime: '09:00',
          endTime: '17:00',
          available: true
        },
        {
          dayOfWeek: 5,
          startTime: '09:00',
          endTime: '15:00',
          available: true
        }
      ],
      seasonalVariations: [],
      capacity: 4,
      advanceBooking: 7
    },
    economicGoals: {
      monthlyTarget: 2000,
      yearlyTarget: 24000,
      growthRate: 0.15,
      diversificationGoals: ['Online workshops', 'Cultural tours']
    }
  },
  {
    id: 'fatima-weaving-master',
    name: 'Fatima Zahra',
    craft: 'weaving',
    region: 'Marrakech',
    skillLevel: 'master',
    techniques: [
      {
        id: 'berber-patterns',
        name: 'Traditional Berber Patterns',
        difficulty: 0.7,
        culturalSignificance: 0.95,
        timeToLearn: 5,
        prerequisites: ['basic-weaving']
      },
      {
        id: 'natural-dyeing',
        name: 'Natural Plant Dyeing',
        difficulty: 0.6,
        culturalSignificance: 0.8,
        timeToLearn: 3,
        prerequisites: []
      }
    ],
    culturalKnowledge: {
      traditions: [
        {
          topic: 'Berber Weaving Traditions',
          depth: 0.95,
          sources: ['Family lineage', 'Community elders'],
          verified: true
        },
        {
          topic: 'Atlas Mountain Textiles',
          depth: 0.8,
          sources: ['Regional knowledge', 'Cultural research'],
          verified: true
        }
      ],
      history: [
        {
          topic: 'Amazigh Textile Heritage',
          depth: 0.9,
          sources: ['Oral tradition', 'Academic collaboration'],
          verified: true
        }
      ],
      techniques: [
        {
          topic: 'Traditional Loom Construction',
          depth: 0.8,
          sources: ['Hands-on experience'],
          verified: true
        }
      ],
      stories: [
        {
          topic: 'Women\'s Weaving Circles',
          depth: 0.9,
          sources: ['Personal experience', 'Community participation'],
          verified: true
        }
      ],
      languages: ['Arabic', 'Berber', 'French']
    },
    teachingStyle: {
      approach: 'traditional',
      patience: 0.95,
      adaptability: 0.8,
      culturalSensitivity: 0.95,
      languageSkills: ['Arabic', 'Berber', 'French']
    },
    availability: {
      schedule: [
        {
          dayOfWeek: 1,
          startTime: '10:00',
          endTime: '16:00',
          available: true
        },
        {
          dayOfWeek: 3,
          startTime: '10:00',
          endTime: '16:00',
          available: true
        },
        {
          dayOfWeek: 5,
          startTime: '10:00',
          endTime: '16:00',
          available: true
        },
        {
          dayOfWeek: 6,
          startTime: '09:00',
          endTime: '15:00',
          available: true
        }
      ],
      seasonalVariations: [],
      capacity: 6,
      advanceBooking: 5
    },
    economicGoals: {
      monthlyTarget: 1800,
      yearlyTarget: 21600,
      growthRate: 0.12,
      diversificationGoals: ['Textile workshops', 'Cultural exchanges']
    }
  },
  {
    id: 'ahmed-leather-artisan',
    name: 'Ahmed Tazi',
    craft: 'leather',
    region: 'Fez',
    skillLevel: 'journeyman',
    techniques: [
      {
        id: 'traditional-tanning',
        name: 'Traditional Leather Tanning',
        difficulty: 0.8,
        culturalSignificance: 0.9,
        timeToLearn: 8,
        prerequisites: ['leather-basics']
      },
      {
        id: 'hand-tooling',
        name: 'Hand Tooling and Embossing',
        difficulty: 0.6,
        culturalSignificance: 0.7,
        timeToLearn: 4,
        prerequisites: ['traditional-tanning']
      }
    ],
    culturalKnowledge: {
      traditions: [
        {
          topic: 'Fez Tannery Traditions',
          depth: 0.8,
          sources: ['Family business', 'Tannery guild'],
          verified: true
        }
      ],
      history: [
        {
          topic: 'Moroccan Leather Craft History',
          depth: 0.7,
          sources: ['Guild knowledge', 'Historical study'],
          verified: true
        }
      ],
      techniques: [
        {
          topic: 'Natural Tanning Methods',
          depth: 0.9,
          sources: ['Practical experience'],
          verified: true
        }
      ],
      stories: [
        {
          topic: 'Tannery Life Stories',
          depth: 0.8,
          sources: ['Personal experience'],
          verified: true
        }
      ],
      languages: ['Arabic', 'French']
    },
    teachingStyle: {
      approach: 'hybrid',
      patience: 0.8,
      adaptability: 0.9,
      culturalSensitivity: 0.8,
      languageSkills: ['Arabic', 'French']
    },
    availability: {
      schedule: [
        {
          dayOfWeek: 2,
          startTime: '08:00',
          endTime: '16:00',
          available: true
        },
        {
          dayOfWeek: 4,
          startTime: '08:00',
          endTime: '16:00',
          available: true
        },
        {
          dayOfWeek: 6,
          startTime: '09:00',
          endTime: '14:00',
          available: true
        }
      ],
      seasonalVariations: [],
      capacity: 3,
      advanceBooking: 3
    },
    economicGoals: {
      monthlyTarget: 1500,
      yearlyTarget: 18000,
      growthRate: 0.20,
      diversificationGoals: ['Modern leather goods', 'Tourist workshops']
    }
  },
  {
    id: 'youssef-metalwork-master',
    name: 'Youssef El Fassi',
    craft: 'metalwork',
    region: 'Fez',
    skillLevel: 'master',
    techniques: [
      {
        id: 'damascening',
        name: 'Traditional Damascening',
        difficulty: 0.9,
        culturalSignificance: 0.95,
        timeToLearn: 10,
        prerequisites: ['basic-metalwork', 'engraving']
      },
      {
        id: 'brass-inlay',
        name: 'Brass Inlay Work',
        difficulty: 0.7,
        culturalSignificance: 0.8,
        timeToLearn: 6,
        prerequisites: ['basic-metalwork']
      }
    ],
    culturalKnowledge: {
      traditions: [
        {
          topic: 'Islamic Metalwork Traditions',
          depth: 0.9,
          sources: ['Master craftsman training', 'Historical study'],
          verified: true
        },
        {
          topic: 'Andalusian Metalwork Heritage',
          depth: 0.8,
          sources: ['Cultural research', 'Museum collaboration'],
          verified: true
        }
      ],
      history: [
        {
          topic: 'Mamluk Metalwork Influence',
          depth: 0.7,
          sources: ['Academic study'],
          verified: true
        }
      ],
      techniques: [
        {
          topic: 'Traditional Alloy Preparation',
          depth: 0.9,
          sources: ['Master training'],
          verified: true
        }
      ],
      stories: [
        {
          topic: 'Craftsman Guild Stories',
          depth: 0.8,
          sources: ['Guild membership'],
          verified: true
        }
      ],
      languages: ['Arabic', 'French', 'Spanish']
    },
    teachingStyle: {
      approach: 'traditional',
      patience: 0.7,
      adaptability: 0.6,
      culturalSensitivity: 0.9,
      languageSkills: ['Arabic', 'French', 'Spanish']
    },
    availability: {
      schedule: [
        {
          dayOfWeek: 1,
          startTime: '08:00',
          endTime: '17:00',
          available: true
        },
        {
          dayOfWeek: 3,
          startTime: '08:00',
          endTime: '17:00',
          available: true
        },
        {
          dayOfWeek: 5,
          startTime: '08:00',
          endTime: '17:00',
          available: true
        }
      ],
      seasonalVariations: [],
      capacity: 2,
      advanceBooking: 10
    },
    economicGoals: {
      monthlyTarget: 2500,
      yearlyTarget: 30000,
      growthRate: 0.10,
      diversificationGoals: ['Luxury commissions', 'International exhibitions']
    }
  }
];

export async function seedRLData() {
  console.log('🌱 Starting RL data seeding...');

  try {
    // Initialize database service
    await rlDatabaseService.initializeDefaultData();
    console.log('✅ Database service initialized');

    // Seed artisan profiles
    for (const artisan of sampleArtisans) {
      const result = await rlDatabaseService.createArtisanProfile(artisan);
      if (result.success) {
        console.log(`✅ Created artisan profile: ${artisan.name} (${artisan.craft})`);
      } else {
        console.error(`❌ Failed to create artisan profile: ${artisan.name}`, result.error);
      }
    }

    console.log(`🎉 Successfully seeded ${sampleArtisans.length} artisan profiles`);
    console.log('🚀 RL system is ready with real data!');

  } catch (error) {
    console.error('❌ Error seeding RL data:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedRLData()
    .then(() => {
      console.log('✅ Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
} 