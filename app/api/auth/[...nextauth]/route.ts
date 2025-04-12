import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";


const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_GOOGLE || "",
      clientSecret: process.env.NEXT_PUBLIC_SECRET_CLIENT || "",
      authorization: {
        params: {
          prompt: "select_account"
        },
      },
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.id_token) {
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.idToken) {
        session.idToken = token.idToken as string;
      }
      return session;
    },
  },
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET || "",

})


export { handler as GET, handler as POST };

