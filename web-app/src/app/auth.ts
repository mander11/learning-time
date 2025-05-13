import NextAuth, { User, Account, Session, DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import { NextRequest } from "next/server";

// Extend the Session type to include accessToken
declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
  }
}

export const auth = NextAuth({

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after sign in
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: any }) {
      // Send properties to the client, like an access_token from a provider
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
});
