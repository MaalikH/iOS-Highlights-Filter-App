import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksModule } from './books/books.module';
import { HighlightsModule } from './highlights/highlights.module';

const routes: Routes = [
  {
    path: 'books',
    loadChildren: () =>
      import('./books/books.module').then((m) => m.BooksModule),
  },
  {
    path: 'highlights',
    loadChildren: () =>
      import('./highlights/highlights.module').then((m) => HighlightsModule),
  },
  {
    path: 'highlightsFromBooks',
    loadChildren: () =>
      import('./highlights/highlights.module').then((m) => HighlightsModule),
  },
  {
    path: 'favorites',
    loadChildren: () =>
      import('./books/books.module').then((m) => HighlightsModule),
  },
  {
    path: '',
    redirectTo: '/books',
    pathMatch: 'full',
  }, // redirect to `books`
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
