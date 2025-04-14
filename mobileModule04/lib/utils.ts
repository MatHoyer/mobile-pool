import { format, formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudRain,
  CloudSnow,
  CloudSun,
  HelpCircle,
  Sun,
  Zap,
} from 'lucide-react-native';

export const weatherCodeToCondition = (code: number) => {
  const conditions = {
    0: { label: 'Clear sky', icon: Sun },
    1: { label: 'Mainly clear', icon: CloudSun },
    2: { label: 'Partly cloudy', icon: CloudSun },
    3: { label: 'Mostly cloudy', icon: Cloud },
    45: { label: 'Foggy', icon: CloudFog },
    48: { label: 'Foggy with frost', icon: CloudFog },
    51: { label: 'Light drizzle', icon: CloudDrizzle },
    53: { label: 'Moderate drizzle', icon: CloudDrizzle },
    55: { label: 'Heavy drizzle', icon: CloudDrizzle },
    61: { label: 'Light rain', icon: CloudRain },
    63: { label: 'Moderate rain', icon: CloudRain },
    65: { label: 'Heavy rain', icon: CloudRain },
    71: { label: 'Light snow', icon: CloudSnow },
    73: { label: 'Moderate snow', icon: CloudSnow },
    75: { label: 'Heavy snow', icon: CloudSnow },
    80: { label: 'Light thunderstorm', icon: Zap },
    81: { label: 'Moderate thunderstorm', icon: Zap },
    82: { label: 'Heavy thunderstorm', icon: Zap },
  };

  return (
    conditions[code as keyof typeof conditions] || {
      label: 'Unknown condition',
      icon: HelpCircle,
    }
  );
};

export const DateFormats = {
  DAY: 'dd',
  DAY_IN_LETTER: 'EEEE',
  MONTH: 'MM',
  MONTH_IN_LETTER: 'MMMM',
  YEAR: 'yyyy',
  HOUR: 'HH',
  MINUTE: 'mm',
  SECOND: 'ss',

  SHORT: 'LLL dd, y',

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
    return type.map((t) => format(date, DateFormats[t], { locale: enUS })).join(separator || ' ');
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
