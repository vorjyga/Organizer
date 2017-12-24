// import {Note} from "./calendar-day.model";

import {Note} from "./calendar-day.model";

export class IncomingNotesModel {
    constructor(
        public date: string,
        public notes: Array<Note>,
    ) {}
}
