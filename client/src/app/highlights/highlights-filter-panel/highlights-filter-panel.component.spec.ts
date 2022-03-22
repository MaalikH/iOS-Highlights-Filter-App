import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightsFilterPanelComponent } from './highlights-filter-panel.component';

describe('HighlightsFilterPanelComponent', () => {
  let component: HighlightsFilterPanelComponent;
  let fixture: ComponentFixture<HighlightsFilterPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighlightsFilterPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HighlightsFilterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
