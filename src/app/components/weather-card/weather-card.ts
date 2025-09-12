import {Component, Input} from '@angular/core';
import {AsyncPipe, NgOptimizedImage} from '@angular/common';
import {WeatherDataToDisplay} from '../../models/interfaces/weather-data.interface';
import {WeatherDataService} from '../../services/weather-data.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-weather-card',
  imports: [
    AsyncPipe,
    NgOptimizedImage
  ],
  templateUrl: './weather-card.html',
  styleUrl: './weather-card.scss'
})
export class WeatherCard {
  @Input() public weatherData: WeatherDataToDisplay | undefined;
  showIcon$: Observable<boolean>;

  constructor(private weatherDataService: WeatherDataService) {
    this.showIcon$ = this.weatherDataService.showIcon$;
  }
}
