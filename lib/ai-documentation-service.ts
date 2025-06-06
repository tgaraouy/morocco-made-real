// ============================================================================
// AI DOCUMENTATION SERVICE
// Human-guided AI assistance for cultural preservation
// Policy: "AI-assisted, human-approved"
// ============================================================================

import OpenAI from 'openai';

// ============================================================================
// AI DOCUMENTATION INTERFACES
// ============================================================================

interface CulturalTranscription {
  originalLanguage: 'darija' | 'arabic' | 'french' | 'english';
  originalText: string;
  translations: {
    arabic?: string;
    french?: string;
    english?: string;
  };
  confidence: number;
  culturalContext: string[];
  needsHumanReview: boolean;
}

interface ArtisanProfile {
  culturalBio: string;
  craftDescription: string;
  techniques: string[];
  culturalSignificance: string;
  personalStory: string;
  familyTradition: string;
  suggestedTags: string[];
  aiGenerated: boolean;
  humanApprovalStatus: 'pending' | 'approved' | 'needs_revision';
}

interface CulturalDNAData {
  region: string;
  specificLocation: string;
  craftCategory: string;
  techniqueTypes: string[];
  culturalMeaning: string;
  endangermentLevel: 'stable' | 'vulnerable' | 'endangered' | 'critically_endangered';
  validationLevel: 0 | 1 | 2 | 3;
}

// ============================================================================
// AI DOCUMENTATION SERVICE
// ============================================================================

export class AIDocumentationService {
  private openai: OpenAI;
  private culturalContext: Map<string, any> = new Map();

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.loadCulturalContext();
  }

  // ========================================================================
  // TRANSCRIPTION & TRANSLATION
  // ========================================================================

  async transcribeAndTranslate(
    audioFile: File | Buffer,
    originalLanguage: 'darija' | 'arabic' | 'french' | 'english'
  ): Promise<CulturalTranscription> {
    try {
      // 1. Transcribe audio using Whisper
      const transcription = await this.openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: this.mapLanguageCode(originalLanguage),
        prompt: 'This is an interview with a Moroccan artisan discussing traditional crafts and cultural heritage.'
      });

      const originalText = transcription.text;

      // 2. Translate to multiple languages with cultural context
      const translations = await this.translateWithCulturalContext(originalText, originalLanguage);

      // 3. Extract cultural context and assess quality
      const culturalAnalysis = await this.analyzeCulturalContext(originalText, originalLanguage);

      return {
        originalLanguage,
        originalText,
        translations,
        confidence: culturalAnalysis.confidence,
        culturalContext: culturalAnalysis.context,
        needsHumanReview: culturalAnalysis.confidence < 0.8 || culturalAnalysis.hasSensitiveContent
      };

    } catch (error) {
      throw new Error(`Transcription failed: ${error.message}`);
    }
  }

  private async translateWithCulturalContext(
    text: string,
    sourceLanguage: string
  ): Promise<{ arabic?: string; french?: string; english?: string }> {
    const translations: any = {};

    const targetLanguages = ['arabic', 'french', 'english'].filter(lang => lang !== sourceLanguage);

    for (const targetLang of targetLanguages) {
      const prompt = `
        Translate the following Moroccan artisan interview from ${sourceLanguage} to ${targetLang}.
        Preserve cultural nuances, traditional craft terminology, and maintain respect for cultural heritage.
        
        Original text: "${text}"
        
        Provide a culturally sensitive translation that maintains the authenticity of the artisan's voice:
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a cultural translator specializing in Moroccan heritage and traditional crafts. Maintain authenticity and respect in all translations.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3
      });

      translations[targetLang] = response.choices[0].message.content;
    }

    return translations;
  }

  // ========================================================================
  // ARTISAN PROFILE GENERATION
  // ========================================================================

  async generateArtisanProfile(
    transcription: CulturalTranscription,
    additionalContext?: any
  ): Promise<ArtisanProfile> {
    try {
      const prompt = `
        Based on this artisan interview, create a comprehensive cultural profile:
        
        Interview Content: "${transcription.originalText}"
        Cultural Context: ${transcription.culturalContext.join(', ')}
        Additional Context: ${JSON.stringify(additionalContext || {})}
        
        Generate a profile that includes:
        1. Cultural Bio (200-300 words) - Personal story with cultural context
        2. Craft Description (150-200 words) - Technical and cultural aspects
        3. Techniques List - Specific traditional methods used
        4. Cultural Significance - Meaning within Moroccan heritage
        5. Personal Story - Human elements that connect with tourists
        6. Family Tradition - Generational knowledge and lineage
        7. Suggested Tags - For categorization and discovery
        
        Maintain authenticity and respect for traditional knowledge.
        Format as JSON with clear sections.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a cultural heritage specialist creating authentic artisan profiles for Morocco Made Real. 
            Focus on preserving cultural authenticity while making content accessible to international tourists.
            Always include the disclaimer that this is "AI-assisted, human-approved" content.`
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.4
      });

      const profileData = JSON.parse(response.choices[0].message.content || '{}');

      return {
        culturalBio: profileData.culturalBio || '',
        craftDescription: profileData.craftDescription || '',
        techniques: profileData.techniques || [],
        culturalSignificance: profileData.culturalSignificance || '',
        personalStory: profileData.personalStory || '',
        familyTradition: profileData.familyTradition || '',
        suggestedTags: profileData.suggestedTags || [],
        aiGenerated: true,
        humanApprovalStatus: 'pending'
      };

    } catch (error) {
      throw new Error(`Profile generation failed: ${error.message}`);
    }
  }

  // ========================================================================
  // CULTURAL DNA EXTRACTION
  // ========================================================================

  async extractCulturalDNA(
    transcription: CulturalTranscription,
    profile: ArtisanProfile
  ): Promise<CulturalDNAData> {
    try {
      const prompt = `
        Analyze this artisan data to extract Cultural DNA classification:
        
        Interview: "${transcription.originalText}"
        Profile: ${JSON.stringify(profile)}
        
        Extract and classify:
        1. Geographic Region (North/Central/South/Sahara/Atlas/Coast)
        2. Specific Location (city/village)
        3. Craft Category (Pottery/Weaving/Metalwork/Leather/Woodwork/Jewelry)
        4. Technique Types (specific traditional methods)
        5. Cultural Meaning (significance in Moroccan heritage)
        6. Endangerment Level (stable/vulnerable/endangered/critically_endangered)
        
        Base endangerment assessment on:
        - Number of practitioners mentioned
        - Age of knowledge bearers
        - Transmission methods (family/community/formal)
        - Economic viability
        
        Return as JSON with clear classifications.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a cultural anthropologist specializing in Moroccan traditional crafts and heritage classification.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2 // Lower temperature for more consistent classification
      });

      const dnaData = JSON.parse(response.choices[0].message.content || '{}');

      return {
        region: dnaData.region || 'Central',
        specificLocation: dnaData.specificLocation || '',
        craftCategory: dnaData.craftCategory || 'Pottery',
        techniqueTypes: dnaData.techniqueTypes || [],
        culturalMeaning: dnaData.culturalMeaning || '',
        endangermentLevel: dnaData.endangermentLevel || 'stable',
        validationLevel: 0 // Always starts at 0 (pending)
      };

    } catch (error) {
      throw new Error(`Cultural DNA extraction failed: ${error.message}`);
    }
  }

  // ========================================================================
  // VISUAL CONTENT ANALYSIS
  // ========================================================================

  async generateImageCaptions(
    imageUrls: string[],
    culturalContext: CulturalDNAData
  ): Promise<{ url: string; caption: string; culturalNotes: string }[]> {
    const results = [];

    for (const url of imageUrls) {
      try {
        const prompt = `
          Analyze this image of Moroccan artisan work in the context of:
          Craft: ${culturalContext.craftCategory}
          Region: ${culturalContext.region}
          Location: ${culturalContext.specificLocation}
          
          Generate:
          1. Descriptive caption (50-100 words)
          2. Cultural notes highlighting traditional elements
          
          Focus on technical aspects, cultural significance, and educational value.
        `;

        const response = await this.openai.chat.completions.create({
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                { type: 'image_url', image_url: { url } }
              ]
            }
          ],
          max_tokens: 300
        });

        const content = JSON.parse(response.choices[0].message.content || '{}');
        
        results.push({
          url,
          caption: content.caption || '',
          culturalNotes: content.culturalNotes || ''
        });

      } catch (error) {
        results.push({
          url,
          caption: 'Image analysis pending human review',
          culturalNotes: 'Cultural context to be added by expert'
        });
      }
    }

    return results;
  }

  // ========================================================================
  // HUMAN APPROVAL WORKFLOW
  // ========================================================================

  async requestHumanApproval(
    profileId: string,
    content: ArtisanProfile,
    notes?: string
  ): Promise<void> {
    // This would integrate with your human approval system
    console.log(`[AI DOC] Human approval requested for profile ${profileId}`);
    console.log(`Content type: Artisan Profile`);
    console.log(`Notes: ${notes || 'Standard review requested'}`);
    
    // In production, this would:
    // 1. Send to cultural expert review queue
    // 2. Create approval task
    // 3. Set up notifications
    // 4. Track approval status
  }

  async markAsHumanApproved(
    profileId: string,
    approverDetails: { name: string; credentials: string },
    modifications?: Partial<ArtisanProfile>
  ): Promise<ArtisanProfile> {
    // Apply human modifications and mark as approved
    console.log(`[AI DOC] Profile ${profileId} approved by ${approverDetails.name}`);
    
    // Return updated profile with approval status
    return {
      ...modifications,
      humanApprovalStatus: 'approved',
      aiGenerated: true
    } as ArtisanProfile;
  }

  // ========================================================================
  // HELPER METHODS
  // ========================================================================

  private mapLanguageCode(language: string): string {
    const mapping = {
      'darija': 'ar', // Closest to Arabic
      'arabic': 'ar',
      'french': 'fr',
      'english': 'en'
    };
    return mapping[language] || 'en';
  }

  private async analyzeCulturalContext(
    text: string,
    language: string
  ): Promise<{ confidence: number; context: string[]; hasSensitiveContent: boolean }> {
    const prompt = `
      Analyze this Moroccan artisan interview for:
      1. Cultural context and references
      2. Confidence in transcription quality (0-1)
      3. Presence of sensitive cultural content requiring expert review
      
      Text: "${text}"
      Language: ${language}
      
      Return JSON with confidence, context array, and hasSensitiveContent boolean.
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a cultural sensitivity analyst for Moroccan heritage content.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1
    });

    return JSON.parse(response.choices[0].message.content || '{"confidence": 0.5, "context": [], "hasSensitiveContent": true}');
  }

  private loadCulturalContext(): void {
    // Load cultural reference data
    this.culturalContext.set('regions', {
      'North': ['Tetouan', 'Chefchaouen', 'Tangier'],
      'Central': ['Fez', 'Meknes', 'Rabat'],
      'South': ['Marrakech', 'Draa Valley', 'Ouarzazate'],
      'Atlas': ['High Atlas', 'Middle Atlas', 'Anti-Atlas'],
      'Sahara': ['Merzouga', 'Zagora', 'Tinfou'],
      'Coast': ['Casablanca', 'Essaouira', 'Agadir']
    });

    this.culturalContext.set('crafts', {
      'Pottery': ['wheel throwing', 'hand building', 'glazing', 'firing'],
      'Weaving': ['loom weaving', 'carpet making', 'textile dyeing'],
      'Metalwork': ['brass working', 'silver crafting', 'engraving'],
      'Leather': ['tanning', 'embossing', 'dying', 'stitching'],
      'Woodwork': ['carving', 'inlay', 'marquetry', 'furniture making'],
      'Jewelry': ['silver smithing', 'stone setting', 'filigree', 'enamel work']
    });
  }
}

// Export singleton instance
export const aiDocumentationService = new AIDocumentationService(); 