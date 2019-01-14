import {Injectable} from '@angular/core';

@Injectable()
export class YqlService {

    public citySearch(req): Promise<any> {
        return this.sendRequest(`SELECT name, woeid FROM geo.places(10s) WHERE text = "${req}*"`)
    }

    public woeidSearch(woeid): Promise<any> {
        return this.sendRequest(`SELECT item FROM weather.forecast WHERE woeid = ${woeid}`)
    }

    private sendRequest(yql): Promise<any> {
        return fetch(`https://query.yahooapis.com/v1/public/yql?q=${encodeURIComponent(yql)}&format=json`, {
            method: 'GET'
        }).then(response => {
            return response.json();
        });
    }


}
