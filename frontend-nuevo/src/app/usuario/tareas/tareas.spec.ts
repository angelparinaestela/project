import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TareasComponent } from '/tareas/tareas.component'; 


describe('Tareas', () => {
  let component: TareasComponent;
  let fixture: ComponentFixture<TareasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TareasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TareasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
