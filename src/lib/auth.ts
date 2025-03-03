import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
}

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: User }) {
      console.log(user);
      return true;
    },
  },
  pages: {
    signIn: "/sign-in", // Make sure you have this page created
  },
};

export const auth = NextAuth(authOptions); //
