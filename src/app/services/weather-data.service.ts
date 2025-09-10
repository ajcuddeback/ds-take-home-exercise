import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ForecastResponse} from '../models/interfaces/weather-data.interface';
import {ApiResponse, ApiService} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherDataService {
  constructor(private apiService: ApiService) {}

  fetchWeatherData(): Observable<ApiResponse<ForecastResponse>> {
    return this.apiService.get<ForecastResponse>("https://api.weather.gov/gridpoints/MLB/33,70/forecast");
  }
}
