import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightsContainerComponent } from './highlights-container.component';

describe('HighlightsContainerComponent', () => {
  let component: HighlightsContainerComponent;
  let fixture: ComponentFixture<HighlightsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighlightsContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HighlightsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
