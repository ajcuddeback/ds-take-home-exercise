import { ComponentFixture, TestBed } from '@angular/core/testing';
import {of, take} from 'rxjs';

import { CurrentWeatherCard } from './current-weather-card';
import { WeatherDataService } from '../../services/weather-data.service';
import { ApiResponse } from '../../services/api.service';
import { ForecastResponse, WeatherDataToDisplay } from '../../models/interfaces/weather-data.interface';
import { mockWeatherData } from '../../mocks/weather-data.mock';

describe('CurrentWeatherCard', () => {
  let fixture: ComponentFixture<CurrentWeatherCard>;
  let component: CurrentWeatherCard;
  let svc: jasmine.SpyObj<WeatherDataService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('WeatherDataService', ['fetchWeatherForecast']);

    await TestBed.configureTestingModule({
      imports: [CurrentWeatherCard],
      providers: [{ provide: WeatherDataService, useValue: spy }],
    }).compileComponents();

    svc = TestBed.inject(WeatherDataService) as jasmine.SpyObj<WeatherDataService>;
  });

  function create() {
    fixture = TestBed.createComponent(CurrentWeatherCard);
    component = fixture.componentInstance;
  }

  it('should create', () => {
    svc.fetchWeatherForecast.and.returnValue(of({ state: 'success', data: mockWeatherData }));
    create();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('showIcon$ starts false and toggles to true when toggleIcon$.next() is fired', (done) => {
    svc.fetchWeatherForecast.and.returnValue(of({ state: 'success', data: mockWeatherData }));
    create();
    fixture.detectChanges();

    const values: boolean[] = [];
    component.showIcon$
      .pipe(take(2)).subscribe((v) => {
      values.push(v);
      if (values.length === 2) {
        expect(values).toEqual([false, true]);
        done();
      }
    });

    component.toggleIcon$.next();
  });

  it('passes through loading state unchanged', (done) => {
    const loading: ApiResponse<ForecastResponse> = { state: 'loading' };
    svc.fetchWeatherForecast.and.returnValue(of(loading));
    create();
    fixture.detectChanges();

    component.weatherData$!.subscribe((v) => {
      expect(v).toEqual(loading as ApiResponse<WeatherDataToDisplay>);
      done();
    });
  });

  it('passes through error state unchanged', (done) => {
    const error: ApiResponse<ForecastResponse> = { state: 'error', message: 'Server Error' };
    svc.fetchWeatherForecast.and.returnValue(of(error));
    create();
    fixture.detectChanges();

    component.weatherData$!.subscribe((v) => {
      expect(v).toEqual(error as ApiResponse<WeatherDataToDisplay>);
      done();
    });
  });

  it('formatData converts °F to °C (1 decimal) and returns expected fields', () => {
    create();
    // Build a minimal ForecastResponse for "today"
    const todayIso = new Date().toISOString();
    const fr: ForecastResponse = {
      properties: {
        periods: [
          {
            startTime: todayIso,
            isDaytime: true,
            temperature: 77,
            temperatureUnit: 'F',
            shortForecast: 'Sunny',
            icon: 'icon.png',
          },
        ],
      },
    } as any;

    const result = component.formatData(fr);
    expect(result.forecastExplanation).toBe('Sunny');
    // 77°F -> 25.0°C, rounded to 1 decimal
    expect(result.tempC).toBe(25);
    expect(typeof result.dayName).toBe('string');
    expect(result.icon).toBe('icon.png');
  });

  it('formatData returns "No data" shape when there are no periods', () => {
    create();
    const fr: ForecastResponse = { properties: { periods: [] } } as any;

    const result = component.formatData(fr);
    expect(result).toEqual(
      jasmine.objectContaining({
        forecastExplanation: 'No data',
        tempC: null,
        icon: '',
      })
    );
    expect(typeof result.dayName).toBe('string');
  });

  it('formatData leaves °C values unchanged', () => {
    create();
    const todayIso = new Date().toISOString();
    const fr: ForecastResponse = {
      properties: {
        periods: [
          {
            startTime: todayIso,
            isDaytime: true,
            temperature: 10,
            temperatureUnit: 'C',
            shortForecast: 'Cloudy',
            icon: 'icon.png',
          },
        ],
      },
    } as any;

    const result = component.formatData(fr);
    expect(result.tempC).toBe(10);
  });
});
