import { TestBed } from '@angular/core/testing';
import {of, take} from 'rxjs';

import { WeatherDataService } from './weather-data.service';
import { ApiService, ApiResponse } from './api.service';
import { ForecastResponse, WeatherDataToDisplay } from '../models/interfaces/weather-data.interface';

describe('WeatherDataService', () => {
  let service: WeatherDataService;
  let api: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    api = jasmine.createSpyObj<ApiService>('ApiService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        WeatherDataService,
        { provide: ApiService, useValue: api },
      ],
    });

    service = TestBed.inject(WeatherDataService);
  });

  it('showIcon$ starts at false and toggles with toggleIcon()', (done) => {
    const seen: boolean[] = [];
    service.showIcon$.pipe(take(3)).subscribe((data) => {
      seen.push(data);
      if (seen.length === 3) {
        expect(seen).toEqual([false, true, false]);
        done();
      }
    });

    service.toggleIcon();
    service.toggleIcon();
  });

  it('showIcon$ replays last value to late subscribers', () => {
    // Creating longer lived initial subscription because of the use of refCount
    const sub = service.showIcon$.subscribe();

    // Advance it to true
    service.toggleIcon();

    const late: boolean[] = [];
    service.showIcon$.pipe(take(1)).subscribe(data => late.push(data));
    expect(late).toEqual([true]); // last value replayed
    sub.unsubscribe();
  });

  it('fetchWeatherForecast forwards error states (no throw)', (done) => {
    api.get.and.returnValue(of<ApiResponse<ForecastResponse>>({ state: 'error', message: 'boom' }));

    service.fetchWeatherForecast().subscribe((data) => {
      expect(data).toEqual({ state: 'error', message: 'boom' });
      done();
    });
  });

  it('formatData converts °F to °C (rounded to 1 decimal) and maps fields', () => {
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

    const result: WeatherDataToDisplay = service.formatData(fr);

    expect(result.forecastExplanation).toBe('Sunny');
    expect(result.icon).toBe('icon.png');
    expect(result.tempC).toBe(25);
    expect(typeof result.dayName).toBe('string');
  });

  it('formatData leaves °C values unchanged', () => {
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
            icon: 'i.png',
          },
        ],
      },
    } as any;

    const result = service.formatData(fr);
    expect(result.tempC).toBe(10);
    expect(result.forecastExplanation).toBe('Cloudy');
  });

  it('formatData returns "No data" object when there are no periods', () => {
    const fr: ForecastResponse = { properties: { periods: [] } } as any;

    const result = service.formatData(fr);
    expect(result).toEqual(
      jasmine.objectContaining({
        forecastExplanation: 'No data',
        tempC: null,
        icon: '',
      })
    );
    expect(typeof result.dayName).toBe('string');
  });

  it('formatData falls back to first overall period when there are no periods for today', () => {
    // Build a "yesterday" period only; code should fall back to periods[0]
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const fr: ForecastResponse = {
      properties: {
        periods: [
          {
            startTime: yesterday,
            isDaytime: true,
            temperature: 68,
            temperatureUnit: 'F',
            shortForecast: 'Windy',
            icon: 'wind.png',
          },
        ],
      },
    } as any;

    const result = service.formatData(fr);
    expect(result.forecastExplanation).toBe('Windy');
    expect(result.tempC).toBe(20);
    expect(result.icon).toBe('wind.png');
  });
});
