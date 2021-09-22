

import React, {Component, PropTypes} from 'react';
import Select from 'react-select';
import Search from 'react-search'
import ReactDOM from 'react-dom'

import Map from './Map'
import { 
    GetServerPoints,
    GetGeocoderData 
} from '../../db/repository'


import './map.scss'

class HelpMap extends Component {
    constructor(props){
      super(props);
      this.state = {
          points: []
      }
    }

    componentDidMount(){
        GetServerPoints()
            .then(resp => {
                console.log('GetServerPoints', resp)
                this.setState({
                    points: resp.data
                })
            })
    }

    render(){
        return(
            <div className="helpMap-view">
                <div id="map_coordinates" />
                <Map 
                    points_geoJson = {this.state.points}
                />
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

    componentDidUpdate(){
        console.log('state', this.state)
    }

    handleSubmit(e) {
        e.preventDefault();
        // console.log('handleSubmit', e)

        // отправить данные на сервер
        // получить ответ
        // отобразить на карте
        
    }

    getSelectAddrList = (value) => {
        // console.log('getSelectAddrList', value, value.length, !!value)
        GetGeocoderData(value)
            .then(resp => {
                console.log('geodata', resp)
                let items = []
                resp.data.hits.map( (res, i) => { 
                    items.push(Object.assign({}, 
                        res, 
                        { id: i, value: res.city + ', ' + res.name, label: res.city + ', ' + res.name })
                    )
                })
                this.setState({ addrList: items })
            })
    }

    render(){
        console.error(this.state.addrList)
        return(
            <form className="helpMap-geocoder" onSubmit={(e) => this.handleSubmit(e)}> 
                <Select
                    value={this.state.selectedAddrBegin}
                    onChange={item => this.setState({selectedAddrBegin: item})}
                    onInputChange={this.getSelectAddrList}
                    options={this.state.addrList}
                />
                <Select
                    value={this.state.selectedAddrEnd}
                    onChange={item => this.setState({selectedAddrEnd: item})}
                    onInputChange={this.getSelectAddrList}
                    options={this.state.addrList}
                />
                <input type="submit" 
                    className="helpMap-geocoder-field" 
                    value="Построить машрут"
                />
            </form>
        )
    }

}

export default HelpMap;