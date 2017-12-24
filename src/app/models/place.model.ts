export class WeatherPlaceModel {
    constructor(public name: string,
                public woeid: string,
                public isActive = false) {}
}
