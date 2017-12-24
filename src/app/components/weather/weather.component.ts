import {Component, EventEmitter, Output} from '@angular/core';
import {YqlService} from "../../service/yql.service";
import {WeatherPlaceModel} from "../../models/place.model";
import {isArray} from "util";
import {StoreService} from "../../service/store";

@Component({
    selector: 'app-weather',
    templateUrl: './weather.component.html',
    styleUrls: ['./weather.component.scss']
})
export class WeatherComponent {

    @Output()
    startMatchDates = new EventEmitter();

    public inputSearch: string;
    public placeOptions: WeatherPlaceModel[] = [];
    public showError = false;
    public error: any;

    private timer: any;

    constructor(private yql: YqlService,
                private store: StoreService) {
    }

    //
    // При каждом вводе включаем таймер
    public startTimer(event) {
        if (event.which === 8 && event.target.value === '') this.placeOptions = []

        // Фильтрация только символов
        if (event.which <= 90 && event.which >= 48) {

            clearTimeout(this.timer);

            this.timer = setTimeout(() => {
                this.yql.citySearch(event.target.value)
                    .then(results => {

                        //
                        // Проверка. Если пришел массив, то показвыаем доступные варианты. Если нет, то сразу запускаем
                        // Поиск по единственному варианту
                        if (isArray(results.query.results.place)) {
                            this.placeOptions = [];
                            results.query.results.place.forEach(place => {
                                this.placeOptions.push(
                                    new WeatherPlaceModel(place.name, place.woeid)
                                )
                            });
                            this.placeOptions[0].isActive = true;

                        }
                        if (results.query.results.place.woeid) {
                            this.startSearchByWoeid(results.query.results.place.woeid)
                        }
                    })
                    .catch(error => {
                        this.startShownError('Not found any city')
                    });
            })
        }
    }

    // Либо по Enter, либо по клику мыши, подставляем делаем строку выбранной (подсвечиваем), вставляем значение в input и запускаем поиск
    public getActiveWeather(place?: WeatherPlaceModel) {

        // для подсветки выбранного значения в случае клика мышкой
        let i: number;
        let indexActivePlace = this.placeOptions.findIndex((x) => x.isActive);

        if (place) {
            this.placeOptions[indexActivePlace].isActive = false;
            i = this.placeOptions.indexOf(place);
            this.placeOptions[i].isActive = true
        }
        if (!place) {
            i = this.placeOptions.findIndex((x) => x.isActive);
        }
        // Подставляем выбранный вариант в input
        this.inputSearch = this.placeOptions[i].name;
        this.startSearchByWoeid(this.placeOptions[i].woeid);

    }

    //
    // Меняем активный элемент по нажатию клавиш стрелочек
    public changeActive(direction) {
        if (this.placeOptions.length) {
            let i = this.placeOptions.findIndex((x) => x.isActive);
            this.placeOptions.forEach(x => x.isActive = false);
            if (direction === 'up') {
                if (i === 0) i = this.placeOptions.length;
                this.placeOptions[i - 1].isActive = true;
                return
            }
            if (direction === 'down') {
                if (i === this.placeOptions.length - 1) i = -1;
                this.placeOptions[i + 1].isActive = true;
                return
            }
        }
    }

    // Запуск поиска по выбранному городу
    private startSearchByWoeid(woeid) {
        this.yql.woeidSearch(woeid)
            .then(res => {
                this.store.selectedWeather = res.query.results.channel.item.forecast;
                this.placeOptions = [];
                this.startMatchDates.emit();
            }
            ).catch((error) => {
            this.startShownError('No data for this city');
        })
    }

    private startShownError(error) {
        this.error = error;
        this.showError = true;
        setTimeout(() => {
            this.showError = false;
        }, 2000);
    }
}
