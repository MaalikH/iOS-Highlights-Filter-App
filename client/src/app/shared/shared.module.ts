import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BooksDataService } from './services/books-data.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { ChipHighlightColorDirective } from './directives/chip-highlight-color.directive';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG,
  HammerGestureConfig,
  HammerModule,
} from '@angular/platform-browser';
import * as Hammer from 'hammerjs';
import { CardHighlightColorDirective } from './directives/card-highlight-color.directive';

// making hammer config (3)

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  override overrides = <any>{
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
}

@NgModule({
  declarations: [ChipHighlightColorDirective, CardHighlightColorDirective],
  imports: [],
  providers: [
    BooksDataService,
    { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig },
  ],
  exports: [
    NgbModule,
    FontAwesomeModule,
    NgbModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    MatChipsModule,
    MatIconModule,
    ChipHighlightColorDirective,
    CardHighlightColorDirective,
    DragDropModule,
    MatSidenavModule,
    HammerModule,
    MatButtonModule,
    MatExpansionModule,
    MatInputModule,
    MatSlideToggleModule,
  ],
})
export class SharedModule {}
