import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutPrincipalComponent } from './layout-principal.component';  // ✅ Nombre correcto

describe('LayoutPrincipalComponent', () => {
  let component: LayoutPrincipalComponent;
  let fixture: ComponentFixture<LayoutPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutPrincipalComponent]  // Si es standalone
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
