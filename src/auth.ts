import axios from "axios";
import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import { signInFormSchema } from "@/schemas/FormSchemas";
import Credentials from "next-auth/providers/credentials";

const providers: Provider[] = [
  Credentials({
    credentials: { password: { label: "Password", type: "password" } },
    async authorize(credentials) {
      const { email, password } = await signInFormSchema.parseAsync(credentials);
      try {
        const user = await axios.post("http://localhost:3001/api/v1/authentication/login", {
          email: email,
          password: password
        });
        if (user) {
          console.log(user.data.user);
          return { ...user.data.user, id: user.data.user.id.toString(), accessToken: user.data.token };
        } else {
          return null;
        }
      } catch (e) {
        console.log(e);
        throw new Error("something went wrong");
      }
    }
  })
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: "jwttoken",
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60 // 24 hours
  },
  providers,
  callbacks: {
    async session({ session, token }) {
      session.user = {
        id: session.userId,
        emailVerified: new Date(),
        idToken: token.idToken,
        name: session.user.name,
        email: session.user.email,
        access_level: token.access_level,
        accessToken: token.accessToken
      };
      return session;
    },
    async jwt({ token, user }) {
      // in console.log() the user returns undefined and I dont know why. But he actual returns the information from user, probably is an error from lib
      if (user) {
        token.idToken = user.id;
        token.accessToken = user.accessToken;
        token.access_level = user.access_level;
      }
      return token;
    }
  }
});
