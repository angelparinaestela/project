import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetiroComponent } from './retiro.component';

describe('Retiro', () => {
  let component: RetiroComponent;
  let fixture: ComponentFixture<RetiroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetiroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
