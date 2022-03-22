import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiglightsCardComponent } from './higlights-card.component';

describe('HiglightsCardComponent', () => {
  let component: HiglightsCardComponent;
  let fixture: ComponentFixture<HiglightsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiglightsCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiglightsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
