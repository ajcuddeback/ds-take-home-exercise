import {Component} from '@angular/core';
import {CurrentWeatherCard} from './components/current-weather-card/current-weather-card';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    CurrentWeatherCard
  ],
  styleUrl: './app.scss'
})
export class App {

}
