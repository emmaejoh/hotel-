import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/models/User';
import dbConnect from '@/lib/db';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        await dbConnect();

        const user = await User.findOne({
          email: credentials.email,
        }).select('+password');

        if (!user) {
          return null;
        }

        const isPasswordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordMatch) {
          return null;
        }

        // Return a user object that will be encoded in the JWT
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    // The jwt callback is called whenever a JWT is created
    async jwt({ token, user }) {
      if (user) {
        // When the user first signs in, the user object is available
        token.id = user.id;
        token.role = user.role;
        token.department = user.department;
      }
      return token;
    },
    // The session callback is called whenever a session is checked
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.department = token.department;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login', // Custom login page
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);