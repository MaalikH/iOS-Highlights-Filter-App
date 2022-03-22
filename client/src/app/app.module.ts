import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { highlightsReducer } from './data/reducers/highlights.reducer';
import { filteredHiglightsReducer } from './data/reducers/filteredHighlights.reducer';
import { filtersReducer } from './data/reducers/filters.reducer';
import { favoritesReducer } from './data/reducers/favorites.reducer';
import { showAllBooksReducer } from './data/reducers/showAllBooks.reducer';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({
      highlights: highlightsReducer,
      filteredHighlights: filteredHiglightsReducer,
      filters: filtersReducer,
      favorites: favoritesReducer,
      showAllBooks: showAllBooksReducer,
    }),
  ],
  providers: [SharedModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
