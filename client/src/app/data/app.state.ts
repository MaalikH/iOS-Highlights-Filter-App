import { Highlight } from "./models/highlights.model";
import { FilterCategory } from "./models/filters.model";
import { Book } from "./models/book.model";
import { createSelector } from "@ngrx/store";

export interface AppState {
  readonly highlights: Highlight[];
  readonly filteredHighlights: Highlight[];
  readonly favorites: Highlight[];
  readonly filters: FilterCategory[];
  readonly books: Book[];
  readonly showAllBooks: boolean;
}

export const selectHighlights = (state: AppState) => state.highlights;
export const selectFilteredHighlights = (state: AppState) =>
  state.filteredHighlights;
export const selectFavoriteHighlights = (state: AppState) => state.favorites;
export const selectFilters = (state: AppState) => state.filters;
export const showAllBooks = (state: AppState) => state.showAllBooks;

export const getAllHighlights = createSelector(
  selectHighlights,
  (state): Highlight[] => {
    return state;
  }
);

export const getAllFilteredHighlights = createSelector(
  selectFilteredHighlights,
  (state): Highlight[] => {
    return state;
  }
);

export const getAllFavorites = createSelector(
  selectFavoriteHighlights,
  (state): Highlight[] => {
    return state;
  }
);

export const getAllFilters = createSelector(
  selectFilters,
  (state): FilterCategory[] => {
    return state;
  }
);

export const getShowAllBooks = createSelector(
  showAllBooks,
  (state): boolean => {
    return state;
  }
);
