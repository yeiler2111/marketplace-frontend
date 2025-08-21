import axios from "axios";
import https from "https";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// ⚠️ en DEV ignoramos certificados (no usar en prod)
const agent = new https.Agent({ rejectUnauthorized: false });

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_GOOGLE ?? "",
      clientSecret: process.env.NEXT_PUBLIC_SECRET_CLIENT ?? "",
      authorization: { params: { prompt: "select_account" } },
    }),
  ],

  callbacks: {
    // 🔑 Guardamos el JWT interno del backend en el token
    async jwt({ token, account }) {
      if (account?.id_token) {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_AUTH}api/auth/google-login`,
            { idToken: account.id_token },
            { httpsAgent: agent }
          );
          token.internalJwt = res.data.token;
        } catch (err) {
          console.error("❌ Error en google-login backend:", err);
        }
      }
      return token;
    },

    // 📦 Pasamos el JWT interno al objeto session
    async session({ session, token }) {
      if (token?.internalJwt) {
        session.idToken = token.internalJwt as string;
      }
      return session;
    },
  },

  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET ?? "",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
