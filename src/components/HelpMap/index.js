

import React, {Component, PropTypes} from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
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
    changeCat = (cat) => {
        GetServerPoints(cat)
            .then(resp => {
                console.log('GetServerPoints changeCat', resp)
                this.setState({points: resp.data}) 
            })
    }

    render(){
        // console.log('this.state.points', this.state.points)
        return(
            <div className="helpMap-view">
                <Map 
                    points_geoJson = {this.state.points}
                    route_geoJson = {this.state.route}
                    charts = {this.state.charts}
                />
                <MapGeocoder 
                    changeCat={this.changeCat}
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
        // console.log('geocoder addrList', this.state.addrList)
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
        // console.log('getSelectAddrList', value)
        return new Promise((resolve, reject) => GetGeocoderData(value)
            .then(resp => {
                // console.log('geodata', resp)
                let items = []
                resp.data.hits.map( (res, i) => { 
                    if(res.city == "Krasnoyarsk") {
                        let text = ''
                        // text = res.postcode ? text + res.postcode + ', ' : text
                        // text = res.state ? text + res.state + ', ' : text
                        // text = res.city ? text + res.city + ', ' : text 
                        text = res.street ? text + res.street + ', ' : text 
                        text = res.house_number ? text + res.house_number + ', ' : text 
                        // text = res.housenumber ? text + res.housenumber  : text 
                        text = res.name ? text + res.name : text 
                        
                        items.push(Object.assign({}, res, { id: i, value: text, label: text }))
                    }
                })
                this.setState({ addrList: items })
                resolve(items)
            })
        )
    }

    selectCategory(e){
        this.setState({ category: e.currentTarget.value})
        this.props.changeCat(e.currentTarget.value)
    }

    render(){
        console.log('geocoder addrList', this.state.addrList)
        // alert(this.state.addrList)

        let categories = this.state.categories.map((item) => {
            return <label key={item.id}>
                        <input name="category" type="radio" value={item.id} onChange={e => this.selectCategory(e)}
                        />{item.name}
                    </label>
        })

        return(
            <form className="helpMap-geocoder" onSubmit={(e) => this.handleSubmit(e)}>               
                <AsyncSelect
                    cacheOptions
                    defaultOptions
                    loadOptions={this.getSelectAddrList}
                    onInputChange={this.getSelectAddrList}
                    onChange={item => this.setState({selectedAddrBegin: item})}
                    isClearable
                />
                <AsyncSelect
                    cacheOptions
                    defaultOptions
                    loadOptions={this.getSelectAddrList}
                    onInputChange={this.getSelectAddrList}
                    onChange={item => this.setState({selectedAddrEnd: item})}
                    isClearable
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