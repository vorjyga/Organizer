import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from "@angular/forms";

import {AppComponent} from './app.component';
import {CalendarComponent} from './components/calendar/calendar.component';
import { WeatherComponent } from './components/weather/weather.component';
import {YqlService} from "./service/yql.service";
import {StoreService} from "./service/store";
import { NotesComponent } from './components/notes/notes.component';

import {environment} from "../environments/environment";
import {AngularFireModule} from "angularfire2";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {AngularFireAuthModule} from "angularfire2/auth";

@NgModule({
    declarations: [
        AppComponent,
        CalendarComponent,
        WeatherComponent,
        NotesComponent,
    ],
    imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        BrowserModule,
        FormsModule
    ],
    exports: [
    ],
    providers: [YqlService, StoreService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
