import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CurrentWeatherCard } from './current-weather-card';
import { WeatherDataService } from '../../services/weather-data.service';
import { ApiResponse } from '../../services/api.service';
import { ForecastResponse, WeatherDataToDisplay } from '../../models/interfaces/weather-data.interface';

// Minimal helpers
const todayIso = new Date().toISOString();
const sampleForecast: ForecastResponse = {
  properties: {
    periods: [
      {
        startTime: todayIso,
        isDaytime: true,
        temperature: 75,
        temperatureUnit: 'F',
        shortForecast: 'Sunny',
        icon: 'icon.png',
      },
    ],
  },
} as any;

const displayFromService: WeatherDataToDisplay = {
  dayName: 'Monday',
  tempC: 23.9,
  forecastExplanation: 'Sunny',
  icon: 'icon.png',
};

describe('CurrentWeatherCard', () => {
  let fixture: ComponentFixture<CurrentWeatherCard>;
  let component: CurrentWeatherCard;
  let weatherDataServiceSpy: jasmine.SpyObj<WeatherDataService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('WeatherDataService', ['formatData']);

    await TestBed.configureTestingModule({
      imports: [CurrentWeatherCard],
      providers: [{ provide: WeatherDataService, useValue: spy }],
    })
      // Nuking the template, so I can subscribe manually without async pipe
      .overrideComponent(CurrentWeatherCard, { set: { template: '' } })
      .compileComponents();

    weatherDataServiceSpy = TestBed.inject(WeatherDataService) as jasmine.SpyObj<WeatherDataService>;
    fixture = TestBed.createComponent(CurrentWeatherCard);
    component = fixture.componentInstance;
  });

  it('does nothing if no input stream is provided', () => {
    fixture.detectChanges();
    expect(component.todayWeatherData$).toBeUndefined();
  });

  it('passes through loading unchanged', (done) => {
    weatherDataServiceSpy.formatData.and.returnValue(displayFromService);
    component.weatherData$ = of({ state: 'loading' });
    fixture.detectChanges();

    component.todayWeatherData$!.subscribe((data) => {
      expect(data).toEqual({ state: 'loading' });
      expect(weatherDataServiceSpy.formatData).not.toHaveBeenCalled();
      done();
    });
  });

  it('passes through error unchanged', (done) => {
    weatherDataServiceSpy.formatData.and.returnValue(displayFromService);
    const errorResp: ApiResponse<ForecastResponse> = { state: 'error', message: 'Server Error' };
    component.weatherData$ = of(errorResp);
    fixture.detectChanges();

    component.todayWeatherData$!.subscribe((data) => {
      expect(data).toEqual({ state: 'error', message: 'Server Error' });
      expect(weatherDataServiceSpy.formatData).not.toHaveBeenCalled();
      done();
    });
  });

  it('maps success using WeatherDataService.formatData', (done) => {
    weatherDataServiceSpy.formatData.and.returnValue(displayFromService);
    component.weatherData$ = of({ state: 'success', data: sampleForecast });
    fixture.detectChanges();

    component.todayWeatherData$!.subscribe((data) => {
      expect(weatherDataServiceSpy.formatData).toHaveBeenCalledTimes(1);
      expect(weatherDataServiceSpy.formatData).toHaveBeenCalledWith(sampleForecast);
      expect(data).toEqual({ state: 'success', data: displayFromService });
      done();
    });
  });
});
