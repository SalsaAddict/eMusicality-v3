import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BreakdownComponent } from './breakdown/breakdown.component';
import { TracksComponent } from './tracks/tracks.component';
import { VolumeButtonComponent } from './volume-button/volume-button.component';
import { SongHeaderComponent } from './song-header/song-header.component';

@NgModule({
  declarations: [
    AppComponent,
    BreakdownComponent,
    TracksComponent,
    VolumeButtonComponent,
    SongHeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
