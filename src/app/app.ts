import {Component} from '@angular/core';
import {CurrentWeatherCard} from './components/current-weather-card/current-weather-card';
import {Home} from './components/home/home';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    Home
  ],
  styleUrl: './app.scss'
})
export class App {

}
