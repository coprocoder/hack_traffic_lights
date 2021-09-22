import React, {Component} from 'react';
import Map from './Map'

import { GetGeocoderData } from '../../../db/repository'

import './help_map.scss'

class HelpMap extends Component {
    constructor(props){
      super(props);
      this.state = {}
    }

    render(){
        return(
            <div className="helpMap-view">
                <Map />
                <MapGeocoder />
            </div>
        )
    }
}

class MapGeocoder extends Component {
    constructor(props){
      super(props);
      this.state = {}
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // отправить данные на сервер
        // получить ответ
        // отобразить на карте
    }

    handleChangeGeoQuery(e){
        console.log('handleChangeGeoQuery', e.target.value)
        GetGeocoderData(e.target.value)
            .then(resp => console.log('geodata', resp.data.hits))

        
    }

    render(){
        return(
            <form className="helpMap-geocoder" onSubmit={(e) => this.handleSubmit(e)}> 
                <input className="helpMap-geocoder-field" placeholder="Начальный адрес" onChange={e => this.handleChangeGeoQuery(e)}/>
                <input className="helpMap-geocoder-field" placeholder="Конечный адрес"  onChange={e => this.handleChangeGeoQuery(e)}/>
                <input type="submit" 
                    className="helpMap-geocoder-field" 
                    placeholder="Конечный адрес"
                    value="Построить машрут"
                />
            </form>
        )
    }

}

export default HelpMap;