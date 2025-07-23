import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TareasAdminComponent } from './tareas-admin.component';

describe('TareasAdmin', () => {
  let component: TareasAdminComponent;
  let fixture: ComponentFixture<TareasAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TareasAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TareasAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
