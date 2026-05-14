import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },

      async authorize(credentials) {
        if (
          credentials.username === "Admin01" &&
          credentials.password === "Pass01"
        ) {
          return {
            id: "1",
            name: "Admin",
          };
        }

        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  trustHost: true,

  secret: process.env.AUTH_SECRET,

  pages: {
    signIn: "/bgdk/login",
  },
});