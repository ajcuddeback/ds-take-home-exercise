import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentWeatherCard } from './current-weather-card';

// TODO: Add tests
describe('CurrentWeatherCard', () => {
  let component: CurrentWeatherCard;
  let fixture: ComponentFixture<CurrentWeatherCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentWeatherCard]
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
