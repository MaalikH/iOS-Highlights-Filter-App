import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HighlightsContainerComponent } from './highlights-container/highlights-container.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../shared/shared.module';
import { HighlightsFilterPanelComponent } from './highlights-filter-panel/highlights-filter-panel.component';
import { HiglightsCardComponent } from './higlights-card/higlights-card.component';
const routes: Routes = [
  {
    path: '',
    component: HighlightsContainerComponent,
  },
];

@NgModule({
  declarations: [HighlightsContainerComponent, HighlightsFilterPanelComponent, HiglightsCardComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
})
export class HighlightsModule {}
