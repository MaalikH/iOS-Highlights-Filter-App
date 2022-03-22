import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Highlight } from '../../data/models/highlights.model';
import { Book } from '../../data/models/book.model';
import { catchError, Observable, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/data/app.state';

@Injectable({
  providedIn: 'root',
})
export class BooksDataService {
  constructor(private http: HttpClient, private store: Store<AppState>) {}

  baseURL = 'http://localhost:3000/';
  getBooksURL = 'getAllBooksFromMacOS';
  getHighlightsURL = 'getAllHighlightsFromMacOS';
  getHighlightsByBooksURL = 'getBooksHighlightsFromMacOS';
  getFavoriteHighlightsURL = 'getFavoriteHighlights';
  toggleFavoriteHighlightURL = 'toggleFavoriteHighlight';
  saveBookCoversURL = 'saveBookCovers';
  saveIgnoreBooksURL = 'saveIgnoredBooks';

  getBooksData(): Observable<Book[]> {
    return this.http.get<[]>(this.baseURL + this.getBooksURL);
  }

  getHighlightsData(): Observable<Highlight[]> {
    return this.http.get<[]>(this.baseURL + this.getHighlightsURL);
  }

  getHighlightsByBook(books: string[]): Observable<Highlight[]> {
    let params = new HttpParams();
    params = params.append('books', JSON.stringify(books));
    return this.http.get<[]>(this.baseURL + this.getHighlightsByBooksURL, {
      params: params,
    });
  }

  updateHighlightsData(highlights: Highlight[]) {
    this.store.dispatch({
      type: 'UPDATE_HIGHLIGHTS',
      payload: highlights,
    });
    console.log('UPDATE HIGHLIGHT', highlights.length);
  }

  updateFilteredHighlightsData(highlights: Highlight[]) {
    this.store.dispatch({
      type: 'UPDATE_FILTERED_HIGHLIGHTS',
      payload: highlights,
    });
    console.log('UPDATE FILTERED HIGHLIGHT', highlights.length);
  }

  toggleShowBooks(toggle: boolean) {
    this.store.dispatch({
      type: 'TOGGLE_SHOW_BOOKS',
      payload: toggle,
    });
  }

  getFavoritesData(): Observable<Highlight[]> {
    return this.http.get<[]>(this.baseURL + this.getFavoriteHighlightsURL);
  }

  updateFavoritesData(favorites: Highlight[]) {
    this.store.dispatch({
      type: 'UPDATE_FAVORITES',
      payload: favorites,
    });
    console.log('UPDATE FAVORITES', favorites.length);
  }

  toggleFavoriteHighlight(favorite: Highlight) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    const body = JSON.stringify(favorite);
    return this.http.post<Highlight[]>(
      this.baseURL + this.toggleFavoriteHighlightURL,
      body,
      httpOptions
    );
  }

  saveBookCovers(bookCovers: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    const body = JSON.stringify(bookCovers);
    console.log('BOOK COVERS POSTED', bookCovers);

    return this.http.post<any>(
      this.baseURL + this.saveBookCoversURL,
      body,
      httpOptions
    );
  }

  ignoreBooks(books: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    const body = JSON.stringify(books);
    console.log('BOOKS TO IGNORE POSTED', books);

    return this.http.post<any>(
      this.baseURL + this.saveIgnoreBooksURL,
      body,
      httpOptions
    );
  }
}
