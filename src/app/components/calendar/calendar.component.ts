import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CalendarDay} from "../../models/calendar-day.model";
import {StoreService} from "../../service/store";
import * as moment from 'moment'


@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

    @Output()
    callOrganizer = new EventEmitter();

    public calendarDate = moment();
    public calendar = [];

    private activeDay: CalendarDay;

    constructor(private store: StoreService) {
    }

    // Подписываемся на изменения заметок на сервере
    ngOnInit() {
        this.store.notesObservable.subscribe(notesFromFB => {
            this.store.incomingNotes = notesFromFB;
            this.initializeCalendar()

            if (this.activeDay) {
                this.matchNotes(this.activeDay);
            }
        }, () =>{
            this.initializeCalendar()
        })

    }

    //
    // Инициализация календаря
    private initializeCalendar() {
        const startWeek = this.calendarDate.clone().startOf('month').isoWeek();
        const endWeek = this.calendarDate.clone().endOf('month').isoWeek();
        this.calendar = [];

        // Создание многомерного массива Месяц[неделя[число]]
        for (var week = startWeek; week <= endWeek; week++) {
            this.calendar.push({
                week: week,
                days: Array(7).fill(0).map((n, i) => {
                    let day = new CalendarDay(
                        this.calendarDate.clone().week(week).startOf('week').add(n + i + 1, 'day')
                    );

                    if (this.activeDay && day.date.format("DD MMM YYYY") === this.activeDay.date.format("DD MMM YYYY")) {
                        day.isActive = true;
                    }
                    // Если город уже выбран, то подставляем его погоду
                    if (this.store.selectedWeather) {
                        this.store.selectedWeather.forEach(weatherDay => {
                            if (weatherDay.date === day.date.format('DD MMM YYYY')) {
                                day.high = weatherDay.high;
                                day.low = weatherDay.low;
                                day.text = weatherDay.text;
                            }
                        })
                    }

                    // Если есть заметки с сервера, то подставляем в календарь
                    if (this.store.incomingNotes.length) {
                        this.matchNotes(day);
                    }
                    return day;
                }),
            });
        }
    }

    //
    // На предыдущий месяц
    public goBack() {
        this.calendarDate.subtract(1, 'M');
        this.initializeCalendar();
    }

    //
    // На следующий месяц
    public goForward() {
        this.calendarDate.add(1, 'M');
        this.initializeCalendar();
    }

    //
    // Назначение по клику активного дня для которого будут показываться заметки
    public setActiveDay(day: CalendarDay) {
        this.calendar.forEach(x => {
            x.days.forEach(x => {
                x.isActive = false;
            })
        })
        day.isActive = true;
        this.activeDay = day;
        this.callOrganizer.emit(this.activeDay);

    }

    //
    // Функция, вызываемая при событии выбора города в компоненте Weather
    public mathWeatherWithDates() {
        this.store.selectedWeather.forEach(weatherDay => {
            this.calendar.forEach(week => {
                // debugger;
                week.days.forEach(calendarDay => {
                    if (calendarDay.date.format('DD MMM YYYY') === weatherDay.date) {
                        calendarDay.high = weatherDay.high;
                        calendarDay.low = weatherDay.low;
                        calendarDay.text = weatherDay.text;
                    }
                })
            })
        })
    }

    //
    // Сопостовление с пришедшими с сервера заметками
    private matchNotes(day: CalendarDay) {
        this.store.incomingNotes.forEach(incomingNote => {
            if ((incomingNote.date === day.date.format('DD MMM YYYY'))) {
                if (incomingNote.notes) day.notes = incomingNote.notes;
                else day.notes = [];
            }
        })
    }
}
