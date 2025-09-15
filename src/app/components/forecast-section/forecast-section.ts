import {Component, Input, OnInit} from '@angular/core';
import {async, map, Observable} from 'rxjs';
import {ApiResponse} from '../../services/api.service';
import {ForecastPeriod, ForecastResponse, WeatherDataToDisplay} from '../../models/interfaces/weather-data.interface';
import {AsyncPipe} from '@angular/common';
import {WeatherCard} from '../weather-card/weather-card';

@Component({
  selector: 'app-forecast-section',
  imports: [
    AsyncPipe,
    WeatherCard
  ],
  templateUrl: './forecast-section.html',
  styleUrl: './forecast-section.scss'
})
export class ForecastSection implements OnInit {
  @Input() weatherData$: Observable<ApiResponse<ForecastResponse>> | undefined;
  @Input() forecastDataResponse$: Observable<ApiResponse<WeatherDataToDisplay[]>> | undefined;

  ngOnInit(): void {
    this.forecastDataResponse$ = this.weatherData$?.pipe(
      map(apiResponse => {
        if (apiResponse.state === 'success') {
          return {
            ...apiResponse,
            data: this.getForecastDayForecastDataPoints(apiResponse.data.properties.periods)
          }
        }

        return apiResponse;
      })
    );
  }

  getForecastDayForecastDataPoints(forecastData: ForecastPeriod[]) {
    const today = new Date();
    const futureForecast = forecastData.filter(p => {
      const d = new Date(p.startTime);
      return (d.getFullYear() !== today.getFullYear()
        || d.getMonth() !== today.getMonth()
        || d.getDate() !== today.getDate()) &&
        p.isDaytime
    });

    const formattedFutureForecast : WeatherDataToDisplay[] = futureForecast.map(day => {
      const toC = (value: number, unit: string) =>
        unit.toUpperCase() === 'C' ? value : (value - 32) * (5 / 9);

      return {
        dayName: new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(new Date(day.startTime)),
        tempC: Math.round(toC(day.temperature, day.temperatureUnit) * 10) / 10,
        forecastExplanation: day.shortForecast,
        icon: day.icon
      };
    });

    return formattedFutureForecast;
  }

  protected readonly async = async;
}
