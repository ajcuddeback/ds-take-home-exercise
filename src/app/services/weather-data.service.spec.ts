import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { WeatherDataService } from './weather-data.service';
import { ApiResponse } from './api.service';
import { ForecastResponse } from '../models/interfaces/weather-data.interface';
import { mockWeatherData } from '../mocks/weather-data.mock';

describe('WeatherDataService', () => {
  let service: WeatherDataService;
  let httpMock: HttpTestingController;

  const URL = 'https://api.weather.gov/gridpoints/MLB/33,70/forecast';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(WeatherDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('emits loading then success with forecast data', (done) => {
    const emissions: ApiResponse<ForecastResponse>[] = [];

    service.fetchWeatherForecast().subscribe({
      next: v => emissions.push(v),
      error: () => done.fail('stream should not error'),
      complete: () => {
        expect(emissions).toEqual([
          { state: 'loading' },
          { state: 'success', data: mockWeatherData as ForecastResponse },
        ]);
        done();
      },
    });

    const req = httpMock.expectOne(URL);
    expect(req.request.method).toBe('GET');
    req.flush(mockWeatherData);
  });

  it('emits loading then error', (done) => {
    const emissions: ApiResponse<ForecastResponse>[] = [];

    service.fetchWeatherForecast().subscribe({
      next: v => emissions.push(v),
      error: () => done.fail('stream should not error'),
      complete: () => {
        expect(emissions[0]).toEqual({ state: 'loading' });

        expect(emissions[1]).toEqual({
          state: 'error',
          message: 'Server error. Please try again shortly.',
        });

        done();
      },
    });

    const req = httpMock.expectOne(URL);
    expect(req.request.method).toBe('GET');
    req.flush('Server exploded', { status: 500, statusText: 'Server Error' });
  });
});
