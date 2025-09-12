import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { Home } from './home';
import { WeatherDataService } from '../../services/weather-data.service';
import { ApiResponse } from '../../services/api.service';
import { ForecastResponse } from '../../models/interfaces/weather-data.interface';
import { mockWeatherData } from '../../mocks/weather-data.mock';

describe('Home', () => {
  let fixture: ComponentFixture<Home>;
  let component: Home;

  let showIconSubject: Subject<boolean>;
  let mockWeatherDataService: {
    fetchWeatherForecast: jasmine.Spy<() => any>;
    toggleIcon: jasmine.Spy<() => void>;
    showIcon$: Subject<boolean>;
  };

  beforeEach(async () => {
    showIconSubject = new Subject<boolean>();
    mockWeatherDataService = {
      fetchWeatherForecast: jasmine.createSpy('fetchWeatherForecast'),
      toggleIcon: jasmine.createSpy('toggleIcon'),
      showIcon$: showIconSubject,
    };

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [{ provide: WeatherDataService, useValue: mockWeatherDataService }],
    })
      .overrideComponent(Home, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
  });

  it('exposes WeatherDataService.showIcon$ as showIcon$', (done) => {
    mockWeatherDataService.fetchWeatherForecast.and.returnValue(
      of<ApiResponse<ForecastResponse>>({ state: 'success', data: mockWeatherData as ForecastResponse })
    );
    fixture.detectChanges();

    const received: boolean[] = [];
    const sub = component.showIcon$.subscribe((data) => {
      received.push(data);
      if (received.length === 2) {
        expect(received).toEqual([true, false]);
        sub.unsubscribe();
        done();
      }
    });

    showIconSubject.next(true);
    showIconSubject.next(false);
  });

  it('wires weatherData$ from service on init', (done) => {
    const seq$ = of<ApiResponse<ForecastResponse>[]>(
      { state: 'loading' },
      { state: 'success', data: mockWeatherData as ForecastResponse }
    );
    mockWeatherDataService.fetchWeatherForecast.and.returnValue(seq$);

    fixture.detectChanges(); // ngOnInit sets weatherData$

    const emissions: ApiResponse<ForecastResponse>[] = [];
    component.weatherData$!.subscribe({
      next: (data) => emissions.push(data),
      complete: () => {
        expect(emissions).toEqual([
          { state: 'loading' },
          { state: 'success', data: mockWeatherData as ForecastResponse },
        ]);
        done();
      },
    });
  });

  it('multiple subscribers share one service call and late subscribers get the last value', (done) => {
    // Use a multi-emission cold source to observe sharing
    const seq$ = of<ApiResponse<ForecastResponse>[]>(
      { state: 'loading' },
      { state: 'success', data: mockWeatherData as ForecastResponse }
    );
    mockWeatherDataService.fetchWeatherForecast.and.returnValue(seq$);

    fixture.detectChanges(); // ngOnInit

    const a: ApiResponse<ForecastResponse>[] = [];
    const b: ApiResponse<ForecastResponse>[] = [];

    const subA = component.weatherData$!.subscribe((data) => a.push(data));
    const subB = component.weatherData$!.subscribe((data) => b.push(data));

    expect(a).toEqual([
      { state: 'loading' },
      { state: 'success', data: mockWeatherData as ForecastResponse },
    ]);
    expect(b).toEqual([
      { state: 'success', data: mockWeatherData as ForecastResponse },
    ]);

    // service should be subscribed once due to shareReplay
    expect(mockWeatherDataService.fetchWeatherForecast).toHaveBeenCalledTimes(1);

    subA.unsubscribe();
    subB.unsubscribe();
    done();
  });

  it('toggleIcon() delegates to WeatherDataService.toggleIcon()', () => {
    mockWeatherDataService.fetchWeatherForecast.and.returnValue(
      of<ApiResponse<ForecastResponse>>({ state: 'success', data: mockWeatherData as ForecastResponse })
    );
    fixture.detectChanges();

    component.toggleIcon();
    expect(mockWeatherDataService.toggleIcon).toHaveBeenCalledTimes(1);
  });
});
