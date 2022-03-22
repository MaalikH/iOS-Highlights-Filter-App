import { Action } from '@ngrx/store';
import { Highlight } from '../models/highlights.model';

export const UPDATE_FILTERED_HIGHLIGHTS = 'UPDATE_FILTERED_HIGHLIGHTS';
export const GET_FILTERED_HIGHLIGHTS = 'GET_FILTERED_HIGHLIGHTS';

export function filteredHiglightsReducer(state: Highlight[] = [], action: any) {
  switch (action.type) {
    case UPDATE_FILTERED_HIGHLIGHTS:
      return action.payload;
    case GET_FILTERED_HIGHLIGHTS:
      return state;
    default:
      return state;
  }
}
