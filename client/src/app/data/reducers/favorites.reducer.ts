import { Action } from '@ngrx/store';
import { Highlight } from '../models/highlights.model';

export const UPDATE_FAVORITES = 'UPDATE_FAVORITES';
export const GET_FAVORITES = 'GET_FAVORITES';

export function favoritesReducer(state: Highlight[] = [], action: any) {
  switch (action.type) {
    case UPDATE_FAVORITES:
      return action.payload;
    case GET_FAVORITES:
      return state;
    default:
      return state;
  }
}
