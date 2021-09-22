import React from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibnpheWNldiIsImEiOiJjazhudXZnaGMwMmIzM2RvM2N3MDl2dmNwIn0.cNCktRFle2xX3PsaB-l0MQ';

class Map extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            lng: 92.9,
            lat: 56,
            zoom: 9
        };
        this.points = []
        this.mapContainer = React.createRef();
    }

    componentDidMount() {

        const { lng, lat, zoom } = this.state;
        this.map = new mapboxgl.Map({
            container: this.mapContainer.current,
            style: 'mapbox://styles/nzaycev/cksl9h0iu09fy18pg7yeljl4q',
            center: [lng, lat],
            zoom: zoom,
            maxBounds: [[
                92.013069, 55.623443
            ], [
                93.919682, 56.673527
            ]]
        });

        this.map.on('move', () => {
            this.setState({
                lng: this.map.getCenter().lng.toFixed(4),
                lat: this.map.getCenter().lat.toFixed(4),
                zoom: this.map.getZoom().toFixed(2)
            });
        });

        this.map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                // When active the map will receive updates to the device's location as it changes.
                trackUserLocation: true,
                // Draw an arrow next to the location dot to indicate which direction the device is heading.
                showUserHeading: true
            })
        );


        this.map.on('load', () => {
            console.log('features', this.props.points_geoJson)

            // Светофоры на карте
            this.map.addSource('light_points', {
                type: 'geojson',
                data: this.props.points_geoJson
            })
            this.map.addLayer({
                id: 'light_points',
                type: 'circle',
                source: 'light_points',
                paint: {
                    'circle-radius': 4,
                    'circle-color': '#6f66a6'
                }
            })

            // Маршрут на карте
            this.map.addSource('route_path', {
                type: 'geojson',
                data: this.props.route_geoJson
            })
            this.map.addLayer({
                id: 'route_path',
                type: 'line',
                source: 'route_path',
                paint: {
                    'line-color': '#6f66a6',
                }
            })

            // Координаты
            this.map.on('mousemove', (e) => {
                document.getElementById('map-coordinates').innerHTML =
                    e.lngLat.lng.toFixed(4) + ' ' + e.lngLat.lat.toFixed(4);
            });
        })

        // === Маркеры на поинтах === 
        let areaPopup
        this.map.on('mouseenter', 'light_points', (e) => {
            console.log('mouseenter', e.features)
            let characteristics = e.features[0].properties.characteristics.replace('[', '').replace(']', '').split(',')
            characteristics = characteristics.map((ch_id, index) => {
                console.log('111', this.props.charts, ch_id)
                let ch = this.props.charts.filter(chart => chart.id == ch_id)[0]
                console.log('ch', ch)
                if (ch)
                    return `<li>${ch.name}</li>`
            })

            if (!!areaPopup == true)
                areaPopup.remove()
            areaPopup = new mapboxgl.Popup({
                closeOnClick: false,
                closeButton: false
            })
                .setLngLat(e.lngLat)
                .setHTML(`<ul>${characteristics}</ul>`)
                .addTo(this.map);
        })
        this.map.on('mouseleave', 'light_points', (e) => {
            if (!!areaPopup == true)
                areaPopup.remove()
        })

    }

    componentDidUpdate() {
        // console.log('componentDidUpdate', this.props)

        if (this.props.route_geoJson) {
            // console.log('this.props.route_geoJson', this.props.route_geoJson)
            this.map.getSource('route_path').setData(this.props.route_geoJson)
        }

    }

    render() {
        const { lng, lat, zoom } = this.state;
        return (
            <div className="map-overlay">
                <div id="map-coordinates" />
                <div className="sidebar">Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}</div>
                <div ref={this.mapContainer} className="map-container" />
            </div>
        );
    }

}

export default Map