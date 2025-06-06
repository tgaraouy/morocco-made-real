import { useTranslations } from 'next-intl';

// Fallback translations for common keys
const fallbackTranslations: Record<string, Record<string, string>> = {
  tourist: {
    'title': 'Cultural Tourism Dashboard',
    'subtitle': 'Discover authentic Morocco with AI-powered experiences',
    
    'tabs.discover': 'Discover',
    'tabs.plan': 'Plan Journey',
    'tabs.my_journey': 'My Journey',
    'tabs.experiences': 'Experiences',
    'tabs.artisans': 'Artisans',
    'tabs.wishlist': 'Wishlist',
    'tabs.profile': 'Profile',
    
    'stats.destinations': 'Destinations',
    'stats.experiences': 'Experiences',
    'stats.verified_artisans': 'Verified Artisans',
    'stats.happy_travelers': 'Happy Travelers',
    
    'journey.title': 'Your Cultural Journey',
    'journey.step1.title': 'Discover',
    'journey.step1.description': 'Find authentic experiences',
    'journey.step2.title': 'Plan',
    'journey.step2.description': 'Create your itinerary',
    'journey.step3.title': 'Experience',
    'journey.step3.description': 'Enjoy your journey',
    
    'discover.recommendations': 'AI Recommendations',
    'discover.experiences': 'experiences',
    'discover.explore': 'Explore',
    
    'plan.itinerary_generator': 'AI Itinerary Generator',
    'plan.duration': 'Duration',
    'plan.interests': 'Interests',
    'plan.budget': 'Budget',
    'plan.generate_itinerary': 'Generate Itinerary',
    'plan.sample_itinerary': 'Sample Itinerary',
    
    'experiences.authentic_experiences': 'Authentic Experiences',
    'experiences.book_now': 'Book Now',
    
    'artisans.verified_artisans': 'Verified Artisans',
    'artisans.location': 'Location',
    'artisans.rating': 'Rating',
    'artisans.pieces': 'Pieces',
    'artisans.view_profile': 'View Profile',
    'artisans.book_session': 'Book Session',
    
    'wishlist.saved_experiences': 'Saved Experiences',
    'wishlist.empty_title': 'No saved experiences yet',
    'wishlist.empty_description': 'Start exploring and save experiences you love',
    'wishlist.browse_experiences': 'Browse Experiences',
    
    'cta.title': 'Ready to Start Your Cultural Journey?',
    'cta.description': 'Join thousands of travelers discovering authentic Morocco',
    'cta.start_planning': 'Start Planning',
    'cta.explore_destinations': 'Explore Destinations'
  },
  collector: {
    'title': 'Collector Dashboard',
    'subtitle': 'Discover and invest in authentic Moroccan crafts',
    'status': 'Status',
    'level': 'Level',
    
    'tabs.discover': 'Discover',
    'tabs.my_collection': 'My Collection',
    'tabs.wishlist': 'Wishlist',
    'tabs.investments': 'Investments',
    'tabs.profile': 'Profile',
    
    'stats.pieces_owned': 'Pieces Owned',
    'stats.portfolio_growth': 'Portfolio Growth',
    'stats.wishlist_items': 'Wishlist Items',
    'stats.gold_certified': 'Gold Certified'
  },
  artisan: {
    'title': 'Artisan Dashboard',
    'subtitle': 'Share your craft with the world',
    'certification_level': 'Certification Level',
    'rating': 'Rating',
    
    'tabs.overview': 'Overview',
    'tabs.journey': 'Journey',
    'tabs.products': 'Products',
    'tabs.orders': 'Orders',
    'tabs.profile': 'Profile',
    
    'stats.monthly_revenue': 'Monthly Revenue',
    'stats.active_products': 'Active Products',
    'stats.followers': 'Followers',
    'stats.profile_views': 'Profile Views'
  },
  expert: {
    'title': 'Expert Dashboard',
    'subtitle': 'Validate cultural authenticity',
    
    'tabs.pending': 'Pending Reviews',
    'tabs.completed': 'Completed',
    'tabs.analytics': 'Analytics',
    'tabs.knowledge': 'Knowledge Base',
    'tabs.profile': 'Profile'
  },
  content_team: {
    'title': 'Content Team Dashboard',
    'subtitle': 'Create compelling cultural content',
    
    'tabs.overview': 'Overview',
    'tabs.projects': 'Projects',
    'tabs.schedule': 'Schedule',
    'tabs.assets': 'Assets',
    'tabs.team': 'Team'
  }
};

export function useTranslationsWithFallback(namespace: string) {
  const t = useTranslations(namespace);
  
  return (key: string, fallback?: string): string => {
    // First check if we have a predefined fallback - this is fastest and most reliable
    const namespaceFallbacks = fallbackTranslations[namespace];
    if (namespaceFallbacks && namespaceFallbacks[key]) {
      return namespaceFallbacks[key];
    }
    
    // Try to get the translation, but catch any errors
    try {
      const translation = t(key);
      
      // If we get back the key itself or an error message, it means translation is missing
      if (translation && 
          typeof translation === 'string' && 
          translation !== key && 
          !translation.includes('MISSING_MESSAGE') &&
          !translation.includes('Could not resolve')) {
        return translation;
      }
    } catch (error) {
      // Silently handle the error and fall through to fallbacks
      console.warn(`Translation missing for ${namespace}.${key}, using fallback`);
    }
    
    // Use provided fallback or return a formatted version of the key
    return fallback || formatKeyAsFallback(key);
  };
}

function formatKeyAsFallback(key: string): string {
  // Convert dot notation to readable text
  // e.g., "tabs.plan" -> "Plan", "stats.verified_artisans" -> "Verified Artisans"
  const parts = key.split('.');
  const lastPart = parts[parts.length - 1];
  return lastPart
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Server-side version for pages that use getTranslations
export function createTranslationWithFallback(t: any, namespace: string) {
  return (key: string, fallback?: string): string => {
    // First check predefined fallbacks
    const namespaceFallbacks = fallbackTranslations[namespace];
    if (namespaceFallbacks && namespaceFallbacks[key]) {
      return namespaceFallbacks[key];
    }
    
    try {
      const translation = t.raw ? t.raw(key) : t(key);
      
      if (translation && 
          typeof translation === 'string' && 
          translation !== key &&
          !translation.includes('MISSING_MESSAGE') &&
          !translation.includes('Could not resolve')) {
        return translation;
      }
    } catch (error) {
      console.warn(`Translation missing for ${namespace}.${key}, using fallback`);
    }
    
    return fallback || formatKeyAsFallback(key);
  };
} 