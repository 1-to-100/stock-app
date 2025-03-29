export interface User {
  id: number;
  name: string;
  email: string | string[];
  customer: string;
  role: string;
  persona: string;
  status: string;
  avatar?: string;
  activity?: { id: number; browserOs: string; locationTime: string }[];

  [key: string]: unknown;
}
