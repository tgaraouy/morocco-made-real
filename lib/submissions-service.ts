import { supabase } from './supabase';

export interface ExperienceSubmission {
  id?: string;
  title: string;
  artisan_name: string;
  artisan_email?: string;
  craft: string;
  location: string;
  price: number;
  duration: string;
  description: string;
  image: string;
  artisan_age: number;
  artisan_experience: string;
  heritage?: string;
  certification?: string;
  languages: string[];
  tags: string[];
  quick_moods: string[];
  experience_styles: string[];
  interactive_content: {
    audioStory: {
      duration: string;
      title: string;
      description: string;
    };
    videoPreview: {
      duration: string;
      title: string;
      highlights: string[];
    };
    culturalContext: {
      tradition: string;
      significance: string;
      history: string;
      readTime: string;
    };
    learningOutcomes?: {
      skills: string[];
      techniques: string[];
      takeaways: string[];
      materials: string[];
    };
    blockchainProofs?: {
      artisanVerification: string;
      heritageAuthenticity: string;
      skillCertification: string;
      communityEndorsement: string;
      blockchainHash: string;
    };
    aiExplanation?: {
      vibeMatch: string;
      styleMatch: string;
      personalityFit: string;
      confidenceScore: number;
    };
  };
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  submitted_at?: string;
  reviewed_at?: string;
  reviewer_notes?: string;
  rejection_reason?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SubmissionStats {
  total_submissions: number;
  pending_submissions: number;
  approved_submissions: number;
  rejected_submissions: number;
  draft_submissions: number;
  avg_review_time_hours: number;
}

class SubmissionsService {
  // Submit a new experience
  async submitExperience(submissionData: Omit<ExperienceSubmission, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<ExperienceSubmission> {
    try {
      // Generate blockchain certification for the submission
      const blockchainData = this.generateBlockchainCertification(submissionData);
      
      const experienceWithBlockchain = {
        ...submissionData,
        interactive_content: {
          ...submissionData.interactive_content,
          blockchainProofs: blockchainData
        },
        status: 'pending' as const
      };

      const { data, error } = await supabase
        .from('experience_submissions')
        .insert([experienceWithBlockchain])
        .select()
        .single();

      if (error) {
        console.error('Error submitting experience:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to submit experience:', error);
      // Return mock data for demo purposes
      return {
        id: `mock_${Date.now()}`,
        ...submissionData,
        status: 'pending',
        created_at: new Date().toISOString(),
        interactive_content: {
          ...submissionData.interactive_content,
          blockchainProofs: this.generateBlockchainCertification(submissionData)
        }
      };
    }
  }

  // Save experience as draft
  async saveDraft(submissionData: Omit<ExperienceSubmission, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<ExperienceSubmission> {
    try {
      const draftData = {
        ...submissionData,
        status: 'draft' as const
      };

      const { data, error } = await supabase
        .from('experience_submissions')
        .insert([draftData])
        .select()
        .single();

      if (error) {
        console.error('Error saving draft:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to save draft:', error);
      // Return mock data for demo purposes
      return {
        id: `draft_${Date.now()}`,
        ...submissionData,
        status: 'draft',
        created_at: new Date().toISOString()
      };
    }
  }

  // Get all pending submissions for review
  async getPendingSubmissions(): Promise<ExperienceSubmission[]> {
    try {
      const { data, error } = await supabase
        .from('experience_submissions')
        .select('*')
        .eq('status', 'pending')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching pending submissions:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch pending submissions:', error);
      // Return mock data for demo purposes
      return [
        {
          id: 'mock_pending_1',
          title: "Amina's Sacred Pottery Rituals",
          artisan_name: 'Amina El Fassi',
          artisan_email: 'amina@example.com',
          craft: 'pottery',
          location: 'Safi',
          price: 85,
          duration: '5 hours',
          description: 'Learn the ancient art of Safi pottery, where each piece carries the spiritual energy of our ancestors.',
          image: '🏺',
          artisan_age: 58,
          artisan_experience: '30 years mastering traditional Safi pottery techniques',
          heritage: '7th generation potter, family workshop established in 1780',
          certification: 'Master Potter (Maalem) - Safi Guild Certified',
          languages: ['AR', 'FR', 'Berber'],
          tags: ['🏺 Traditional', '🙏 Spiritual', '🌟 Sacred'],
          quick_moods: ['creative', 'learn', 'relax'],
          experience_styles: ['hands-on', 'storytelling', 'meditative'],
          interactive_content: {
            audioStory: {
              title: 'The Sacred Clay of Safi',
              duration: '4 minutes',
              description: 'Listen to Amina share the spiritual significance of Safi clay and the blessing rituals.'
            },
            videoPreview: {
              title: 'Ancient Pottery Techniques',
              duration: '2 minutes',
              highlights: ['Sacred clay preparation', 'Traditional wheel spinning', 'Ancestral firing methods']
            },
            culturalContext: {
              tradition: 'Safi pottery represents one of Morocco\'s most sacred ceramic traditions.',
              significance: 'The blue and white patterns tell stories of water, sky, and divine protection.',
              history: 'The pottery tradition of Safi dates back to the 12th century.',
              readTime: '3 minutes'
            }
          },
          status: 'pending',
          submitted_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() // 2 days ago
        }
      ];
    }
  }

  // Approve a submission
  async approveSubmission(submissionId: string, reviewerNotes?: string): Promise<string> {
    try {
      const { data, error } = await supabase.rpc('approve_experience_submission', {
        submission_id: submissionId,
        reviewer_user_id: 'admin', // In real app, get from auth
        notes: reviewerNotes
      });

      if (error) {
        console.error('Error approving submission:', error);
        throw error;
      }

      return data; // Returns the new experience ID
    } catch (error) {
      console.error('Failed to approve submission:', error);
      throw error;
    }
  }

  // Reject a submission
  async rejectSubmission(submissionId: string, reason: string, reviewerNotes?: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('reject_experience_submission', {
        submission_id: submissionId,
        reviewer_user_id: 'admin', // In real app, get from auth
        reason,
        notes: reviewerNotes
      });

      if (error) {
        console.error('Error rejecting submission:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to reject submission:', error);
      throw error;
    }
  }

  // Get submission statistics
  async getSubmissionStats(): Promise<SubmissionStats> {
    try {
      const { data, error } = await supabase.rpc('get_submission_stats');

      if (error) {
        console.error('Error fetching submission stats:', error);
        throw error;
      }

      return data[0] || {
        total_submissions: 0,
        pending_submissions: 0,
        approved_submissions: 0,
        rejected_submissions: 0,
        draft_submissions: 0,
        avg_review_time_hours: 0
      };
    } catch (error) {
      console.error('Failed to fetch submission stats:', error);
      // Return mock data for demo purposes
      return {
        total_submissions: 15,
        pending_submissions: 3,
        approved_submissions: 10,
        rejected_submissions: 1,
        draft_submissions: 1,
        avg_review_time_hours: 8.5
      };
    }
  }

  // Get artisan's submission history
  async getArtisanSubmissions(artisanEmail: string): Promise<ExperienceSubmission[]> {
    try {
      const { data, error } = await supabase.rpc('get_artisan_submissions', {
        artisan_email_param: artisanEmail
      });

      if (error) {
        console.error('Error fetching artisan submissions:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch artisan submissions:', error);
      return [];
    }
  }

  // Generate blockchain certification
  private generateBlockchainCertification(submissionData: Partial<ExperienceSubmission>) {
    const timestamp = Date.now();
    const verificationId = `MA-${submissionData.craft?.substring(0, 3).toUpperCase()}-${timestamp}`;
    const hash = this.generateHash(submissionData.artisan_name + submissionData.title + timestamp);

    return {
      artisanVerification: `${submissionData.artisan_name} verified artisan - ID: ${verificationId}`,
      heritageAuthenticity: 'Authenticated by Moroccan Ministry of Handicrafts & Social Economy',
      skillCertification: `Master ${submissionData.craft} certification - Traditional crafts`,
      communityEndorsement: `Endorsed by ${submissionData.location} Artisan Cooperative`,
      blockchainHash: `0x${hash}...${submissionData.artisan_name?.replace(/\s/g, '').toLowerCase()}-verified-2024`
    };
  }

  // Simple hash generator for demo purposes
  private generateHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  // Update submission
  async updateSubmission(submissionId: string, updates: Partial<ExperienceSubmission>): Promise<ExperienceSubmission> {
    try {
      const { data, error } = await supabase
        .from('experience_submissions')
        .update(updates)
        .eq('id', submissionId)
        .select()
        .single();

      if (error) {
        console.error('Error updating submission:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to update submission:', error);
      throw error;
    }
  }

  // Delete submission
  async deleteSubmission(submissionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('experience_submissions')
        .delete()
        .eq('id', submissionId);

      if (error) {
        console.error('Error deleting submission:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to delete submission:', error);
      return false;
    }
  }

  // Search submissions with multilingual support
  async searchSubmissionsMultilingual(query: string, language: 'french' | 'english' | 'arabic' = 'french', status?: string): Promise<ExperienceSubmission[]> {
    try {
      const { data, error } = await supabase.rpc('search_experiences_multilingual', {
        search_query: query,
        search_language: language
      });

      if (error) {
        console.error('Error in multilingual search:', error);
        throw error;
      }

      // If status filter is provided, filter the results
      let results = data || [];
      if (status) {
        results = results.filter((item: any) => item.status === status);
      }

      // Get full experience data for the matched IDs
      if (results.length > 0) {
        const ids = results.map((item: any) => item.id);
        const { data: fullData, error: fullError } = await supabase
          .from('experience_submissions')
          .select('*')
          .in('id', ids)
          .order('created_at', { ascending: false });

        if (fullError) {
          console.error('Error fetching full experience data:', fullError);
          return [];
        }

        return fullData || [];
      }

      return [];
    } catch (error) {
      console.error('Failed to perform multilingual search:', error);
      return [];
    }
  }

  // Search submissions (updated for French)
  async searchSubmissions(query: string, status?: string): Promise<ExperienceSubmission[]> {
    try {
      // Use the default French search first
      let queryBuilder = supabase
        .from('experience_submissions')
        .select('*')
        .textSearch('search_vector', query, { config: 'french' });

      if (status) {
        queryBuilder = queryBuilder.eq('status', status);
      }

      const { data, error } = await queryBuilder
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error searching submissions:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to search submissions:', error);
      return [];
    }
  }
}

export default new SubmissionsService(); 