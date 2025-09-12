import {Injectable} from '@angular/core';
import {Observable, scan, shareReplay, startWith, Subject} from 'rxjs';
import {ForecastResponse, WeatherDataToDisplay} from '../models/interfaces/weather-data.interface';
import {ApiResponse, ApiService} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherDataService {
  private toggleIcon$: Subject<void> = new Subject<void>();

  readonly showIcon$: Observable<boolean> = this.toggleIcon$.asObservable().pipe(
    scan((acc) => !acc, false),
    startWith(false),
    shareReplay({ bufferSize: 1, refCount: true})
  );

  constructor(private apiService: ApiService) {}

  toggleIcon() {
    this.toggleIcon$.next();
  }

  fetchWeatherForecast(): Observable<ApiResponse<ForecastResponse>> {
    return this.apiService.get<ForecastResponse>("https://api.weather.gov/gridpoints/MLB/33,70/forecast");
  }

  formatData(weatherData: ForecastResponse): WeatherDataToDisplay {
    const today = new Date();
    const periodsToday = weatherData.properties.periods.filter(p => {
      const d = new Date(p.startTime);
      return d.getFullYear() === today.getFullYear()
        && d.getMonth() === today.getMonth()
        && d.getDate() === today.getDate();
    });

    const current =
      periodsToday.find(p => p.isDaytime) ?? periodsToday[0] ?? weatherData.properties.periods[0];

    if (!current) {
      return {
        dayName: new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(today),
        tempC: null,
        forecastExplanation: 'No data',
        icon: ''
      };
    }

    // TODO: Make this configurable - not default to Celsius. Maybe we want a user to change it as a preference
    const toC = (value: number, unit: string) =>
      unit.toUpperCase() === 'C' ? value : (value - 32) * (5 / 9);

    return {
      dayName: new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(new Date(current.startTime)),
      tempC: Math.round(toC(current.temperature, current.temperatureUnit) * 10) / 10,
      forecastExplanation: current.shortForecast,
      icon: current.icon
    };
  }
}
