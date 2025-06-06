export interface TouristProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  age?: number;
  languages: string[];
  interests: string[];
  travelStyle: 'luxury' | 'budget' | 'mid-range' | 'backpacker';
  groupSize: number;
  visitDuration: number; // in days
  culturalInterests: string[];
  artisanPreferences: string[];
  budgetRange: {
    min: number;
    max: number;
  };
  accessibility?: string[];
  dietaryRestrictions?: string[];
  previousVisits: number;
  referralSource?: string;
  createdAt: string;
  updatedAt: string;
  verified: boolean;
  status: 'pending' | 'active' | 'suspended';
}

export interface TouristPreferences {
  experienceTypes: string[];
  artisanTypes: string[];
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'flexible';
  interactionLevel: 'observe' | 'participate' | 'learn' | 'master';
  groupOrPrivate: 'group' | 'private' | 'either';
  photographyAllowed: boolean;
  languagePreference: string[];
}

export interface TouristBooking {
  id: string;
  touristId: string;
  artisanId: string;
  experienceId: string;
  bookingDate: string;
  experienceDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  participants: number;
  totalAmount: number;
  currency: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TouristFeedback {
  id: string;
  touristId: string;
  bookingId: string;
  artisanId: string;
  rating: number; // 1-5
  experienceRating: number;
  authenticityRating: number;
  valueRating: number;
  communicationRating: number;
  comment: string;
  wouldRecommend: boolean;
  wouldReturn: boolean;
  photos?: string[];
  createdAt: string;
}

export type TouristOnboardingStep = 
  | 'welcome'
  | 'basic-info'
  | 'preferences'
  | 'interests'
  | 'verification'
  | 'complete';

export interface TouristOnboardingState {
  currentStep: TouristOnboardingStep;
  profile: Partial<TouristProfile>;
  preferences: Partial<TouristPreferences>;
  isComplete: boolean;
  errors: Record<string, string>;
} 