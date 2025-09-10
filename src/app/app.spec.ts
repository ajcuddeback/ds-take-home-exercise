import { TestBed } from '@angular/core/testing';
import { App } from './app';
import {MockComponents} from 'ng-mocks';
import {CurrentWeatherCard} from './components/current-weather-card/current-weather-card';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,
        MockComponents(CurrentWeatherCard)
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
