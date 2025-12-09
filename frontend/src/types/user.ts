export interface User {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface Settings {
  darkMode: boolean;
  notifications: boolean;
  autoRefresh: boolean;
}

