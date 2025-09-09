import {ForecastResponse} from '../models/interfaces/weather-data.interface';

export const mockWeatherData: ForecastResponse = {
  '@context': [
    'https://geojson.org/geojson-ld/geojson-context.jsonld',
    {
      '@version': '1.1',
      wx: 'https://api.weather.gov/ontology#',
      geo: 'http://www.opengis.net/ont/geosparql#',
      unit: 'http://codes.wmo.int/common/unit/',
      '@vocab': 'https://api.weather.gov/ontology#',
    },
  ],
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [[[ -81.18, 28.55 ], [ -81.18, 28.57 ], [ -81.20, 28.57 ], [ -81.20, 28.55 ], [ -81.18, 28.55 ]]],
  },
  properties: {
    units: 'us',
    forecastGenerator: 'BaselineForecastGenerator',
    generatedAt: '2025-09-09T21:14:39+00:00',
    updateTime: '2025-09-09T20:14:59+00:00',
    validTimes: '2025-09-09T14:00:00+00:00/P7DT23H',
    elevation: { unitCode: 'wmoUnit:m', value: 22 },
    periods: [
      {
        number: 1,
        name: 'This Afternoon',
        startTime: '2025-09-09T17:00:00-04:00',
        endTime: '2025-09-09T18:00:00-04:00',
        isDaytime: true,
        temperature: 86,
        temperatureUnit: 'F',
        temperatureTrend: '',
        probabilityOfPrecipitation: { unitCode: 'wmoUnit:percent', value: 80 },
        windSpeed: '10 mph',
        windDirection: 'NE',
        icon: 'https://api.weather.gov/icons/land/day/tsra,80?size=medium',
        shortForecast: 'Showers And Thunderstorms',
        detailedForecast: '…',
      },
    ],
  },
};
