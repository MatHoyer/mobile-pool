import { create } from "zustand";

export type TLocation = {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
};

type LocationStore = {
  location: TLocation | null;
  setLocation: (location: TLocation | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
};

const useLocationStore = create<LocationStore>((set) => ({
  location: null,
  setLocation: (location: TLocation | null) => set({ location, error: null }),
  error: null,
  setError: (error: string | null) => set({ location: null, error }),
}));

export default useLocationStore;
