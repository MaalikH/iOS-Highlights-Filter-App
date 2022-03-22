import { Action } from '@ngrx/store';
import { FilterCategory } from '../models/filters.model';

export const TOGGLE_SHOW_BOOKS = 'TOGGLE_SHOW_BOOKS';
export const GET_SHOW_BOOKS = 'GET_SHOW_BOOKS';

export function showAllBooksReducer(state: boolean = false, action: any) {
  switch (action.type) {
    case TOGGLE_SHOW_BOOKS:
      return action.payload;
    case GET_SHOW_BOOKS:
      return state;
    default:
      return state;
  }
}
