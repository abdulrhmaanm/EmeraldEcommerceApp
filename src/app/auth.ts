import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "username@domain" },
        password: { label: "Password", type: "password", placeholder: "password" },
      },
      authorize: async (
        credentials: Record<"email" | "password", string> | undefined,
      ): Promise<IUser | null> => {
        if (!credentials) return null;

        try {
          const res = await fetch(
            "https://ecommerce.routemisr.com/api/v1/auth/signin",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const data = await res.json();
          if (!res.ok || !data) return null;

          const decoded = JSON.parse(atob(data.token.split(".")[1]));

          return {
            id: decoded.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role || "user",
            token: data.token,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.token;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        role: token.role as string,
      };
      session.accessToken = token.accessToken as string;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};
