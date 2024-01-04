import styles from "./Map.module.css"
import {useNavigate, useSearchParams} from "react-router-dom";
import {MapContainer, TileLayer, Popup, Marker, useMap, useMapEvents} from 'react-leaflet'
import {useEffect, useState} from "react";
import {useCitites} from "../contexts/CitiesContext.jsx";
import {useGeolocation} from "../hooks/useGeolocation.js";
import Button from "./Button.jsx";
import {useUrlPosition} from "../hooks/useUrlPosition.js";


function Map() {

    const {cities} = useCitites(); // custom hook which calls context
    const [mapPosition, setMapPosition] = useState([12.971599, 77.594566]) // saving (lat, lng) data inside a useState()

    const {isLoading: isLoadingPosition, position: geolocationPosition, getPosition} = useGeolocation();

    const [mapLat, mapLng] = useUrlPosition();


    useEffect(function () {
        if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    }, [mapLat, mapLng]);

    useEffect(function () {
        if (geolocationPosition) setMapPosition([geolocationPosition.lat, geolocationPosition.lng])
    }, [geolocationPosition])

    return (

        <div className={styles.mapContainer}>
            {!geolocationPosition && <Button type="position" onClick={getPosition}>
                {isLoadingPosition ? "isLoading" : "use your position"}
            </Button>}
            <MapContainer center={mapPosition} zoom={13} scrollWheelZoom={true} className={styles.map}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                {cities.map(city => (
                    <Marker position={[city.position.lat, city.position.lng]} key={city.id}>
                        <Popup>
                            <span>{city.emoji}</span> <span>{city.cityName}</span>
                        </Popup>
                    </Marker>
                ))}

                <ChangeCenter position={mapPosition}/>
                <DetectClick/>

            </MapContainer>
        </div>


    )
}

function ChangeCenter({position}) {
    const map = useMap();
    map.setView(position);
    return null;
}

function DetectClick() {
    const navigate = useNavigate();
    useMapEvents({
        click: (e) => {
            console.log(e)
            navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
        },
    })
}

export default Map;
