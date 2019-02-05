import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { SearchService } from './services/search.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ResultComponent } from './result/result.component';
import { LoaderComponent } from './loader/loader.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResTableComponent } from './res-table/res-table.component';
import { FavTableComponent } from './fav-table/fav-table.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { DetailsComponent } from './details/details.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SeatmapComponent} from './details/seatmap/seatmap.component';
import { PhotoComponent } from './details/photo/photo.component';
import { EventComponent } from './details/event/event.component';
import { ArtistTableComponent } from './details/artist-table/artist-table.component';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import { AgmCoreModule } from '@agm/core';
@NgModule({
  declarations: [
    AppComponent,
    SearchFormComponent,
    ResultComponent,
    LoaderComponent,
    ResTableComponent,
    FavTableComponent,
    DetailsComponent,
    SeatmapComponent,

    PhotoComponent,

    EventComponent,

    ArtistTableComponent
  ],
  entryComponents: [ SeatmapComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTooltipModule,
    MatAutocompleteModule,
    NgbModule.forRoot(),
    RoundProgressModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAi4f00hgHpySIYuyQwEZuQcpehp28lphQ'
    })
  ],
  providers: [
    SearchService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
