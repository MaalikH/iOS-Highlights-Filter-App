import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import * as _ from 'lodash';
import { BooksDataService } from 'src/app/shared/services/books-data.service';
import { faStar, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Highlight } from '../../data/models/highlights.model';
import { Book } from '../../data/models/book.model';
import { FilterCategory, FilterOption } from '../../data/models/filters.model';
import {
  AppState,
  getAllFavorites,
  getAllFilteredHighlights,
  getAllHighlights,
} from '../../data/app.state';
import { Observable, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { IndexObject } from 'src/app/data/models/indexObject.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-highlights-container',
  templateUrl: './highlights-container.component.html',
  styleUrls: ['./highlights-container.component.scss'],
})
export class HighlightsContainerComponent implements OnInit {
  constructor(
    private booksDataService: BooksDataService,
    private cdr: ChangeDetectorRef,
    private store: Store<AppState>,
    private router: Router
  ) {
    this.highlightsStore$ = this.store.select((state) => state.highlights);
    this.filteredHighlightsStore$ = this.store.select(
      (state) => state.filteredHighlights
    );
  }
  //converting data to store
  highlightsStore$: Observable<Highlight[]>;
  filteredHighlightsStore$: Observable<Highlight[]>;

  highlights: Highlight[] = [];
  filteredHighlights: Highlight[] = [];
  paginatedArray: Highlight[] = [];
  favorites: Highlight[] = [];

  filters: FilterCategory[] = [];
  bookFilters: FilterCategory[] = [];

  booksData: Book[] = [];
  noBooksSelected = false;
  faStar = faStar;
  faCheck = faCheck;
  faTrash = faTrash;
  page = 1;
  pageSize = 75;

  ngOnInit(): void {
    this.booksDataService.getBooksData().subscribe((data) => {
      this.booksData = data;
    });

    const route = this.router.url;
    if (route === '/highlights') {
      this.booksDataService.getHighlightsData().subscribe((data) => {
        this.booksDataService.updateHighlightsData(data);
      });
    } else if (route === '/highlightsFromBooks') {
    } else if (route === '/favorites') {
      this.booksDataService.getFavoritesData().subscribe((data) => {
        this.booksDataService.updateFavoritesData(data);
        this.booksDataService.updateHighlightsData(data);
      });
    }

    this.booksDataService.getFavoritesData().subscribe((data: Highlight[]) => {
      this.booksDataService.updateFavoritesData(data);
    });

    this.store.select<Highlight[]>(getAllHighlights).subscribe((highlights) => {
      this.highlights = highlights;
      this.filters = [];
      if (this.highlights.length >= 1) {
        this.getFilters();
        this.filterHighlights();
      }
    });

    this.store
      .select<Highlight[]>(getAllFilteredHighlights)
      .subscribe((filteredHighlights) => {
        this.filteredHighlights = filteredHighlights;
        this.paginateHighlights(this.page);
      });

    this.store.select<Highlight[]>(getAllFavorites).subscribe((favorites) => {
      this.favorites = favorites;
      this.paginateHighlights(this.page);
    });
  }

  ngAfterViewChecked() {
    //your code to update the model
    this.cdr.detectChanges();
  }

  drop(event: any, i: number) {
    moveItemInArray(
      this.filters[i].filterOptions,
      event.previousIndex,
      event.currentIndex
    );
  }

  getFilters() {
    //populates 'filters' array for all options
    this.getFiltersByCategory('title');
    this.getFiltersByCategory('colorCode');
    this.getFiltersByCategory('chapter');
    //date and time
    //favorites
  }

  getFiltersByCategory(filterProperty: string) {
    //
    let filterTitle = filterProperty;
    switch (
      filterProperty //convert json filter property to display title
    ) {
      case 'title':
        filterTitle = 'Book';
        break;
      case 'colorCode':
        filterTitle = 'Color Code';
        break;
      case 'chapter':
        filterTitle = 'Chapter';
        break;
      default:
        filterTitle = 'ERROR LOADING TITLE';
        break;
    }
    // get all unique options for filtering... (ex: title -> array of all unique book titles)
    let uniqueFilters = _.uniq(_.map(this.highlights, filterProperty));

    if (filterProperty === 'chapter') {
      const key = 'chapter';
      const arrayUniqueByKey = [
        ...new Map(
          this.highlights.map((item: any) => [item[key], item])
        ).values(),
      ];

      const obj = arrayUniqueByKey.map((x: any) => {
        return {
          title: x.title,
          filterName: x.chapter,
          isFiltered: true, // filterProperty === 'title' ? true : false
        };
      });

      this.filters.push({
        name: filterProperty,
        displayName: filterTitle,
        filterOptions: obj,
      });
    } else {
      const obj = uniqueFilters.map((r: string) => {
        // create array of filters object with isFiltered flag
        return {
          filterName: r,
          isFiltered: true, // filterProperty === 'title' ? true : false
        };
      });
      // push array of objects that contain filter category name & unique filters objects
      this.filters.push({
        name: filterProperty,
        displayName: filterTitle,
        filterOptions: obj,
      });
    }
  }

  filterHighlights() {
    let filteredHighlightsByBook: any = [];
    let filteredHighlightsByAllFilters: any = [];
    let activeFilters = this.getActiveFilters();
    let bookFilters: any = _.find(activeFilters, { name: 'title' }); //array of all books with isSelected flag
    if (bookFilters.filterOptions.length > 0) {
      this.noBooksSelected = false;
      // get all highlights from each book
      bookFilters.filterOptions.forEach((x: any) => {
        // filter all highlights for each active book title
        filteredHighlightsByBook = filteredHighlightsByBook.concat(
          _.filter(this.highlights, { title: x.filterName })
        );
      });
      //get all active non 'title' filters (ex: colors, chapter, date)
      let remainingFilters: any = _.filter(activeFilters, (o) => {
        return o.name !== 'title' && o.filterOptions.length > 0;
      });
      //if other filters, continue filtering
      let colorCodes: any = []; //empty array of colorCodes

      bookFilters.filterOptions.forEach((x: any) => {
        filteredHighlightsByAllFilters = filteredHighlightsByBook.concat(
          _.filter(filteredHighlightsByBook, { title: x.filterName })
        ); //array of current selected highlights to be filtered
      });
      let remainingFiltersArray: any = []; //empty temp array for filtering
      if (remainingFilters.length >= 1) {
        //color codes filtering
        remainingFilters[0].filterOptions.forEach((filterOption: any) => {
          if (filterOption.isFiltered) {
            colorCodes.push(filterOption.filterName);
          }
        });
        let filteredHighlightsByColorCode = filteredHighlightsByBook.filter(
          (e: any) => colorCodes.includes(+e.colorCode)
        );
        remainingFiltersArray = remainingFiltersArray.concat(
          filteredHighlightsByColorCode
        );

        //chapters filtering
        if (remainingFilters[1]) {
          let chaptersToFilter: any = []; //empty array of colorCodes
          remainingFilters[1].filterOptions.forEach((filterOption: any) => {
            if (filterOption.isFiltered) {
              chaptersToFilter.push(filterOption.filterName);
            }
          });
          let filterByChaptersAndColorCodes =
            filteredHighlightsByColorCode.filter((z: any) =>
              chaptersToFilter.includes(z.chapter)
            );
          remainingFiltersArray = filterByChaptersAndColorCodes;
        }
        this.booksDataService.updateFilteredHighlightsData(
          remainingFiltersArray
        );
      }
      //if books are only active filter, return highlights filtered by book(s)
      else {
        this.booksDataService.updateFilteredHighlightsData(
          filteredHighlightsByBook
        );
      }
    } else {
      this.noBooksSelected = true;
      this.booksDataService.updateFilteredHighlightsData([]);
    }
    //this.paginateHighlights( this.filteredHighlightsStore, this.pageSize, this.page);
  }

  paginateHighlights(page: number) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    this.page = page;
    this.paginatedArray = this.filteredHighlights.slice(
      (this.page - 1) * this.pageSize,
      this.page * this.pageSize
    );
  }

  filterChaptersByTitle(chapters: any, bookTitle: any) {
    //
    let filteredChapters = _.filter(chapters, { title: bookTitle });
    return filteredChapters;
  }

  getChapterFiltersLength(chapters: any, bookTitle: any) {
    let filteredChapters = this.filterChaptersByTitle(chapters, bookTitle);
    return filteredChapters.length > 0 ? false : true;
  }

  selectClearBooks(selected: boolean) {
    this.filters[0].filterOptions.forEach((bookFilter: any) => {
      bookFilter.isFiltered = selected;
    });
    this.filterHighlights();
  }

  toggleFilter(indexObject: IndexObject) {
    let filter =
      this.filters[indexObject.categoryIndex].filterOptions[
        indexObject.filterOptionIndex
      ];
    this.filters[indexObject.categoryIndex].filterOptions[
      indexObject.filterOptionIndex
    ].isFiltered = !filter.isFiltered;
    if (indexObject.categoryIndex === 0) {
      // if toggling a book, turn all chapters on or off
      let title = filter.filterName;
      this.filters[2].filterOptions.forEach((chapter: any) => {
        if (chapter.title === title) {
          chapter.isFiltered = filter.isFiltered ? true : false;
        }
      });
    }
    this.filterHighlights();
  }

  toggleChapterFilter(filterOption: FilterOption) {
    let chapter = filterOption.filterName;
    let chapterIndex = _.findIndex(this.filters[2].filterOptions, (e: any) => {
      return e.filterName === chapter;
    });
    this.filters[2].filterOptions[chapterIndex].isFiltered =
      !this.filters[2].filterOptions[chapterIndex].isFiltered;
    this.filterHighlights();
  }

  removeFilter(indexObject: IndexObject) {
    this.filters[indexObject.categoryIndex].filterOptions.splice(
      indexObject.filterOptionIndex,
      1
    );
    this.filterHighlights();
  }

  getActiveFilters() {
    let activeFilters: any = [];
    if (this.filters) {
      this.filters.forEach((x: any) => {
        activeFilters.push({
          displayName: x.displayName,
          name: x.name,
          filterOptions: _.filter(x.filterOptions, { isFiltered: true }),
        });
      });
    }
    return activeFilters;
  }

  isFavorite(highlight: Highlight): boolean {
    if (this.favorites.length > 0) {
      let favoriteIndex = this.favorites.findIndex((x) => {
        return x.quote === highlight.quote;
      });
      return favoriteIndex === -1 ? false : true;
    } else {
      return false;
    }
  }

  getBookCover(title: string): string {
    const bookTitle = title;
    if (this.booksData.length > 0) {
      return this.booksData[0].cover;
    }
    return '';
  }
}
