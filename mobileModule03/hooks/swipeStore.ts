import { create } from "zustand";

type SwipeStore = {
  isSwipeEnabled: boolean;
  setIsSwipeEnabled: (value: boolean) => void;
};

const useSwipeStore = create<SwipeStore>((set) => ({
  isSwipeEnabled: true,
  setIsSwipeEnabled: (value: boolean) => set({ isSwipeEnabled: value }),
}));

export default useSwipeStore;
