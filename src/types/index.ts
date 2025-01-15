export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio?: string;
  cars?: Car[];
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  photos: string[];
  description?: string;
}

export interface Post {
  id: string;
  user: User;
  images: string[];
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'meet' | 'race' | 'cruise' | 'show';
  date: string;
  location: string;
  organizer: User;
  attendees: User[];
  cover: string;
}