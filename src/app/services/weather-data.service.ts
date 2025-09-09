import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {ForecastResponse} from '../models/interfaces/weather-data.interface';

@Injectable({
  providedIn: 'root'
})
export class WeatherDataService {
  constructor(private http: HttpClient) {}

  fetchWeatherData(): Observable<ForecastResponse> {
    return this.http.get<ForecastResponse>("https://api.weather.gov/gridpoints/MLB/33,70/forecast")
      .pipe(
        catchError(error => {
          console.error('Weather API failed', error);
          return throwError(() => new Error(error.message ?? 'Unknown error'));
        }),
      );
  }
}
