-- Fix Migration Data Script
-- Run these commands in order in your Supabase SQL Editor

-- Step 1: Clean up existing data (in reverse dependency order)
DELETE FROM artisan_journey_documentation;
DELETE FROM expert_reviews;
DELETE FROM community_feedback;
DELETE FROM narrative_content;
DELETE FROM multimedia_assets;
DELETE FROM cultural_connections;
DELETE FROM user_collections;
DELETE FROM community_museum_interactions;
DELETE FROM digital_certificates;
DELETE FROM museum_extracts;
DELETE FROM artisan_pieces;
DELETE FROM traditional_practices_database;

-- Step 2: Insert sample traditional practices first
INSERT INTO traditional_practices_database (
    technique_name, craft_category, region, origin_period, cultural_significance,
    materials, tools, process_steps, documented_by
) VALUES 
(
    'Fez Blue Pottery', 'pottery', 'fez_meknes', '14th Century',
    'exceptional',
    '[{"name": "local_clay", "source": "Salé region", "preparation": "aged_6_months"}]',
    '[{"name": "pottery_wheel", "traditional_form": "foot_powered", "modern_adaptations": "electric_wheel"}]',
    '[{"step": 1, "description": "Clay preparation", "duration": 120, "difficulty": "intermediate"}]',
    'Cultural Heritage Team'
),
(
    'Berber Carpet Weaving', 'carpet_weaving', 'marrakech_safi', 'Ancient',
    'high',
    '[{"name": "wool", "source": "atlas_mountains", "preparation": "hand_spun"}]',
    '[{"name": "traditional_loom", "traditional_form": "vertical_loom", "modern_adaptations": "none"}]',
    '[{"step": 1, "description": "Wool preparation", "duration": 480, "difficulty": "advanced"}]',
    'Berber Cultural Institute'
),
(
    'Marrakech Leather Tanning', 'leatherwork', 'marrakech_safi', '11th Century',
    'high',
    '[{"name": "goat_skin", "source": "local_farms", "preparation": "traditional_tanning"}]',
    '[{"name": "tanning_vats", "traditional_form": "stone_vats", "modern_adaptations": "none"}]',
    '[{"step": 1, "description": "Skin preparation", "duration": 2160, "difficulty": "expert"}]',
    'Leather Artisans Guild'
);

-- Step 3: Insert sample artisan pieces (depends on artisans table)
INSERT INTO artisan_pieces (
    title, description, artisan_id, artisan_name, artisan_bio,
    traditional_practice, journey, multimedia, pricing, blockchain, authenticity, slug
) VALUES (
    'Traditional Fez Blue Pottery Vase',
    'A beautiful hand-crafted pottery vase using traditional Fez blue glazing techniques passed down through generations.',
    (SELECT id FROM artisans WHERE name = 'Hassan Benali' LIMIT 1),
    'Hassan Benali',
    'Master potter from Fez with over 30 years of experience in traditional Moroccan ceramics.',
    '{"technique": "Fez Blue Pottery", "region": "Fez", "materials": ["local_clay", "natural_glazes"], "tools": ["pottery_wheel", "traditional_kiln"]}',
    '{"stages": [{"name": "Clay Preparation", "duration": "2 hours", "description": "Preparing and aging local clay"}]}',
    '{"images": ["/images/pottery-process-1.jpg"], "videos": ["/videos/pottery-creation.mp4"]}',
    '{"base_price": 1200, "currency": "MAD", "negotiable": true}',
    '{"contract_address": "", "token_id": "", "minted": false}',
    '{"verified": true, "score": 95, "validators": ["Cultural Heritage Team"]}',
    'traditional-fez-blue-pottery-vase-hassan-benali'
),
(
    'Handwoven Berber Carpet',
    'Authentic Berber carpet featuring traditional geometric patterns, handwoven using ancient techniques.',
    (SELECT id FROM artisans WHERE name = 'Fatima Zahra' LIMIT 1),
    'Fatima Zahra',
    'Master weaver specializing in traditional Berber carpets from the Atlas Mountains.',
    '{"technique": "Berber Carpet Weaving", "region": "Atlas Mountains", "materials": ["mountain_wool", "natural_dyes"], "tools": ["vertical_loom", "hand_tools"]}',
    '{"stages": [{"name": "Wool Preparation", "duration": "8 hours", "description": "Cleaning and spinning mountain wool"}]}',
    '{"images": ["/images/carpet-weaving-1.jpg"], "videos": ["/videos/berber-weaving.mp4"]}',
    '{"base_price": 3500, "currency": "MAD", "negotiable": true}',
    '{"contract_address": "", "token_id": "", "minted": false}',
    '{"verified": true, "score": 98, "validators": ["Berber Cultural Institute"]}',
    'handwoven-berber-carpet-fatima-zahra'
),
(
    'Traditional Leather Pouf',
    'Handcrafted leather pouf using traditional Marrakech tanning and stitching techniques.',
    (SELECT id FROM artisans WHERE name = 'Ahmed Tazi' LIMIT 1),
    'Ahmed Tazi',
    'Skilled leather artisan from Marrakech with expertise in traditional tanning methods.',
    '{"technique": "Marrakech Leather Tanning", "region": "Marrakech", "materials": ["goat_leather", "natural_tannins"], "tools": ["tanning_vats", "hand_tools"]}',
    '{"stages": [{"name": "Leather Preparation", "duration": "72 hours", "description": "Traditional tanning process"}]}',
    '{"images": ["/images/leather-work-1.jpg"], "videos": ["/videos/leather-tanning.mp4"]}',
    '{"base_price": 800, "currency": "MAD", "negotiable": false}',
    '{"contract_address": "", "token_id": "", "minted": false}',
    '{"verified": true, "score": 92, "validators": ["Leather Artisans Guild"]}',
    'traditional-leather-pouf-ahmed-tazi'
);

-- Step 4: Insert sample journey documentation (depends on artisan_pieces and artisans)
INSERT INTO artisan_journey_documentation (
    piece_id, artisan_id, content_team, status
) VALUES (
    (SELECT id FROM artisan_pieces WHERE slug = 'traditional-fez-blue-pottery-vase-hassan-benali' LIMIT 1),
    (SELECT id FROM artisans WHERE name = 'Hassan Benali' LIMIT 1),
    '{"roles": {"contentDirector": "Ahmed Hassan", "videographers": ["Fatima Al-Zahra"], "photographers": ["Omar Benjelloun"]}}',
    'planning'
);

-- Step 5: Verify the data was inserted correctly
SELECT 'Traditional Practices Count' as table_name, COUNT(*) as count FROM traditional_practices_database
UNION ALL
SELECT 'Artisan Pieces Count', COUNT(*) FROM artisan_pieces
UNION ALL
SELECT 'Journey Documentation Count', COUNT(*) FROM artisan_journey_documentation
UNION ALL
SELECT 'Artisans Count', COUNT(*) FROM artisans; 