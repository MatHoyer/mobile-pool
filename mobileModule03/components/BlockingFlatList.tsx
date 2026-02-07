import useSwipeStore from "@/hooks/swipeStore";
import { FlatList } from "react-native";

type TBlockingFlatListProps<T> = React.ComponentProps<typeof FlatList<T>>;

export const BlockingFlatList = <T,>(props: TBlockingFlatListProps<T>) => {
  const setIsSwipeEnabled = useSwipeStore((state) => state.setIsSwipeEnabled);

  return (
    <FlatList onTouchStart={() => setIsSwipeEnabled(false)} onTouchEnd={() => setIsSwipeEnabled(true)} {...props} />
  );
};
