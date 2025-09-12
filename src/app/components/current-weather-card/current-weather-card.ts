import {Component, Input, OnInit} from '@angular/core';
import {map, Observable} from 'rxjs';
import {ForecastResponse, WeatherDataToDisplay} from '../../models/interfaces/weather-data.interface';
import {AsyncPipe} from '@angular/common';
import {ApiResponse} from '../../services/api.service';
import {WeatherCard} from '../weather-card/weather-card';
import {WeatherDataService} from '../../services/weather-data.service';

@Component({
  selector: 'app-current-weather-card',
  imports: [
    AsyncPipe,
    WeatherCard
  ],
  templateUrl: './current-weather-card.html',
  styleUrl: './current-weather-card.scss'
})
export class CurrentWeatherCard implements OnInit {
  @Input() weatherData$: Observable<ApiResponse<ForecastResponse>> | undefined;
  todayWeatherData$: Observable<ApiResponse<WeatherDataToDisplay>> | undefined;


  constructor(private weatherDataService: WeatherDataService) { }

  ngOnInit() {
    if (this.weatherData$) {
      this.todayWeatherData$ = this.weatherData$.pipe(
        map((apiResponse: ApiResponse<ForecastResponse>) => {
          switch (apiResponse.state) {
            case 'success':
              return {
                ...apiResponse,
                data: this.weatherDataService.formatData(apiResponse.data)
              }
            default:
              return apiResponse;
          }
        }),
      )
    }
  }
}
