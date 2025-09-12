import { TestBed } from '@angular/core/testing';
import { App } from './app';
import {MockComponents} from 'ng-mocks';
import {Home} from './components/home/home';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,
        MockComponents(Home)
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
