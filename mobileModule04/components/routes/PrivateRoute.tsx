import { Redirect } from "expo-router";
import { PropsWithChildren } from "react";
import { useAuth } from "../providers/auth.provider";

const PrivateRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/" />;
  }

  return children;
};

export default PrivateRoute;
