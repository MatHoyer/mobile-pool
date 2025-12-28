import { styles } from "@/assets/styles";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AppLoader from "../app/AppLoader";

const AuthContext = createContext<{ user: User | null }>({ user: null });

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <>
        <SafeAreaView style={styles.container}>
          <AppLoader />
        </SafeAreaView>
      </>
    );
  }

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
