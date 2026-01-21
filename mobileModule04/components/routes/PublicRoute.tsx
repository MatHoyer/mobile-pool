import { Redirect } from "expo-router";
import { PropsWithChildren } from "react";
import { useAuth } from "../providers/auth.provider";

const PublicRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    return <Redirect href="/profile" />;
  }

  return children;
};

export default PublicRoute;
