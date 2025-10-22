export type UserType = {
  name?: string;
  description?: string;
  image?: string;
};

export type User = {
  id?: string | number;
  first_name?: string;
  last_name?: string;
  email?: string;
  email_verified?: number | boolean;
  profile?: string;
  status?: number;
  telegram_id?: string | null;
  userType?: UserType | null;
  [key: string]: any;
};