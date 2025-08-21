import axios from "axios";
import https from "https";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";

const agent = new https.Agent({
  rejectUnauthorized: false, // ⚠️ solo en dev
});

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_GOOGLE || "",
      clientSecret: process.env.NEXT_PUBLIC_SECRET_CLIENT || "",
      authorization: {
        params: { prompt: "select_account" },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.id_token) {
        try {
          // le paso el idToken de Google a mi backend
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_AUTH}api/auth/google-login`,
            { idToken: account.id_token },
            { httpsAgent: agent }
          );

          // backend responde con { token: "<jwt interno>" }
          token.internalJwt = res.data.token;
        } catch (err) {
          console.error("Error en google-login backend:", err);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.internalJwt) {
        session.token = token.internalJwt;
      }
      return session;
    },
  },

  events: {
    async signIn({ token }) {
      if (token?.internalJwt) {
        cookies().set("token", token.internalJwt, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });
      }
    },
  },
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET || "",
});

export { handler as GET, handler as POST };
