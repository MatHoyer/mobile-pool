import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

const AppBar: React.FC<PropsWithChildren> = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

export default AppBar;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    flexDirection: "row",
    width: "100%",
    height: 50,
  },
});
