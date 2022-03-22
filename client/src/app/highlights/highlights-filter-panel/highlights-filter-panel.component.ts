import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import * as _ from 'lodash';
import { FilterOption } from 'src/app/data/models/filters.model';
import { IndexObject } from 'src/app/data/models/indexObject.model';
@Component({
  selector: 'app-highlights-filter-panel',
  templateUrl: './highlights-filter-panel.component.html',
  styleUrls: ['./highlights-filter-panel.component.scss'],
})
export class HighlightsFilterPanelComponent implements OnInit {
  @Input() filters: any = []; // decorate the property with @Input()
  @Input() noBooksSelected = false;
  @Output() selectClearBooksClick = new EventEmitter<boolean>();
  @Output() removeFilterClick = new EventEmitter<IndexObject>();
  @Output() toggleFilterClick = new EventEmitter<IndexObject>();
  @Output() filterHighlightsClick = new EventEmitter<any>();
  @Output() toggleChapterFilterClick = new EventEmitter<FilterOption>();

  faCheck = faCheck;
  faTrash = faTrash;

  constructor() {}

  ngOnInit(): void {}

  onSelectClearBooksClick(value: boolean) {
    this.selectClearBooksClick.emit(value);
  }
  onRemoveFilterClick(i: number, j: number) {
    this.removeFilterClick.emit({
      categoryIndex: i,
      filterOptionIndex: j,
    });
  }
  onToggleFilterClick(i: number, j: number) {
    this.toggleFilterClick.emit({
      categoryIndex: i,
      filterOptionIndex: j,
    });
  }
  onFilterHighlightsClick() {
    this.filterHighlightsClick.emit();
  }

  onToggleChapterFilterClick(filterOption: FilterOption) {
    this.toggleChapterFilterClick.emit(filterOption);
  }

  getChapterFiltersLength(chapters: any, bookTitle: any) {
    let filteredChapters = this.filterChaptersByTitle(chapters, bookTitle);
    return filteredChapters.length > 0 ? false : true;
  }

  filterChaptersByTitle(chapters: any, bookTitle: any) {
    //
    let filteredChapters = _.filter(chapters, { title: bookTitle });
    return filteredChapters;
  }
}
