import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createHost, getHost } from "./data-service";

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
}

declare module "next-auth" {
  interface Session {
    hostId?: string;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      // __Secure-next-auth.session-token during production
      options: {
        httpOnly: true,
        secure: false, // process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "lax",
        path: "/",
      },
    },
  },
  callbacks: {
    authorized({ auth }) {
      return !!auth;
    },
    async signIn({ user }: { user: User }) {
      const { name: fullName, email } = user;

      // Check if the user is a host
      const host = await getHost({ email });
      if (host) return true;

      // Create a new host
      const data = await createHost({ fullName, email });
      if (data) return true;

      return false;
    },

    async session({ session }) {
      const email = session?.user?.email;
      if (!email) throw new Error("Something went wrong, please log in again");
      const { id, premium } = await getHost({ email });
      session.hostId = id;
      session.premium = premium;
      return session;
    },
  },
  pages: {
    signIn: "/sign-in", // Make sure you have this page created
  },
  events: {
    async signIn(message: string) {
      console.log("SIGN IN", message);
    },
  },
};

export const auth = NextAuth(authOptions); //
