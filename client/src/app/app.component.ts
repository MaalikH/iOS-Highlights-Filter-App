import { ChangeDetectorRef, Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState, getShowAllBooks } from "./data/app.state";
import { BooksDataService } from "./shared/services/books-data.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "convert-highlights-angular";
  public isMenuCollapsed = true;
  showAllBooks = true;

  constructor(
    private store: Store<AppState>,
    private booksDataService: BooksDataService,
    private cdr: ChangeDetectorRef
  ) {
    this.store
      .select<boolean>(getShowAllBooks)
      .subscribe((showAllBooks: any) => {
        this.showAllBooks = showAllBooks;
      });
  }

  ngAfterViewChecked() {
    //your code to update the model
    this.cdr.detectChanges();
    this.booksDataService.toggleShowBooks(!this.showAllBooks);
  }
}
