import {Component, OnInit} from '@angular/core';
import {map, Observable, scan, shareReplay, startWith, Subject} from 'rxjs';
import {ForecastResponse, WeatherDataToDisplay} from '../../models/interfaces/weather-data.interface';
import {WeatherDataService} from '../../services/weather-data.service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-current-weather-card',
  imports: [
    AsyncPipe
  ],
  templateUrl: './current-weather-card.html',
  styleUrl: './current-weather-card.scss'
})
export class CurrentWeatherCard implements OnInit {
  weatherData$: Observable<WeatherDataToDisplay> | undefined;
  readonly toggleIcon$: Subject<void> = new Subject<void>();

  readonly showIcon$: Observable<boolean> = this.toggleIcon$.pipe(
    scan((acc) => !acc, false),
    startWith(false),
    shareReplay({ bufferSize: 1, refCount: true})
  )

  constructor(private weatherDataService: WeatherDataService) {
  }

  ngOnInit() {
    this.weatherData$ = this.weatherDataService.fetchWeatherData().pipe(
      map((weatherData: ForecastResponse) => {
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

        const toC = (value: number, unit: string) =>
          unit.toUpperCase() === 'C' ? value : (value - 32) * (5 / 9);

        return {
          dayName: new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(new Date(current.startTime)),
          tempC: Math.round(toC(current.temperature, current.temperatureUnit) * 10) / 10,
          forecastExplanation: current.shortForecast,
          icon: current.icon
        };
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }
}
