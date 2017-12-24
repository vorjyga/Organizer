import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {IncomingNotesModel} from "../models/notes.model";
import {AngularFireDatabase} from "angularfire2/database";
import {CalendarDay} from "../models/calendar-day.model";

@Injectable()
export class StoreService {

    public notesObservable: Observable<any[]>;
    public incomingNotes: Array<IncomingNotesModel>;

    public selectedWeather: any;

    constructor(public db: AngularFireDatabase) {
        this.notesObservable = this.db.list('/notes').valueChanges();

    }

    // Обновление данных о заметках выбранного дня.
    pushNotes(dateNotes: CalendarDay) {
        let noteDate = dateNotes.date.format('DD MMM YYYY')
        this.db.list('/notes').update(noteDate, new IncomingNotesModel(noteDate, dateNotes.notes))
    }

}
