import { create } from 'zustand';

type LocationStore = {
  location: string;
  setLocation: (location: string) => void;
};

const useLocationStore = create<LocationStore>((set) => ({
  location: '',
  setLocation: (location: string) => set({ location }),
}));

export default useLocationStore;
