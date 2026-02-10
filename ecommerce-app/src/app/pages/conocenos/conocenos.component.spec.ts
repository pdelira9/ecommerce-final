import { TestBed } from '@angular/core/testing';
import { ConocenosComponent } from './conocenos.component';

describe('ConocenosComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConocenosComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ConocenosComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
