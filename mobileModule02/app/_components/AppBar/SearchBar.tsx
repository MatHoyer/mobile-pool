import Button from "@/components/Button";
import Input from "@/components/Input";
import Typography from "@/components/Typography";
import useLocationStore, { TLocation } from "@/hooks/locationStore";
import { Search } from "lucide-react-native";
import { ComponentProps, useCallback, useEffect, useRef, useState } from "react";
import { FlatList, TextInput, View } from "react-native";

const LocationSuggestions: React.FC<
  {
    suggestions: TLocation[];
    touchingSuggestionRef: React.RefObject<boolean>;
    setIsFocused: (isFocused: boolean) => void;
    setSelectedLocation: (location: TLocation) => void;
  } & ComponentProps<typeof View>
> = ({ suggestions, touchingSuggestionRef, setIsFocused, setSelectedLocation, style, ...props }) => {
  const handleTouchStart = () => {
    touchingSuggestionRef.current = true;
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      touchingSuggestionRef.current = false;
    }, 300);
  };

  return (
    <View
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={[
        style,
        {
          position: "absolute",
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "#ccc",
          zIndex: 999,
          maxHeight: 200,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        },
      ]}
      {...props}
    >
      <FlatList
        data={suggestions}
        renderItem={({ item }) => (
          <Button
            variant="ghost"
            style={{ display: "flex", flexDirection: "row", alignItems: "baseline", height: 50, gap: 10 }}
            onPress={() => {
              setSelectedLocation(item);
              setIsFocused(false);
            }}
          >
            <Typography>{item.name}</Typography>
            <Typography variant="muted">{item.region}</Typography>
            <Typography variant="muted">{item.country}</Typography>
          </Button>
        )}
        keyExtractor={(_, index) => "" + index}
      />
    </View>
  );
};

export const SearchBar = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [suggestions, setSuggestions] = useState<TLocation[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [inputPosition, setInputPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const searchRef = useRef<TextInput>(null);
  const touchingSuggestionRef = useRef(false);
  const location = useLocationStore((state) => state.location);
  const setLocation = useLocationStore((state) => state.setLocation);
  const setError = useLocationStore((state) => state.setError);

  const fetchSuggestions = useCallback(async () => {
    const resultSuggestions = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        searchLocation
      )}&count=5&language=fr&format=json`
    );
    if (!resultSuggestions.ok) {
      setError("The service connection is lost, please check your internet connection or try again later");
      return;
    }

    const jsonData = (await resultSuggestions.json()) as {
      results: { name: string; admin1: string; country: string; latitude: number; longitude: number }[];
    };
    if (!jsonData?.results) {
      setError("Could not find any result for the supplied adress or coordinates");
      setSuggestions([]);
      return;
    }

    const data = jsonData.results
      .map((item) => ({
        name: item.name,
        region: item.admin1,
        country: item.country,
        lat: item.latitude,
        lon: item.longitude,
      }))
      .filter((s) => s.name || s.region || s.country);

    setSuggestions(data);
  }, [searchLocation, setError]);

  useEffect(() => {
    if (searchLocation.length === 0) return;

    const fetchTimeout = setTimeout(() => {
      fetchSuggestions();
    }, 150);

    return () => clearTimeout(fetchTimeout);
  }, [searchLocation, fetchSuggestions]);

  useEffect(() => {
    searchRef.current?.measureInWindow((x, y, width, height) => {
      setInputPosition({ x, y, width, height });
    });
  }, [searchRef, isFocused]);

  return (
    <>
      <Search color="black" />
      <Input
        placeholder="Search"
        style={{
          flex: 1,
          borderBottomLeftRadius: isFocused && suggestions.length > 0 ? 0 : 8,
          borderBottomRightRadius: isFocused && suggestions.length > 0 ? 0 : 8,
        }}
        onChangeText={setSearchLocation}
        value={searchLocation}
        inputRef={searchRef}
        onBlur={() => {
          if (touchingSuggestionRef.current) return;

          setTimeout(() => {
            setIsFocused(false);
          }, 200);

          if (suggestions.length > 0) {
            const suggestion = suggestions[0];
            setLocation({
              name: suggestion.name,
              region: suggestion.region,
              country: suggestion.country,
              lat: suggestion.lat,
              lon: suggestion.lon,
            });
            return;
          }

          setError("Could not find any result for the supplied adress or coordinates");
          setLocation(null);
        }}
        onFocus={() => setIsFocused(true)}
      />
      <LocationSuggestions
        suggestions={suggestions}
        style={{
          display: isFocused && suggestions.length > 0 ? "flex" : "none",
          top: inputPosition.y + inputPosition.height,
          left: inputPosition.x,
          width: inputPosition.width,
        }}
        touchingSuggestionRef={touchingSuggestionRef}
        setIsFocused={setIsFocused}
        setSelectedLocation={(location) => {
          setLocation(location);
          setSearchLocation(location.name);
        }}
      />
    </>
  );
};
