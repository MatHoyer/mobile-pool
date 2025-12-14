import useAuth from "@/hooks/useAuth";
import { Redirect } from "expo-router";
import { PropsWithChildren } from "react";
import AppLoader from "../app/AppLoader";

const PublicRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <AppLoader />;
  }

  if (user) {
    return <Redirect href="/profile" />;
  }

  return children;
};

export default PublicRoute;
