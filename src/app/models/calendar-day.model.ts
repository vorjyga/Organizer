import * as moment from "moment";

export class CalendarDay {
    constructor(
        public date: moment.Moment,
        public notes?: Array<Note>,
        public isActive = false,
        public high?: string,
        public low?: string,
        public text?: string
    ) {
        if (!this.notes) {
            this.notes = [];
        }
    }
}
export class Note {
   text: string;

}
