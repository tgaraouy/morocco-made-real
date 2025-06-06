-- Cultural Experiences Table and Data Migration
-- This creates the experiences table and populates it with realistic cultural experiences

-- Create experiences table
CREATE TABLE IF NOT EXISTS cultural_experiences (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artisan_name VARCHAR(255) NOT NULL,
    craft VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    match_percentage INTEGER DEFAULT 0,
    image VARCHAR(10) NOT NULL, -- emoji for now
    description TEXT NOT NULL,
    reviews INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    social_proof VARCHAR(255),
    artisan_age INTEGER,
    artisan_experience VARCHAR(255),
    languages TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    heritage TEXT,
    certification VARCHAR(255),
    quick_moods TEXT[] DEFAULT '{}',
    experience_styles TEXT[] DEFAULT '{}',
    
    -- Interactive content stored as JSONB
    interactive_content JSONB NOT NULL DEFAULT '{}',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    active BOOLEAN DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cultural_experiences_craft ON cultural_experiences(craft);
CREATE INDEX IF NOT EXISTS idx_cultural_experiences_location ON cultural_experiences(location);
CREATE INDEX IF NOT EXISTS idx_cultural_experiences_price ON cultural_experiences(price);
CREATE INDEX IF NOT EXISTS idx_cultural_experiences_rating ON cultural_experiences(rating);
CREATE INDEX IF NOT EXISTS idx_cultural_experiences_active ON cultural_experiences(active);
CREATE INDEX IF NOT EXISTS idx_cultural_experiences_quick_moods ON cultural_experiences USING GIN(quick_moods);
CREATE INDEX IF NOT EXISTS idx_cultural_experiences_experience_styles ON cultural_experiences USING GIN(experience_styles);
CREATE INDEX IF NOT EXISTS idx_cultural_experiences_tags ON cultural_experiences USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_cultural_experiences_interactive_content ON cultural_experiences USING GIN(interactive_content);

-- Create update trigger
CREATE TRIGGER update_cultural_experiences_updated_at 
    BEFORE UPDATE ON cultural_experiences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert the 8 realistic cultural experiences
INSERT INTO cultural_experiences (
    id, title, artisan_name, craft, location, price, duration, match_percentage, image, description,
    reviews, rating, social_proof, artisan_age, artisan_experience, languages, tags, heritage, certification,
    quick_moods, experience_styles, interactive_content
) VALUES 
(
    '1',
    'Hassan''s Pottery Meditation',
    'Hassan Benali',
    'pottery',
    'Fez Medina',
    75.00,
    '4 hours',
    94,
    '🏺',
    'Create beautiful pottery while finding inner peace. Hassan combines traditional techniques with mindful practices in his 200-year-old workshop.',
    289,
    4.9,
    '347 people found this transformative',
    52,
    '25 years teaching pottery',
    ARRAY['EN', 'FR', 'AR'],
    ARRAY['🧘 Meditative', '🎨 Creative', '🏛️ Historic'],
    '3rd generation potter since 1820',
    'Master Potter (Maalem)',
    ARRAY['creative', 'relax', 'learn'],
    ARRAY['hands-on', 'meditative', 'intimate'],
    '{
        "audioStory": {
            "duration": "2 minutes",
            "title": "Hassan''s Pottery Journey",
            "description": "Listen to Hassan share his family''s 200-year pottery tradition and how meditation helps him create perfect vessels.",
            "audioUrl": "/audio/hassan-pottery-meditation.mp3"
        },
        "videoPreview": {
            "duration": "90 seconds",
            "title": "Pottery Meditation Preview",
            "highlights": ["Hassan demonstrating centering clay on wheel", "Peaceful workshop atmosphere in ancient medina", "Beautiful finished pottery pieces"],
            "videoUrl": "/video/hassan-pottery-meditation.mp4"
        },
        "culturalContext": {
            "tradition": "Fez pottery traditions date back to the 9th century, combining Berber, Arab, and Andalusian influences.",
            "significance": "Pottery is considered a sacred craft in Morocco - each piece carries the artisan''s soul and connects to earth elements.",
            "history": "Hassan''s family has been creating pottery since 1820, passing down secrets through 8 generations in this very workshop.",
            "readTime": "3 minutes"
        },
        "learningOutcomes": {
            "skills": ["Pottery wheel centering", "Clay preparation techniques", "Mindful breathing during creation", "Glazing basics"],
            "techniques": ["Hand-building coil method", "Wheel throwing fundamentals", "Traditional Moroccan glazing", "Meditative focus practices"],
            "takeaways": ["Your own handmade pottery piece", "Inner peace and mindfulness", "Understanding of Moroccan craft heritage", "Photos of your creation process"],
            "materials": ["Local Salé clay", "Traditional pottery tools", "Natural mineral glazes", "Wood-fired kiln access"]
        },
        "blockchainProofs": {
            "artisanVerification": "Hassan Benali verified master potter - ID: MA-FEZ-POT-001",
            "heritageAuthenticity": "Authenticated by Moroccan Ministry of Handicrafts & Social Economy",
            "skillCertification": "Master Potter (Maalem) certification - Level 5 traditional crafts",
            "communityEndorsement": "Endorsed by Fez Medina Artisan Cooperative (2,847 members)",
            "blockchainHash": "0x1a2b3c4d5e6f789...potter-hassan-verified-2024"
        },
        "aiExplanation": {
            "vibeMatch": "Perfect match for your \"Find Peace\" vibe - Hassan''s meditative approach combines pottery with mindfulness, creating a deeply calming experience that aligns with your desire for inner tranquility.",
            "styleMatch": "Your preference for \"Hands-On Making\" and \"Meditative\" experiences is ideal for pottery. You''ll be actively creating while entering a peaceful, focused state.",
            "personalityFit": "Based on your selections, you appreciate authentic, intimate experiences that combine creativity with personal growth - Hassan''s workshop offers exactly this blend.",
            "confidenceScore": 94
        }
    }'
),
(
    '2',
    'Fatima''s Weaving Stories',
    'Fatima Zahra',
    'weaving',
    'Atlas Mountains',
    95.00,
    '6 hours',
    91,
    '🧵',
    'Learn ancient Berber weaving while hearing stories passed down through generations. Create your own piece to take home.',
    156,
    4.8,
    'Featured in National Geographic',
    43,
    '20 years preserving traditions',
    ARRAY['FR', 'AR', 'BER'],
    ARRAY['📖 Storytelling', '🧵 Traditional', '🏔️ Mountains'],
    '8th generation Berber weaver',
    'Atlas Mountain Weaving Master',
    ARRAY['learn', 'social', 'creative'],
    ARRAY['hands-on', 'storytelling', 'intimate'],
    '{
        "audioStory": {
            "duration": "2 minutes",
            "title": "Songs of the Atlas Mountains",
            "description": "Fatima shares traditional Berber songs and stories that have guided weaving rhythms for centuries.",
            "audioUrl": "/audio/fatima-weaving-stories.mp3"
        },
        "videoPreview": {
            "duration": "90 seconds",
            "title": "Berber Weaving in the Mountains",
            "highlights": ["Fatima working with traditional Berber patterns", "Mountain village workshop setting", "Colorful yarns and traditional tools", "Family loom passed down generations"],
            "videoUrl": "/video/fatima-weaving-stories.mp4"
        },
        "culturalContext": {
            "tradition": "Berber weaving is an ancient practice where women create textiles that tell stories of their tribes, mountains, and ancestors.",
            "significance": "Each pattern has meaning - geometric shapes represent protection, fertility, and connection to the earth. Colors reflect the Atlas Mountain seasons.",
            "history": "Fatima''s family has woven carpets for over 300 years, surviving French colonization and preserving pure Berber traditions in their mountain village.",
            "readTime": "4 minutes"
        },
        "learningOutcomes": {
            "skills": ["Traditional Berber weaving techniques", "Pattern reading and creation", "Natural dye preparation", "Cultural storytelling"],
            "techniques": ["Flat-weave carpet making", "Knotting traditional patterns", "Natural wool preparation", "Color pattern design"],
            "takeaways": ["Your own small woven piece", "Knowledge of Berber symbols", "Traditional mountain recipes", "Photos with Fatima''s family"],
            "materials": ["Hand-spun mountain wool", "Natural plant dyes", "Traditional wooden loom", "Berber design templates"]
        },
        "blockchainProofs": {
            "artisanVerification": "Fatima Zahra verified master weaver - ID: MA-ATL-WEAV-002",
            "heritageAuthenticity": "Authenticated by Royal Institute of Amazigh Culture",
            "skillCertification": "Master Weaver certification - UNESCO Intangible Heritage Keeper",
            "communityEndorsement": "Endorsed by Atlas Mountain Women''s Weaving Cooperative",
            "blockchainHash": "0x2b3c4d5e6f7a8b9...weaver-fatima-verified-2024"
        },
        "aiExplanation": {
            "vibeMatch": "Your \"Learn Something New\" and \"Meet People\" vibes perfectly align with Fatima''s approach - she teaches not just weaving, but shares deep cultural stories and connects you with her family.",
            "styleMatch": "Perfect for \"Storytelling\" and \"Hands-On Making\" - you''ll learn traditional techniques while hearing ancestral stories that bring each pattern to life.",
            "personalityFit": "You appreciate authentic cultural exchange and intimate learning experiences. Fatima''s mountain workshop offers genuine connection with Berber heritage.",
            "confidenceScore": 91
        }
    }'
),
(
    '3',
    'Ahmed''s Spice Adventure',
    'Ahmed Tazi',
    'cooking',
    'Marrakech Souks',
    65.00,
    '3 hours',
    88,
    '🌶️',
    'Explore vibrant spice markets and learn to create authentic tagines. A feast for all your senses in the heart of Marrakech.',
    203,
    4.7,
    'Most popular food experience',
    38,
    '15 years sharing culinary secrets',
    ARRAY['EN', 'FR', 'AR'],
    ARRAY['🌶️ Spicy', '🗺️ Market Tour', '👥 Social'],
    'Traditional Marrakech family recipes',
    'Certified Culinary Guide',
    ARRAY['adventure', 'social', 'learn', 'surprise'],
    ARRAY['hands-on', 'adventure', 'social'],
    '{
        "audioStory": {
            "duration": "2 minutes",
            "title": "Spices of the Sahara Trade Routes",
            "description": "Ahmed tells the fascinating story of how spices traveled from India and Sub-Saharan Africa to create Moroccan cuisine.",
            "audioUrl": "/audio/ahmed-spice-adventure.mp3"
        },
        "videoPreview": {
            "duration": "90 seconds",
            "title": "Marrakech Spice Market Adventure",
            "highlights": ["Colorful spice pyramids in Jemaa el-Fnaa", "Ahmed selecting fresh ingredients", "Traditional tagine cooking process", "Bustling souk atmosphere"],
            "videoUrl": "/video/ahmed-spice-adventure.mp4"
        },
        "culturalContext": {
            "tradition": "Moroccan cuisine blends Arab, Berber, and Andalusian influences, with spices that traveled ancient trade routes across the Sahara.",
            "significance": "Each spice has healing properties in Moroccan tradition. Combining them is both culinary art and traditional medicine.",
            "history": "Ahmed''s family has run spice shops in Marrakech for 5 generations, learning recipes from traders, nomads, and palace cooks.",
            "readTime": "3 minutes"
        },
        "learningOutcomes": {
            "skills": ["Spice identification and uses", "Traditional tagine cooking", "Market navigation and bargaining", "Moroccan flavor balancing"],
            "techniques": ["Spice grinding and blending", "Slow-cooking in clay tagine", "Traditional bread making", "Mint tea ceremony"],
            "takeaways": ["Complete tagine meal you prepared", "Personal spice blend recipe", "Market shopping tips", "Invitation to family dinner"],
            "materials": ["Fresh market ingredients", "Traditional clay tagine", "Authentic spice blends", "Recipes written in Arabic"]
        },
        "blockchainProofs": {
            "artisanVerification": "Ahmed Tazi verified culinary master - ID: MA-MAR-COOK-003",
            "heritageAuthenticity": "Authenticated by Marrakech Chamber of Commerce & Crafts",
            "skillCertification": "Master Chef certification - Traditional Moroccan Cuisine",
            "communityEndorsement": "Endorsed by Marrakech Souk Merchants Association",
            "blockchainHash": "0x3c4d5e6f7a8b9c0...chef-ahmed-verified-2024"
        },
        "aiExplanation": {
            "vibeMatch": "Your \"Explore & Discover\" and \"Surprise Me\" vibes are perfect for Ahmed''s market adventure - you''ll discover hidden spice stalls and unexpected flavor combinations.",
            "styleMatch": "Ideal for \"Active & Exploratory\" and \"Social\" preferences - you''ll walk through busy markets, meet vendors, and share meals with other travelers.",
            "personalityFit": "You enjoy sensory experiences and social interactions. Ahmed''s spice tour combines adventure, learning, and authentic Moroccan hospitality.",
            "confidenceScore": 88
        }
    }'
),
(
    '4',
    'Muah''s High Atlas Weaving Journey',
    'Muah Ahansali',
    'weaving & knitting',
    'Timloukine, High Atlas',
    120.00,
    '8 hours',
    96,
    '🧶',
    'Learn the ancient "try-as-you-go" knitting traditions of High Atlas shepherds. Spin wool on traditional floor spindles and create authentic Moroccan textiles while hearing oral stories passed down through generations.',
    78,
    4.9,
    'Featured in "Keepers of the sheep" book',
    45,
    '30 years preserving shepherd traditions',
    ARRAY['AR', 'BER', 'FR'],
    ARRAY['🧶 Traditional Knitting', '🐑 Sheep Shepherding', '📚 Oral Traditions'],
    'High Atlas shepherd family, 8 generations',
    'UNESCO Intangible Heritage Keeper',
    ARRAY['learn', 'creative', 'relax', 'adventure'],
    ARRAY['hands-on', 'storytelling', 'intimate', 'meditative'],
    '{
        "audioStory": {
            "duration": "2 minutes",
            "title": "Songs of the Shepherds",
            "description": "Muah shares traditional High Atlas shepherd songs and the oral stories that guide the ancient \"try-as-you-go\" knitting traditions.",
            "audioUrl": "/audio/muah-shepherd-songs.mp3"
        },
        "videoPreview": {
            "duration": "90 seconds",
            "title": "High Atlas Weaving & Spinning",
            "highlights": ["Traditional floor-supported spindle spinning", "Men knitting while keeping sheep", "Ancient try-as-you-go techniques", "Mountain village workshop setting"],
            "videoUrl": "/video/muah-high-atlas-weaving.mp4"
        },
        "culturalContext": {
            "tradition": "High Atlas shepherds practice a unique tradition where men knit while tending sheep and women spin on long floor-supported spindles. This reverses typical gender roles and preserves ancient Amazigh (Berber) textile knowledge.",
            "significance": "This oral tradition represents one of the most authentic branches of the global knitting family tree, possibly tracing back to medieval Egypt and representing indigenous Amazigh contributions to world textile culture.",
            "history": "Muah''s family has maintained these shepherd knitting traditions for 8 generations in Timloukine village. The techniques survived French colonization and continue to be passed down through oral tradition and observation rather than written patterns.",
            "readTime": "5 minutes"
        },
        "learningOutcomes": {
            "skills": ["Floor-supported spindle spinning", "Try-as-you-go knitting methodology", "Traditional Tqasher Jadeed sock construction", "Sirwal pants stripe techniques"],
            "techniques": ["Cloud-to-yarn spinning with batts", "Underarm plying method", "Zig-zag stripe construction", "Framework-based pattern adaptation"],
            "takeaways": ["Hand-spun wool yarn", "Traditional knitted piece (socks or sample)", "Oral stories and songs", "Understanding of Amazigh textile heritage"],
            "materials": ["High Atlas sheep wool (Cheviot-like quality)", "Traditional floor spindles", "Wooden knitting needles", "Natural dyed yarns"]
        },
        "blockchainProofs": {
            "artisanVerification": "Muah Ahansali verified High Atlas shepherd - ID: MA-HAT-KNIT-004",
            "heritageAuthenticity": "Authenticated by Royal Institute of Amazigh Culture & UNESCO",
            "skillCertification": "Master Shepherd-Knitter - Intangible Heritage Keeper certification",
            "communityEndorsement": "Endorsed by Cooperative Ibilou & Timloukine Village Council",
            "blockchainHash": "0x4d5e6f7a8b9c0d1...shepherd-muah-verified-2024"
        },
        "aiExplanation": {
            "vibeMatch": "Perfect for \"Learn Something New\" and \"Find Peace\" vibes - this ancient shepherd tradition combines meditative spinning with hands-on learning in the peaceful High Atlas mountains.",
            "styleMatch": "Ideal for \"Storytelling\" and \"Hands-On Making\" - you''ll learn through oral tradition while creating authentic textiles using techniques unchanged for centuries.",
            "personalityFit": "You appreciate rare, authentic experiences that connect you to indigenous wisdom. This shepherd tradition offers deep cultural immersion unavailable anywhere else in the world.",
            "confidenceScore": 96
        }
    }'
),
(
    '5',
    'Fadma''s Rug Weaving Mastery',
    'Fadma Buhassi',
    'rug weaving',
    'Tiznit, Anti-Atlas',
    140.00,
    '10 hours',
    93,
    '🪡',
    'Master the art of traditional Berber rug weaving with Fadma, a village leader and expert weaver. Learn to create "map" rugs, pile carpets, and traditional designs while supporting women''s economic independence.',
    92,
    4.9,
    'Featured in "Women Artisans of Morocco" book',
    40,
    '35 years weaving since age 5',
    ARRAY['AR', 'BER', 'FR'],
    ARRAY['🪡 Master Weaving', '🗺️ Map Rugs', '👩‍👧‍👦 Women''s Empowerment'],
    'Berber mountain village traditions from Amassine',
    'Village Leader & Master Weaver',
    ARRAY['creative', 'learn', 'social', 'adventure'],
    ARRAY['hands-on', 'storytelling', 'intimate'],
    '{
        "audioStory": {
            "duration": "2 minutes",
            "title": "From Village Leader to Master Weaver",
            "description": "Fadma shares her journey from learning at age 5 to becoming a village leader, midwife, and master weaver supporting 9 children.",
            "audioUrl": "/audio/fadma-weaver-story.mp3"
        },
        "videoPreview": {
            "duration": "90 seconds",
            "title": "Traditional Berber Rug Making Process",
            "highlights": ["Washing and spinning raw wool by hand", "Creating complex \"map\" rug patterns", "Natural dyeing with local plants", "Traditional loom setup in courtyard"],
            "videoUrl": "/video/fadma-rug-weaving.mp4"
        },
        "culturalContext": {
            "tradition": "Berber women''s weaving traditions where mastery brings community respect and economic independence. Fadma represents generations of women who use weaving as both art and survival.",
            "significance": "Rug weaving is \"our craft, our calling\" - a cultural identity that cannot be abandoned. Master weavers hold respected positions in Berber communities and preserve ancient design traditions.",
            "history": "Fadma learned from her mother Rahma in Amassine village, became expert by 18, and now preserves traditions including the ancient \"teereera\" diamond designs that connect to long-ago ancestors.",
            "readTime": "4 minutes"
        },
        "learningOutcomes": {
            "skills": ["Traditional rug loom setup", "Wool preparation and spinning", "Natural dye preparation", "Complex pattern design from memory"],
            "techniques": ["Pile rug knotting methods", "Flatweave \"map\" construction", "Teereera diamond patterns", "Design improvisation and personal motifs"],
            "takeaways": ["Small handwoven rug sample", "Understanding of Berber design symbols", "Wool preparation skills", "Photos documenting your learning process"],
            "materials": ["Raw wool from local sheep", "Natural plant dyes", "Traditional wooden loom", "Hand-carved weaving tools"]
        },
        "blockchainProofs": {
            "artisanVerification": "Fadma Buhassi verified master weaver - ID: MA-TIZ-WEAV-005",
            "heritageAuthenticity": "Authenticated by Timnay Association & Berber Cultural Council",
            "skillCertification": "Master Weaver - 35 years experience, Village Leader certification",
            "communityEndorsement": "Endorsed by Women Artisans of Morocco project & Anou marketplace",
            "blockchainHash": "0x5e6f7a8b9c0d1e2...weaver-fadma-verified-2024"
        },
        "aiExplanation": {
            "vibeMatch": "Perfect for \"Get Creative\" and \"Learn Something New\" - Fadma''s mastery comes from pure imagination and 35 years of innovation, creating designs that exist nowhere else.",
            "styleMatch": "Ideal for \"Hands-On Making\" and \"Storytelling\" - you''ll work with raw materials while hearing stories of survival, community leadership, and artistic mastery.",
            "personalityFit": "You value authentic women''s empowerment and economic independence. Fadma''s story shows how traditional crafts create respect, income, and cultural preservation.",
            "confidenceScore": 93
        }
    }'
),
(
    '6',
    'Abdulilah''s Zellige Mastery Workshop',
    'Abdulilah Benali',
    'zellige mosaic',
    'Art D''Argile, Fes Medina',
    160.00,
    '12 hours',
    98,
    '🕌',
    'Master the ancient art of Zellige mosaic with Abdulilah, a craftsman documented in ethnographic research. Learn traditional tile-cutting techniques, Islamic symbolism, and the cultural heritage behind Morocco''s most iconic craft.',
    145,
    4.9,
    'Featured in WPI ethnographic study',
    42,
    '27 years since age 15 apprenticeship',
    ARRAY['AR', 'FR', 'EN'],
    ARRAY['🕌 Zellige Mastery', '🎨 Islamic Art', '📚 Academic Research'],
    'Fes medina artisan family, Andalusian traditions',
    'Master Zellige Craftsman (Maalem)',
    ARRAY['creative', 'learn', 'adventure', 'surprise'],
    ARRAY['hands-on', 'storytelling', 'intimate'],
    '{
        "audioStory": {
            "duration": "2 minutes",
            "title": "Stories from the Zellige Workshop",
            "description": "Abdulilah shares the real experiences of zellige craftsmen as documented in ethnographic research - from apprentice days earning 5 dirham per week to master craftsman.",
            "audioUrl": "/audio/abdulilah-zellige-stories.mp3"
        },
        "videoPreview": {
            "duration": "90 seconds",
            "title": "Traditional Zellige Cutting Techniques",
            "highlights": ["Precise pickax tile cutting against stone ledge", "Face-down mosaic assembly technique", "Traditional workshop atmosphere with mint tea", "Ancient patterns with Islamic symbolism"],
            "videoUrl": "/video/abdulilah-zellige-mastery.mp4"
        },
        "culturalContext": {
            "tradition": "Zellige dates to the 12th century Almohad dynasty, representing Morocco''s most patriotic craft. Patterns use arabesque repetition symbolizing Islamic values of peace and tranquility, with designs passed down through workshops for centuries.",
            "significance": "Each pattern carries deep meaning: 5-pointed stars represent the 5 pillars of Islam, 8-sided designs symbolize the 8 gates of paradise. Colors have spiritual significance - green for Islam and fertility, blue for sky and freedom.",
            "history": "Abdulilah represents the continuation of Andalusian traditions brought to Morocco. His workshop in Fes medina maintains techniques perfected over 800 years, despite modern challenges from globalization and changing monarchy priorities.",
            "readTime": "6 minutes"
        },
        "learningOutcomes": {
            "skills": ["Traditional tile cutting with pickax technique", "Pattern recognition and Islamic symbolism", "Face-down mosaic assembly methods", "Clay preparation and tile making"],
            "techniques": ["Precise line breaking against stone ledge", "Andalusian pattern memorization", "Color theory in Islamic art", "Workshop positioning and tool use"],
            "takeaways": ["Personal zellige mosaic creation", "Understanding of Islamic art principles", "Knowledge of craftsman economic realities", "Photos documenting traditional techniques"],
            "materials": ["100% Moroccan clay tiles", "Traditional pickax cutting tools", "Stone workshop stands", "Natural adhesives and concrete"]
        },
        "blockchainProofs": {
            "artisanVerification": "Abdulilah Benali verified master craftsman - ID: MA-FES-ZELL-006",
            "heritageAuthenticity": "Authenticated by Art D''Argile workshop & Fes Medina Artisan Council",
            "skillCertification": "Master Zellige Craftsman (Maalem) - 27 years experience, ethnographic study participant",
            "communityEndorsement": "Endorsed by Worcester Polytechnic Institute research & Fes Craftsmen Cooperative",
            "blockchainHash": "0x6f7a8b9c0d1e2f3...zellige-abdulilah-verified-2024"
        },
        "aiExplanation": {
            "vibeMatch": "Perfect for \"Get Creative\" and \"Surprise Me\" - Abdulilah''s workshop reveals the hidden world of zellige craftsmen, sharing real stories of dedication, economic challenges, and artistic mastery rarely seen by outsiders.",
            "styleMatch": "Ideal for \"Hands-On Making\" and \"Storytelling\" - you''ll learn precise traditional techniques while hearing authentic stories from academic research about craftsmen''s lives and struggles.",
            "personalityFit": "You appreciate deep cultural authenticity and academic rigor. This experience offers the most documented and researched craft tradition on our platform, connecting you to living heritage.",
            "confidenceScore": 98
        }
    }'
),
(
    '7',
    'Rachida''s Artisan Empowerment Workshop',
    'Rachida Ousbigh',
    'weaving & cooperative leadership',
    'Anou Cooperative, Fes',
    85.00,
    '6 hours',
    97,
    '🤝',
    'Learn traditional weaving while discovering how artisan cooperatives create economic justice. Rachida teaches both craft techniques and the business skills that help artisans earn fair wages directly from customers.',
    203,
    4.9,
    'Featured in Hamilton College research',
    38,
    '15 years in cooperative leadership',
    ARRAY['AR', 'FR', 'EN'],
    ARRAY['🤝 Cooperative', '⚖️ Fair Trade', '📚 Academic Research'],
    'President of Women''s Cooperative of Khenifra',
    'Anou Artisan Leader & Cooperative President',
    ARRAY['learn', 'social', 'creative', 'surprise'],
    ARRAY['hands-on', 'storytelling', 'intimate', 'social'],
    '{
        "audioStory": {
            "duration": "2 minutes",
            "title": "From 4% to 100%: Breaking the Middleman Cycle",
            "description": "Rachida explains how traditional middlemen kept 96% of sales while artisans earned only 4%, and how the Anou Cooperative changed everything by giving artisans direct market access.",
            "audioUrl": "/audio/rachida-cooperative-story.mp3"
        },
        "videoPreview": {
            "duration": "90 seconds",
            "title": "The Anou Cooperative Workshop",
            "highlights": ["Rachida teaching traditional rug weaving techniques", "Icon-based computer system for artisan empowerment", "Collaborative design workshops", "Direct pricing calculation methods"],
            "videoUrl": "/video/rachida-anou-cooperative.mp4"
        },
        "culturalContext": {
            "tradition": "The Anou Cooperative represents a modern evolution of traditional craft communities, where artisans collaborate to preserve heritage while achieving economic independence through direct market access.",
            "significance": "This cooperative model transforms craft work from a \"last resort\" into a viable career path, while preserving traditional Amazigh weaving techniques and cultural symbols in contemporary designs.",
            "history": "Founded to combat exploitation where artisans earned only 4% of sales prices, the Anou has grown to include 90 cooperatives and over 900 artisans across Morocco, creating sustainable livelihoods while preserving cultural heritage.",
            "readTime": "4 minutes"
        },
        "learningOutcomes": {
            "skills": ["Traditional rug weaving (zarbya and hanbel styles)", "Fair pricing calculation methods", "Cooperative business principles", "Design innovation techniques"],
            "techniques": ["Warp creation and loom setup", "Natural wool dyeing process", "Pattern design using cultural symbols", "Direct customer communication"],
            "takeaways": ["Your own handwoven rug piece", "Understanding of fair trade principles", "Knowledge of cooperative empowerment", "Connection to artisan network"],
            "materials": ["Locally sourced wool", "Natural dyes", "Traditional wooden looms", "Icon-based learning tools"]
        },
        "blockchainProofs": {
            "artisanVerification": "Rachida Ousbigh verified cooperative president - ID: MA-FES-COOP-007",
            "heritageAuthenticity": "Authenticated by Hamilton College research & Anou Cooperative network",
            "skillCertification": "Anou Artisan Leader certification - Cooperative empowerment specialist",
            "communityEndorsement": "Endorsed by Women''s Cooperative of Khenifra & 900+ Anou artisans",
            "blockchainHash": "0x7b8c9d0e1f2a3b4...cooperative-rachida-verified-2024"
        },
        "aiExplanation": {
            "vibeMatch": "Perfect for \"Learn Something New\" and \"Meet People\" vibes - this experience combines traditional craft learning with understanding cooperative empowerment and social justice.",
            "styleMatch": "Ideal for \"Social\" and \"Hands-On Making\" preferences - you''ll work alongside other participants while learning both weaving techniques and business empowerment skills.",
            "personalityFit": "You value authentic cultural preservation combined with social impact. This experience shows how traditional crafts can create economic opportunity while maintaining cultural integrity.",
            "confidenceScore": 97
        }
    }'
),
(
    '8',
    'Traditional Bread Making & Community Connection',
    'Ahmed Al-Khoubzi',
    'traditional bread baking',
    'Community Bakery, Fez Medina',
    45.00,
    '4 hours',
    89,
    '🍞',
    'Learn traditional Moroccan bread making techniques while connecting with local families. Help prepare daily bread for the community and understand the social role of neighborhood bakeries in Moroccan culture.',
    167,
    4.7,
    'Beloved community experience',
    51,
    '35 years as community baker',
    ARRAY['AR', 'FR', 'EN'],
    ARRAY['🍞 Traditional Baking', '🏘️ Community', '🤝 Social Impact'],
    '3rd generation family bakery',
    'Master Baker & Community Leader',
    ARRAY['social', 'learn', 'surprise'],
    ARRAY['hands-on', 'social', 'intimate'],
    '{
        "audioStory": {
            "duration": "3 minutes",
            "title": "The Heart of the Community",
            "description": "Ahmed shares how neighborhood bakeries serve as social centers and the important role bread plays in Moroccan daily life and hospitality.",
            "audioUrl": "/audio/ahmed-community-bread.mp3"
        },
        "videoPreview": {
            "duration": "2 minutes",
            "title": "Community Bread Making Process",
            "highlights": ["Traditional dough preparation techniques", "Wood-fired oven management", "Community members bringing dough", "Fresh bread distribution to families"],
            "videoUrl": "/video/ahmed-community-bread-making.mp4"
        },
        "culturalContext": {
            "tradition": "Community bakeries have operated for centuries in Morocco, where families prepare dough at home and bring it to neighborhood ovens for baking. This creates daily social interaction and community bonds.",
            "significance": "Bread is sacred in Moroccan culture - never wasted, always shared. The community bakery serves as a meeting place where news is exchanged and relationships are maintained.",
            "history": "Ahmed''s family has operated this bakery for three generations, serving the same families and maintaining traditions of community service and hospitality.",
            "readTime": "4 minutes"
        },
        "learningOutcomes": {
            "skills": ["Traditional Moroccan bread recipes", "Dough preparation techniques", "Wood-fired oven operation", "Community baking etiquette"],
            "techniques": ["Proper kneading methods", "Fermentation timing", "Oven temperature management", "Bread scoring and shaping"],
            "takeaways": ["Fresh bread you helped make", "Traditional family recipes", "Community connections", "Understanding of Moroccan hospitality"],
            "materials": ["Traditional flour and grains", "Wood-fired community oven", "Family baking tools", "Community recipe collection"]
        },
        "blockchainProofs": {
            "artisanVerification": "Ahmed Al-Khoubzi verified community baker - ID: MA-FES-BREAD-008",
            "heritageAuthenticity": "Authenticated by Fez Medina Community Council",
            "skillCertification": "Master Baker - 35 years community service",
            "communityEndorsement": "Endorsed by local families & Fez Bakers Association",
            "blockchainHash": "0x8c9d0e1f2a3b4c5...community-ahmed-verified-2024"
        },
        "aiExplanation": {
            "vibeMatch": "Perfect for \"Meet People\" and \"Surprise Me\" vibes - this experience connects you with real Moroccan families and shows the authentic social fabric of medina life.",
            "styleMatch": "Ideal for \"Social\" and \"Hands-On Making\" preferences - you''ll work alongside community members while learning traditional techniques that bring people together.",
            "personalityFit": "You value authentic community connections and want to understand how traditional practices create social bonds. This experience offers genuine cultural immersion.",
            "confidenceScore": 89
        }
    }'
)
ON CONFLICT (id) DO NOTHING;

-- Create a function to get experiences with filtering
CREATE OR REPLACE FUNCTION get_cultural_experiences(
    p_mood TEXT DEFAULT NULL,
    p_style TEXT DEFAULT NULL,
    p_craft TEXT DEFAULT NULL,
    p_max_price DECIMAL DEFAULT NULL,
    p_limit INTEGER DEFAULT 20
)
RETURNS SETOF cultural_experiences AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM cultural_experiences
    WHERE active = TRUE
        AND (p_mood IS NULL OR p_mood = ANY(quick_moods))
        AND (p_style IS NULL OR p_style = ANY(experience_styles))
        AND (p_craft IS NULL OR craft = p_craft)
        AND (p_max_price IS NULL OR price <= p_max_price)
    ORDER BY rating DESC, reviews DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Cultural Experiences Table Created!';
    RAISE NOTICE '🎨 8 realistic cultural experiences have been populated';
    RAISE NOTICE '🗂️ Experiences can now be queried from Supabase instead of mock data';
    RAISE NOTICE '🚀 Ready to connect the cultural-match component to the database!';
END $$; 