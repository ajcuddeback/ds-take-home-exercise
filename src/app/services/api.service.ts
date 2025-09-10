import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, of, startWith, throwError} from 'rxjs';
import {ForecastResponse, WeatherDataToDisplay} from '../models/interfaces/weather-data.interface';

export type ApiResponse<T> =
  | { state: 'loading' }
  | { state: 'success'; data: T }
  | { state: 'error'; message: string };

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  get<T>(url: string): Observable<ApiResponse<T>> {
    return this.http.get<T>(url)
      .pipe(
        map(data => {
          return { state: 'success', data } as const;
        }),
        startWith({ state: 'loading' } as const),
        catchError(error => {
          console.error('Weather API failed', error);
          return of(
            { state: 'error', message: this.humanizeHttpError(error.message) } as const,
          )
        }),
      );
  }

  private humanizeHttpError(err: unknown): string {
    const e = err as { status?: number; message?: string; error?: unknown };
    if (typeof e?.status === 'number') {
      if (e.status === 0) return 'Network error. Check your connection.';
      if (e.status >= 500) return 'Server error. Please try again shortly.';
      if (e.status === 404) return 'No weather found for this location.';
      if (e.status === 401 || e.status === 403) return 'You are not authorized.';
      return `Request failed (${e.status}).`;
    }
    return 'Something went wrong.';
  }
}
