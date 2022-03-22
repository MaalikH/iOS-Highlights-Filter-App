import { Action } from '@ngrx/store';
import { FilterCategory } from '../models/filters.model';

export const UPDATE_FILTERS = 'UPDATE_FILTERS';
export const GET_FILTERS = 'GET_FILTERS';

export function filtersReducer(state: FilterCategory[] = [], action: any) {
  switch (action.type) {
    case UPDATE_FILTERS:
      return action.payload;
    case GET_FILTERS:
      return state;
    default:
      return state;
  }
}
