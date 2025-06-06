import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xwtyhpwmplcqprtzrirm.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3dHlocHdtcGxjcXBydHpyaXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzMTI2NDEsImV4cCI6MjA0ODg4ODY0MX0.TsGqL0vA4iLJAR_Cp0ZWwcKgCTHaOe1mKRRQxgRAi8s';

const supabase = createClient(supabaseUrl, supabaseKey);

export interface ExperienceNarration {
  id: string;
  experience_id: string;
  title: string;
  summary: string;
  image_1_url: string;
  image_2_url: string;
  video_url: string;
  video_duration: number; // in seconds
  artisan_voice_script: string;
  cultural_context: string;
  created_at: string;
}

class NarrationService {
  async getNarrationByExperienceId(experienceId: string): Promise<ExperienceNarration | null> {
    try {
      console.log('Fetching narration for experience:', experienceId);
      
      const { data, error } = await supabase
        .from('experience_narrations')
        .select('*')
        .eq('experience_id', experienceId)
        .single();

      if (error) {
        console.warn('No narration found for experience:', experienceId, error);
        return this.getMockNarration(experienceId);
      }

      return data;
    } catch (error) {
      console.error('Error fetching narration:', error);
      return this.getMockNarration(experienceId);
    }
  }

  private getMockNarration(experienceId: string): ExperienceNarration {
    const mockNarrations: Record<string, ExperienceNarration> = {
      'exp1': {
        id: 'narr1',
        experience_id: 'exp1',
        title: 'The Art of Traditional Pottery',
        summary: 'Discover the ancient techniques of Moroccan pottery making with Hassan, a master craftsman whose family has practiced this art for over 200 years. Learn about the sacred clay from the Atlas Mountains and the traditional glazing methods passed down through generations.',
        image_1_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        image_2_url: 'https://images.unsplash.com/photo-1594736797933-d0bbc95d9a3e?w=400&h=300&fit=crop',
        video_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        video_duration: 660,
        artisan_voice_script: 'Welcome to my workshop. I am Hassan, and pottery flows in my blood like the river flows to the sea. My grandfather taught me that clay speaks to those who listen...',
        cultural_context: 'Fez pottery represents 1,000 years of Moroccan ceramic tradition, with techniques unchanged since the Marinid dynasty.',
        created_at: new Date().toISOString()
      },
      'exp2': {
        id: 'narr2',
        experience_id: 'exp2',
        title: 'Berber Weaving Secrets',
        summary: 'Experience the mystical art of Berber weaving with Fatima in the Atlas Mountains. Each pattern tells a story of her ancestors, and every thread carries the wisdom of generations. Learn the symbolic meanings behind traditional Amazigh designs.',
        image_1_url: 'https://images.unsplash.com/photo-1594736797933-d0bbc95d9a3e?w=400&h=300&fit=crop',
        image_2_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        video_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        video_duration: 660,
        artisan_voice_script: 'Each pattern you see here is a word in our ancient language. My grandmother taught me that we weave not just wool, but stories, dreams, and the soul of our mountains...',
        cultural_context: 'Berber weaving is an ancient communication system where patterns convey tribal identity, protection symbols, and ancestral wisdom.',
        created_at: new Date().toISOString()
      },
      'exp3': {
        id: 'narr3',
        experience_id: 'exp3',
        title: 'The Sacred Art of Tagine',
        summary: 'Join Aicha in her family kitchen where the art of tagine cooking has been perfected over 5 generations. Learn the secret spice blends that make Moroccan cuisine legendary, and understand the cultural significance of communal dining in Moroccan society.',
        image_1_url: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400&h=300&fit=crop',
        image_2_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop',
        video_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        video_duration: 660,
        artisan_voice_script: 'Cooking is prayer in my family. When I blend these spices, I am continuing a conversation that began with my great-great-grandmother...',
        cultural_context: 'Tagine cooking represents the intersection of Berber, Arab, and Andalusian culinary traditions, embodying Morocco\'s cultural diversity.',
        created_at: new Date().toISOString()
      }
    };

    return mockNarrations[experienceId] || {
      id: 'default',
      experience_id: experienceId,
      title: 'Artisan Story',
      summary: 'Discover the rich cultural heritage behind this authentic Moroccan craft.',
      image_1_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      image_2_url: 'https://images.unsplash.com/photo-1594736797933-d0bbc95d9a3e?w=400&h=300&fit=crop',
      video_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      video_duration: 660,
      artisan_voice_script: 'This is my craft, passed down through generations...',
      cultural_context: 'A beautiful example of Moroccan cultural heritage and traditional craftsmanship.',
      created_at: new Date().toISOString()
    };
  }
}

export default new NarrationService(); 