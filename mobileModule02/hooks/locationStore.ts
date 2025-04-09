import { create } from 'zustand';

export type TLocation = {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
};

export type TCurrentWeather = {
  temperature: number;
  windSpeed: number;
};

export type THourlyWeather = {
  hour: Date;
  temperature: number;
  windSpeed: number;
};

export type TDailyWeather = {
  day: Date;
  temperatureMax: number;
  temperatureMin: number;
  precipitationSum: number;
};

type LocationStore = {
  location: TLocation | null;
  setLocation: (location: TLocation | null) => void;
  currentWeather: TCurrentWeather | null;
  setCurrentWeather: (currentWeather: TCurrentWeather | null) => void;
  hourlyWeather: THourlyWeather[] | null;
  setHourlyWeather: (hourlyWeather: THourlyWeather[] | null) => void;
  dailyWeather: TDailyWeather[] | null;
  setDailyWeather: (dailyWeather: TDailyWeather[] | null) => void;
};

const useLocationStore = create<LocationStore>((set) => ({
  location: null,
  setLocation: (location: TLocation | null) => set({ location }),
  currentWeather: null,
  setCurrentWeather: (currentWeather: TCurrentWeather | null) => set({ currentWeather }),
  hourlyWeather: null,
  setHourlyWeather: (hourlyWeather: THourlyWeather[] | null) => set({ hourlyWeather }),
  dailyWeather: null,
  setDailyWeather: (dailyWeather: TDailyWeather[] | null) => set({ dailyWeather }),
}));

export default useLocationStore;
