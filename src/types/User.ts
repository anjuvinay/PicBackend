
export interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    gender: string;
    role: 'admin' | 'user';
  isBlocked: boolean;
  subscription:'Standard'| 'Premium' | 'Platinum'
  expiryDate?: Date | null;
   
}


export interface IPublicUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  profileId?: string | null;
  subscription:'Standard'| 'Premium' | 'Platinum';
}

