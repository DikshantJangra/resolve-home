export type BookingStatus = 'Upcoming' | 'Completed' | 'Active' | 'Cancelled' | 'In Progress';

export interface Review {
  id: string;
  rating: number;
  location: string;
  title: string;
  comment: string;
  images: string[];
}

export interface ProgressStep {
  label: string;
  status: 'pending' | 'current' | 'completed';
}

export interface Booking {
  id: string;
  referenceId: string;
  category: string;
  description: string;
  status: BookingStatus;
  professional: {
    name: string;
    avatar: string;
    rating: number;
    specialty?: string;
    jobsCompleted?: number;
    distance?: string;
    isVerified?: boolean;
    reviews?: Review[];
  };
  price: number;
  date: string;
  time: string;
  address: string;
  isEmergency?: boolean;
  eta?: string;
  progress?: ProgressStep[];
}
