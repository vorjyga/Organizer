import { Injectable } from '@angular/core';
import {CalendarDay} from 'app/models/calendar-day.model';
import {IncomingNotesModel} from 'app/models/notes.model';
import {Observable} from 'rxjs/Observable';
import {AngularFireDatabase} from 'angularfire2/database';

@Injectable()
export class StoreService {

    public notesObservable: Observable<any[]>;
    public incomingNotes: Array<IncomingNotesModel>;
    public message = '';

    public selectedWeather: any;

    constructor(public db: AngularFireDatabase) {
        this.notesObservable = this.db.list('/notes').valueChanges();

    }

    // Обновление данных о заметках выбранного дня.
    pushNotes(dateNotes: CalendarDay) {
        const noteDate = dateNotes.date.format('DD MMM YYYY')
        this.db.list('/notes').update(noteDate, new IncomingNotesModel(noteDate, dateNotes.notes))
            .then(() => {
                this.showSuccessMessage();

            })
    }
    private showSuccessMessage() {
        this.message = 'Successfully uploaded';
        setTimeout(() => {
            this.message = '';
        }, 2000);
    }

}
