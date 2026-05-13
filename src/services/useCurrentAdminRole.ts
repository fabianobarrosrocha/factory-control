import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
  const session = useSession();
  return session.data?.user;
};

export const useCurrentAdminRole = () => {
  const session = useSession();
  return session.data?.user?.access_level === "administrator";
};
