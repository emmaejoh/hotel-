import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'Manager' | 'Supervisor' | 'Staff' | 'Customer';
      department?: 'Kitchen' | 'Bar' | 'Laundry' | 'Room Service';
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: 'Manager' | 'Supervisor' | 'Staff' | 'Customer';
    department?: 'Kitchen' | 'Bar' | 'Laundry' | 'Room Service';
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    role: 'Manager' | 'Supervisor' | 'Staff' | 'Customer';
    department?: 'Kitchen' | 'Bar' | 'Laundry' | 'Room Service';
  }
}
