import { styles } from "@/assets/styles";
import Typography from "@/components/Typography";
import useLocationStore from "@/hooks/locationStore";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TodayTab = () => {
  const location = useLocationStore((state) => state.location);

  if (!location) {
    return (
      <SafeAreaView style={styles.container}>
        <Typography variant="large" style={{ color: "red", textAlign: "center" }}>
          Geolocation is not available, please enable it in your settings.
        </Typography>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Typography variant="large">Today</Typography>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        {!!location.name && <Typography>{location.name}</Typography>}
        {!!location.region && <Typography>{location.region}</Typography>}
        {!!location.country && <Typography>{location.country}</Typography>}
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Typography>{location.lat}</Typography>
        <Typography>{location.lon}</Typography>
      </View>
    </SafeAreaView>
  );
};

export default TodayTab;
