import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  faCheck,
  faChevronDown,
  faCamera,
  faSleigh,
} from '@fortawesome/free-solid-svg-icons';
import { BooksDataService } from 'src/app/shared/services/books-data.service';
import { Book } from '../../data/models/book.model';
import {
  AppState,
  getAllHighlights,
  getShowAllBooks,
} from '../../data/app.state';
import { Highlight } from '../../data/models/highlights.model';
import { Observable, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { uniq } from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'app-books-container',
  templateUrl: './books-container.component.html',
  styleUrls: ['./books-container.component.scss'],
})
export class BooksContainerComponent implements OnInit {
  configUrl = 'assets/config.json';
  booksData: Book[] = [];
  bookSelectionActive = false;
  editImageActive = false;
  faCheck = faCheck;
  faChevronDown = faChevronDown;
  faCamera = faCamera;
  highlights: Highlight[] = [];
  showAllBooks = false;

  changedBookCovers: any = [];

  constructor(
    private store: Store<AppState>,
    private booksDataService: BooksDataService,
    private cdr: ChangeDetectorRef,
    public router: Router
  ) {
    this.store.select<boolean>(getShowAllBooks).subscribe((showAllBooks) => {
      this.showAllBooks = showAllBooks;
    });
  }

  ngOnInit(): void {
    this.getBooks();
    this.getHighlights();
  }

  ngAfterViewChecked(): void {
    //your code to update the model
    this.cdr.detectChanges();
  }

  getBooks() {
    this.booksDataService.getBooksData().subscribe((data) => {
      const books = data.map(({ ...r }) => {
        return {
          ...r,
          isSelected: false,
        };
      });
      this.booksData = books;
    });
  }

  getHighlights() {
    this.booksDataService.getHighlightsData().subscribe((data) => {
      this.booksDataService.updateHighlightsData(data);
    });

    this.store.select<Highlight[]>(getAllHighlights).subscribe((highlights) => {
      this.highlights = highlights;
    });
  }

  bookHasHighlights(title: string) {
    const uniqueTitles = [
      ...new Set(this.highlights.map((item) => item.title)),
    ];
    const index = uniqueTitles.findIndex((bookTitle) => bookTitle === title);
    return index > -1 ? true : false;
  }

  selectBook(i: number) {
    if (!this.bookSelectionActive) {
      this.bookSelectionActive = true;
    } else if (this.bookSelectionActive) {
      this.booksData[i].isSelected = !this.booksData[i].isSelected;
    }
  }

  getHighlightsFromBooks() {
    let booksToShowHighlights = this.booksData
      .filter((book) => book.isSelected)
      .map((x: any) => {
        return x.title;
      });
    if (booksToShowHighlights.length > 0) {
      this.booksDataService
        .getHighlightsByBook(booksToShowHighlights)
        .subscribe((data: Highlight[]) => {
          this.booksDataService.updateHighlightsData(data);
          this.router.navigate(['/highlightsFromBooks']);
        });
    }
  }

  ignoreBooks() {
    let booksToIgnore = this.booksData.filter((book) => book.isSelected);
    if (booksToIgnore.length > 0) {
      this.booksDataService.ignoreBooks(booksToIgnore).subscribe((x: any) => {
        this.getBooks();
      });
    }
  }

  hideBook(book: Book) {
    if (this.showAllBooks) {
      return false;
    } else {
      if (book.ignore) {
        return true;
      } else if (!this.bookHasHighlights(book.title)) {
        return false;
      } else {
        return true;
      }
    }
  }

  toggleImageEditActive() {
    if (this.editImageActive) {
      this.saveBookCovers();
    }
    this.editImageActive = !this.editImageActive;
  }

  URLEditActive() {
    this.editImageActive = true;
  }

  URLchanged(i: number) {
    if (this.booksData[i].cover !== '') {
      this.changedBookCovers.push({
        cover: this.booksData[i].cover,
        title: this.booksData[i].title,
      });
    }
  }

  saveBookCovers() {
    this.booksDataService
      .saveBookCovers(this.changedBookCovers)
      .subscribe((x: any) => {});
  }

  getSelectedBooksCount() {
    const count = this.booksData.filter((book) => book.isSelected).length;
    return count;
  }

  closeFooter() {
    this.bookSelectionActive = false;
    this.saveBookCovers();
    this.booksData.forEach((book: Book) => {
      book.isSelected = false;
    });
  }
}
