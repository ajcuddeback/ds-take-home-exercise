import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastSection } from './forecast-section';

describe('ForecastSection', () => {
  let component: ForecastSection;
  let fixture: ComponentFixture<ForecastSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForecastSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForecastSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
