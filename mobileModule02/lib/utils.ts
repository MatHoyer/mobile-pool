import { format, formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";

export const weatherCodeToCondition = (code: number) => {
  const conditions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Mostly cloudy",
    45: "Foggy",
    48: "Foggy with frost",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Heavy drizzle",
    61: "Light rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Light snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Light thunderstorm",
    81: "Moderate thunderstorm",
    82: "Heavy thunderstorm",
  };

  return conditions[code as keyof typeof conditions] || "Unknown condition";
};

export const DateFormats = {
  DAY: "dd",
  DAY_IN_LETTER: "EEEE",
  MONTH: "MM",
  MONTH_IN_LETTER: "MMMM",
  YEAR: "yyyy",
  HOUR: "HH",
  MINUTE: "mm",
  SECOND: "ss",

  SHORT: "LLL dd, y",

  get FULL() {
    return `${this.DAY_IN_LETTER} ${this.DAY} ${this.MONTH_IN_LETTER} ${this.YEAR} ${this.HOUR}:${this.MINUTE}:${this.SECOND}`;
  },
  get LONG_DATE_WITH_HOUR() {
    return `${this.DAY_IN_LETTER} ${this.DAY} ${this.MONTH_IN_LETTER} ${this.YEAR} at ${this.HOUR}:${this.MINUTE}`;
  },
  get SHORT_DATE_WITH_HOUR() {
    return `${this.DAY}/${this.MONTH}/${this.YEAR} at ${this.HOUR}:${this.MINUTE}`;
  },
};

type TDateFormatsKeys = keyof typeof DateFormats;
type TDateFormatsParams = {
  date: Date;
} & (
  | {
      type: TDateFormatsKeys;
      separator?: never;
    }
  | {
      type: TDateFormatsKeys[];
      separator?: string;
    }
);

export const getDateAsString = ({ date, type, separator }: TDateFormatsParams) => {
  if (Array.isArray(type)) {
    return type.map((t) => format(date, DateFormats[t], { locale: enUS })).join(separator || " ");
  }
  return format(date, DateFormats[type], { locale: enUS });
};

export const getNearDate = (date: Date) => {
  return formatDistanceToNow(date, {
    locale: enUS,
    addSuffix: true,
    includeSeconds: true,
  });
};
