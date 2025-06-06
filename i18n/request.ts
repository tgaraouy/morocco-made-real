import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // Validate locale and provide fallback
  const validLocales = ['en', 'fr', 'ar', 'es'];
  const validLocale = locale && validLocales.includes(locale) ? locale : 'en';
  
  // Load messages for the validated locale
  let messages;
  try {
    messages = (await import(`../messages/${validLocale}.json`)).default;
  } catch (error) {
    console.warn(`Failed to load messages for locale ${validLocale}, falling back to English`);
    // Fallback to English messages
    try {
      messages = (await import(`../messages/en.json`)).default;
    } catch (fallbackError) {
      console.error('Failed to load English fallback messages:', fallbackError);
      // Basic fallback messages
      messages = {
        homepage: {
          title: 'Morocco Made Real',
          subtitle: 'Your AI-Powered Cultural Tourism Platform',
          description: 'Discover authentic Morocco with AI-driven experiences.',
          plan_cta: 'Plan Your Journey',
          explore_cta: 'Explore Features'
        },
        navigation: {
          home: 'Home',
          explore: 'Explore',
          plan: 'Plan'
        },
        footer: {
          title: 'Morocco Made Real',
          description: 'AI platform for cultural tourism.',
          vision: 'Supporting Morocco Vision 2030'
        }
      };
    }
  }
  
  return {
    locale: validLocale,
    messages,
    timeZone: 'Africa/Casablanca',
    defaultTranslationValues: {
      strong: (chunks) => `<strong>${chunks}</strong>`,
    },
    // Handle missing messages gracefully
    onError: (error) => {
      if (error.code === 'MISSING_MESSAGE') {
        console.warn('Missing translation:', error.message);
        // Don't throw, just log the warning
        return;
      }
      // For other errors, still throw
      throw error;
    },
    // Provide fallback for missing messages
    getMessageFallback: ({ namespace, key, error }) => {
      const path = [namespace, key].filter(Boolean).join('.');
      console.warn(`Missing translation: ${path}`);
      
      // Return a formatted version of the key as fallback
      const keyParts = key.split('.');
      const lastPart = keyParts[keyParts.length - 1];
      return lastPart
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  };
}); 