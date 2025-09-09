import { TestBed } from '@angular/core/testing';

import { WeatherDataService } from './weather-data.service';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {mockWeatherData} from '../mocks/weather-data.mock';
import {provideHttpClient} from '@angular/common/http';

describe('WeatherDataService', () => {
  let service: WeatherDataService;
  let httpMock: HttpTestingController;
  const URL = 'https://api.weather.gov/gridpoints/MLB/33,70/forecast';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(WeatherDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // ensure no outstanding requests
    // Restore console spies (if any)
    if ((console.error as any).calls) {
      (console.error as jasmine.Spy).and.callThrough();
    }
  });


  it('should GET forecast and return data (happy path)', (done) => {
    service.fetchWeatherData().subscribe({
      next: (data) => {
        expect(data).toEqual(mockWeatherData);
        done();
      },
      error: done.fail,
    });

    const req = httpMock.expectOne(URL);
    expect(req.request.method).toBe('GET');
    req.flush(mockWeatherData);
  });

  it('should propagate error via throwError and log it', (done) => {
    const consoleSpy = spyOn(console, 'error');

    service.fetchWeatherData().subscribe({
      next: () => done.fail('Expected an error, but got next()'),
      error: (err: Error) => {
        // The service rethrows a new Error based on HttpErrorResponse.message
        expect(err).toBeTruthy();
        expect(err.message).toContain('Http failure response');
        expect(consoleSpy).toHaveBeenCalled(); // logged by catchError
        done();
      },
    });

    const req = httpMock.expectOne(URL);
    expect(req.request.method).toBe('GET');

    // Simulate a 500 from the backend
    req.flush('Server exploded', {
      status: 500,
      statusText: 'Server Error',
    });
  });
});
