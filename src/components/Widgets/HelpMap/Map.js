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
        this.mapContainer = React.createRef();
    }

    componentDidMount() {
        const { lng, lat, zoom } = this.state;
        const map = new mapboxgl.Map({
            container: this.mapContainer.current,
            style: 'mapbox://styles/nzaycev/cksl9h0iu09fy18pg7yeljl4q',
            center: [lng, lat],
            zoom: zoom,
            maxBounds: [[
                92.013069, 55.623443
            ],[
                93.919682, 56.673527
            ]]
        });

        map.on('move', () => {
            this.setState({
            lng: map.getCenter().lng.toFixed(4),
            lat: map.getCenter().lat.toFixed(4),
            zoom: map.getZoom().toFixed(2)
            });
        });

        map.addControl(
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
    }

    render() {
        const { lng, lat, zoom } = this.state;
        return (
            <div className="map-overlay">
                <div className="sidebar">Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}</div>
                <div ref={this.mapContainer} className="map-container" />
            </div>
        );
    }

}

export default Map