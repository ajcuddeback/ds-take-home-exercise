import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { ApiService, ApiResponse } from './api.service';
import { mockWeatherData } from '../mocks/weather-data.mock';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  const URL = 'https://api.weather.gov/gridpoints/MLB/33,70/forecast';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();

    if ((console.error as any).calls) {
      (console.error as jasmine.Spy).and.callThrough();
    }
  });

  it('emits loading then success (happy path)', (done) => {
    const emissions: ApiResponse<typeof mockWeatherData>[] = [];

    service.get<typeof mockWeatherData>(URL).subscribe({
      next: v => emissions.push(v),
      error: () => done.fail('stream should not error'),
      complete: () => {
        expect(emissions).toEqual([
          { state: 'loading' },
          { state: 'success', data: mockWeatherData },
        ]);
        done();
      },
    });

    const req = httpMock.expectOne(URL);
    expect(req.request.method).toBe('GET');
    req.flush(mockWeatherData);
  });

  it('emits loading then error (500) and logs it', (done) => {
    const consoleSpy = spyOn(console, 'error');
    const emissions: ApiResponse<unknown>[] = [];

    service.get(URL).subscribe({
      next: v => emissions.push(v),
      error: () => done.fail('stream should not error'),
      complete: () => {
        expect(emissions.length).toBe(2);
        expect(emissions[0]).toEqual({ state: 'loading' });

        expect(emissions[1]).toEqual({
          state: 'error',
          message: 'Server error. Please try again shortly.',
        });

        expect(consoleSpy).toHaveBeenCalled();
        done();
      },
    });

    const req = httpMock.expectOne(URL);
    expect(req.request.method).toBe('GET');
    req.flush('Server exploded', { status: 500, statusText: 'Server Error' });
  });

  it('emits loading then error (0) and logs it', (done) => {
    const consoleSpy = spyOn(console, 'error');
    const emissions: ApiResponse<unknown>[] = [];

    service.get(URL).subscribe({
      next: v => emissions.push(v),
      error: () => done.fail('stream should not error'),
      complete: () => {
        expect(emissions.length).toBe(2);
        expect(emissions[0]).toEqual({ state: 'loading' });

        expect(emissions[1]).toEqual({
          state: 'error',
          message: 'Network error. Check your connection.',
        });

        expect(consoleSpy).toHaveBeenCalled();
        done();
      },
    });

    const req = httpMock.expectOne(URL);
    expect(req.request.method).toBe('GET');
    req.flush('Server exploded', { status: 0, statusText: 'Network error' });
  });

  it('emits loading then error (401) and logs it', (done) => {
    const consoleSpy = spyOn(console, 'error');
    const emissions: ApiResponse<unknown>[] = [];

    service.get(URL).subscribe({
      next: v => emissions.push(v),
      error: () => done.fail('stream should not error'),
      complete: () => {
        expect(emissions.length).toBe(2);
        expect(emissions[0]).toEqual({ state: 'loading' });

        expect(emissions[1]).toEqual({
          state: 'error',
          message: 'You are not authorized.',
        });

        expect(consoleSpy).toHaveBeenCalled();
        done();
      },
    });

    const req = httpMock.expectOne(URL);
    expect(req.request.method).toBe('GET');
    req.flush('Server exploded', { status: 401, statusText: 'Unauthorized' });
  });

  it('emits loading then error (403) and logs it', (done) => {
    const consoleSpy = spyOn(console, 'error');
    const emissions: ApiResponse<unknown>[] = [];

    service.get(URL).subscribe({
      next: v => emissions.push(v),
      error: () => done.fail('stream should not error'),
      complete: () => {
        expect(emissions.length).toBe(2);
        expect(emissions[0]).toEqual({ state: 'loading' });

        expect(emissions[1]).toEqual({
          state: 'error',
          message: 'You are not authorized.',
        });

        expect(consoleSpy).toHaveBeenCalled();
        done();
      },
    });

    const req = httpMock.expectOne(URL);
    expect(req.request.method).toBe('GET');
    req.flush('Server exploded', { status: 403, statusText: 'Forbidden' });
  });

  it('emits loading then error (404) and logs it', (done) => {
    const consoleSpy = spyOn(console, 'error');
    const emissions: ApiResponse<unknown>[] = [];

    service.get(URL).subscribe({
      next: v => emissions.push(v),
      error: () => done.fail('stream should not error'),
      complete: () => {
        expect(emissions.length).toBe(2);
        expect(emissions[0]).toEqual({ state: 'loading' });

        expect(emissions[1]).toEqual({
          state: 'error',
          message: 'No weather found for this location.',
        });

        expect(consoleSpy).toHaveBeenCalled();
        done();
      },
    });

    const req = httpMock.expectOne(URL);
    expect(req.request.method).toBe('GET');
    req.flush('Server exploded', { status: 404, statusText: 'Not Found' });
  });

  it('emits loading then error (400) and logs it', (done) => {
    const consoleSpy = spyOn(console, 'error');
    const emissions: ApiResponse<unknown>[] = [];

    service.get(URL).subscribe({
      next: v => emissions.push(v),
      error: () => done.fail('stream should not error'),
      complete: () => {
        expect(emissions.length).toBe(2);
        expect(emissions[0]).toEqual({ state: 'loading' });

        expect(emissions[1]).toEqual({
          state: 'error',
          message: 'Request failed (400).',
        });

        expect(consoleSpy).toHaveBeenCalled();
        done();
      },
    });

    const req = httpMock.expectOne(URL);
    expect(req.request.method).toBe('GET');
    req.flush('Server exploded', { status: 400, statusText: 'Bad Request' });
  });
});
