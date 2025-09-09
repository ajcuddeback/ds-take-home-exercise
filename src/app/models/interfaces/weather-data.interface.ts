// -- JSON-LD context --
export type JsonLdContext = string | Record<string, unknown>;

// -- Full Forecast --
export interface ForecastFeature {
  "@context": JsonLdContext[];
  type: "Feature";
  geometry: PolygonGeometry;
  properties: ForecastProperties;
}

// -- GeoJSON --
export interface PolygonGeometry {
  type: "Polygon";
  coordinates: number[][][]; // [ [ [lng, lat], ... ] , ... ]
}

// -- Properties --
export interface ForecastProperties {
  units: "us" | string;
  forecastGenerator: string;
  generatedAt: string;
  updateTime: string;
  validTimes: string;
  elevation: QuantifiedValue;
  periods: ForecastPeriod[];
}

export interface QuantifiedValue {
  unitCode: string;
  value: number | null;
}

export type TemperatureUnit = "F" | "C";

export interface ForecastPeriod {
  number: number; // Cardinal Number
  name: string; // Name of period - Day of week and time
  startTime: string;
  endTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: TemperatureUnit;
  temperatureTrend?: "" | "rising" | "falling" | null;
  probabilityOfPrecipitation?: QuantifiedValue;
  windSpeed: string;
  windDirection: string;
  icon: string;
  shortForecast: string;
  detailedForecast: string;
}

export type ForecastResponse = ForecastFeature;
