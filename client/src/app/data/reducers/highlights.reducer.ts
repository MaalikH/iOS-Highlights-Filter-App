import { Action } from '@ngrx/store';
import { Highlight } from '../models/highlights.model';

export const UPDATE_HIGHLIGHTS = 'UPDATE_HIGHLIGHTS';
export const GET_HIGHLIGHTS = 'GET_HIGHLIGHTS';

export function highlightsReducer(state: Highlight[] = [], action: any) {
  switch (action.type) {
    case UPDATE_HIGHLIGHTS:
      return action.payload;
    case GET_HIGHLIGHTS:
      return state;
    default:
      return state;
  }
}
