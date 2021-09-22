

import React, {Component, PropTypes} from 'react';
import Select from 'react-select';
import Search from 'react-search'
import ReactDOM from 'react-dom'

import Map from './Map'
import { 
    GetServerPoints,
    GetGeocoderData,
    GetRoute,
    GetCategories,
    GetCharts
} from '../../db/repository'


import './map.scss'

class HelpMap extends Component {
    constructor(props){
      super(props);
      this.state = {
      }
    }

    componentDidMount(){
        GetServerPoints()
            .then(resp => {
                console.log('GetServerPoints', resp)
                this.setState({points: resp.data})  
                GetCharts()
                    .then(resp => { console.log(resp.data); this.setState({charts: resp.data}) })      
            })

    }

    setRoute = (data) => {
        this.setState({ route: data })
    }

    render(){
        return(
            <div className="helpMap-view">
                <div id="map_coordinates" />
                <Map 
                    points_geoJson = {this.state.points}
                    route_geoJson = {this.state.route}
                    charts = {this.state.charts}
                />
                <MapGeocoder 
                    setRoute={this.setRoute}
                />
            </div>
        )
    }
}

class MapGeocoder extends Component {
    constructor(props){
      super(props);
      this.state = {
        categories: []
      }
    }

    componentDidMount(){
        GetCategories()
            .then(resp => this.setState({categories: resp.data}))
    }
    componentDidUpdate(){
        // console.log('state', this.state)
    }

    handleSubmit(e) {
        e.preventDefault();
        // console.log('handleSubmit e', e)
        // console.log('handleSubmit state', this.state)

        let req_data = {
            point_from: [this.state.selectedAddrBegin.point.lng, this.state.selectedAddrBegin.point.lat], 
            point_to: [this.state.selectedAddrEnd.point.lng, this.state.selectedAddrEnd.point.lat], 
            user_config: Number(this.state.category)
        }
        
        // отправить данные на сервер
        GetRoute(req_data)
            // получить ответ
            .then(resp => {
                // отобразить на карте
                // console.log('GetRoute resp', resp.data.paths[0].points)
                this.props.setRoute({
                    "type": "FeatureCollection",
                    "features": [
                        {
                        "type": "Feature",
                        "geometry": resp.data.paths[0].points
                        }
                    ]
                })
            })
    }

    getSelectAddrList = (value) => {
        // console.log('getSelectAddrList', value, value.length, !!value)
        GetGeocoderData(value)
            .then(resp => {
                // console.log('geodata', resp)
                let items = []
                resp.data.hits.map( (res, i) => { 
                    items.push(Object.assign({}, 
                        res, 
                        { 
                            id: i,  
                            label: res.city + ', ' + res.name 
                        })
                    )
                })
                this.setState({ addrList: items })
            })
    }

    onCatChanged = (e) => {
        this.setState({
            category: e.currentTarget.value
        });
    }

    render(){
        // console.log(this.state)

        let categories = this.state.categories.map((item, index ) => {
            return <label key={item.id}><input name="category" type="radio" value={item.id} onChange={this.onCatChanged}/>{item.name}</label>
        })

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
                {categories}
                <input type="submit" 
                    className="helpMap-geocoder-field" 
                    value="Построить машрут"
                />
            </form>
        )
    }

}

export default HelpMap;