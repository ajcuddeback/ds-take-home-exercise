import {Component, OnInit} from '@angular/core';
import {Observable, shareReplay} from 'rxjs';
import {ApiResponse} from '../../services/api.service';
import {ForecastResponse} from '../../models/interfaces/weather-data.interface';
import {WeatherDataService} from '../../services/weather-data.service';
import {CurrentWeatherCard} from '../current-weather-card/current-weather-card';
import {AsyncPipe} from '@angular/common';
import {MatSlideToggle} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-home',
  imports: [
    CurrentWeatherCard,
    AsyncPipe,
    MatSlideToggle
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  showIcon$: Observable<boolean>;
  weatherData$: Observable<ApiResponse<ForecastResponse>> | undefined;

  constructor(private weatherDataService: WeatherDataService) {
    this.showIcon$ = this.weatherDataService.showIcon$;
  }

  ngOnInit() {
    this.weatherData$ = this.weatherDataService.fetchWeatherForecast().pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  toggleIcon() {
    this.weatherDataService.toggleIcon();
  }
}
