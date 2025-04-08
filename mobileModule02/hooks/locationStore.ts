import { create } from 'zustand';

type LocationStore = {
  location: string | null;
  setLocation: (location: string | null) => void;
};

const useLocationStore = create<LocationStore>((set) => ({
  location: null,
  setLocation: (location: string | null) => set({ location }),
}));

export default useLocationStore;
