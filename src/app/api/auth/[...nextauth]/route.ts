import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/utils/db";

const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
      },

      async authorize(credentials, req) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        const user: any = await prisma.user.findFirst({
          where: { username },
        });

        if (user.username) {
          const passwordMatch = await bcrypt.compare(password, user!.password);
          if (passwordMatch) {
            return user;
          } else {
            return null;
          }
        } else {
          return null;
        }
      },
    }),
  ],

  pages: { signIn: "/login" },

  callbacks: {
    async jwt({ token, account, profile, user }: any) {
      if (account?.provider === "credentials") {
        token.sub = user.id;
        token.name = user.id;
        token.email = user.username;
      }
      return token;
    },

    async session({ session, token }: any) {
      if ("id" in token) {
        session.user.id = token.sub;
      }
      if ("name" in token) {
        session.user.name = token.name;
      }
      if ("email" in token) {
        session.user.email = token.email;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
