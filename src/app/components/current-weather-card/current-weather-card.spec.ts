import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentWeatherCard } from './current-weather-card';
import {MockProvider, MockService} from 'ng-mocks';
import {WeatherDataService} from '../../services/weather-data.service';
import {of} from 'rxjs';
import {mockWeatherData} from '../../mocks/weather-data.mock';

// TODO: Add tests
describe('CurrentWeatherCard', () => {
  let component: CurrentWeatherCard;
  let fixture: ComponentFixture<CurrentWeatherCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CurrentWeatherCard
      ],
      providers: [
        MockProvider(WeatherDataService, {
          fetchWeatherForecast: () => of({
            state: 'success',
            data: mockWeatherData
          })
        })
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentWeatherCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
