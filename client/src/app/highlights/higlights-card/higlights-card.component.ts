import { Component, OnInit, Input } from '@angular/core';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Highlight } from 'src/app/data/models/highlights.model';
import { BooksDataService } from 'src/app/shared/services/books-data.service';
import { HighlightsContainerComponent } from '../highlights-container/highlights-container.component';

@Component({
  selector: 'app-higlights-card',
  templateUrl: './higlights-card.component.html',
  styleUrls: ['./higlights-card.component.scss'],
})
export class HiglightsCardComponent implements OnInit {
  @Input()
  highlight!: Highlight;
  favorites: Highlight[] = [];
  faStar = faStar;

  toggleFavorite(highlight: Highlight) {
    this.booksDataService
      .toggleFavoriteHighlight(highlight)
      .subscribe((x) => this.booksDataService.updateFavoritesData(x));
  }

  constructor(
    public highlightsContainer: HighlightsContainerComponent,
    private booksDataService: BooksDataService
  ) {}

  ngOnInit(): void {}
}
