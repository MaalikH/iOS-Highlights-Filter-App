import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksContainerComponent } from './books-container.component';

describe('BooksContainerComponent', () => {
  let component: BooksContainerComponent;
  let fixture: ComponentFixture<BooksContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BooksContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BooksContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
