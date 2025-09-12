import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { WeatherCard } from './weather-card';
import { WeatherDataService } from '../../services/weather-data.service';

describe('WeatherCard', () => {
  let fixture: ComponentFixture<WeatherCard>;
  let component: WeatherCard;

  let showIconSubject: Subject<boolean>;
  let mockWeatherDataService: { showIcon$: Subject<boolean> };

  beforeEach(async () => {
    showIconSubject = new Subject<boolean>();
    mockWeatherDataService = { showIcon$: showIconSubject };

    await TestBed.configureTestingModule({
      imports: [WeatherCard],
      providers: [{ provide: WeatherDataService, useValue: mockWeatherDataService }],
    })
      .overrideComponent(WeatherCard, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(WeatherCard);
    component = fixture.componentInstance;
  });

  it('exposes WeatherDataService.showIcon$ as showIcon$', (done) => {
    fixture.detectChanges();

    const seen: boolean[] = [];
    const sub = component.showIcon$.subscribe((data) => {
      seen.push(data);
      if (seen.length === 2) {
        expect(seen).toEqual([true, false]);
        sub.unsubscribe();
        done();
      }
    });

    showIconSubject.next(true);
    showIconSubject.next(false);
  });
});
