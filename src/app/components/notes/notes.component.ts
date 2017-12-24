import {Component, Input, OnInit} from '@angular/core';
import {StoreService} from "../../service/store";
import {CalendarDay, Note} from "../../models/calendar-day.model";

@Component({
    selector: 'app-notes',
    templateUrl: './notes.component.html',
    styleUrls: ['./notes.component.scss']
})
export class NotesComponent {

    public chosenDate: CalendarDay;

    constructor(private store: StoreService) {
    }

    public saveNotes() {
        this.store.pushNotes(this.chosenDate);
    }

    // Создание нового поля с заметкой
    public addNote() {
        let note = new Note();
        note.text = '';
        this.chosenDate.notes.push(note);
    }
}
