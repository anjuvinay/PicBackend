
import { User } from '../../entities/User.js';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
  updateUser(id: string, userDetails: Partial<User>): Promise<User | null>;
 
 
}
