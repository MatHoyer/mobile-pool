export const weatherCodeToCondition = (code: number) => {
  const conditions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Mostly cloudy',
    45: 'Foggy',
    48: 'Foggy with frost',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Heavy drizzle',
    61: 'Light rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Light snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    80: 'Light thunderstorm',
    81: 'Moderate thunderstorm',
    82: 'Heavy thunderstorm',
  };

  return conditions[code as keyof typeof conditions] || 'Unknown condition';
};
