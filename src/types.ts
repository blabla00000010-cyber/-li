export type ListingCategory = 'companies' | 'schools' | 'stores' | 'others';

export interface Listing {
  id: string;
  name: string;
  category: ListingCategory;
  description: string;
  lat: number;
  lng: number;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logoUrl?: string;
  rating: number;
  reviewsCount: number;
  workingHours?: string;
  createdAt: string;
  featured?: boolean;
}

export interface Review {
  id: string;
  listingId: string;
  senderName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface Reply {
  id: string;
  senderType: 'user' | 'listing';
  senderName: string;
  messageText: string;
  createdAt: string;
}

export interface Message {
  id: string;
  listingId: string;
  listingName: string; // denormalized for convenience
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  subject: string;
  messageText: string;
  createdAt: string;
  readByListing: boolean;
  replies: Reply[];
}
