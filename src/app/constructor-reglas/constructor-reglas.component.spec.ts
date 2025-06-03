import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructorReglasComponent } from './constructor-reglas.component';

describe('ConstructorReglasComponent', () => {
  let component: ConstructorReglasComponent;
  let fixture: ComponentFixture<ConstructorReglasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConstructorReglasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConstructorReglasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
