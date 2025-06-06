export interface UserPreferences {
  mood: string;
  time?: string;
  timeAvailable?: string;
  budget?: string;
  priceRange?: string;
}

export interface TouristData {
  id: string;
  name: string;
  preferences: UserPreferences;
  saved_experiences: any[];
  [key: string]: any;
} 