import {Component, ViewChild} from '@angular/core';
import {NotesComponent} from "./components/notes/notes.component";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    @ViewChild('notes')
    organizer: NotesComponent;

    constructor() {}

    // C помощью viewChild передаем компоненту с заметками заметки
    callOrganizer(event) {
        this.organizer.chosenDate = event;
    }

}
