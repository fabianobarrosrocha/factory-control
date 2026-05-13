// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as jwtNextAuth from "next-auth/jwt";
import { DefaultSession } from "next-auth";
import { AccessLevel } from "@/types/user.types";

declare module "next-auth/jwt" {
  interface JWT {
    idToken?: string;
    accessToken?: string;
    access_level?: AccessLevel;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      idToken?: string;
      accessToken?: string;
      access_level?: AccessLevel;
    } & DefaultSession["user"];
  }

  interface User {
    idToken?: string;
    accessToken?: string;
    access_level?: AccessLevel;
  }
}
