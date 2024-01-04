
import styles from "./CityList.module.css";
import CityItem from "./CityItem.jsx";
import Spinner from "./Spinner.jsx";
import Message from "./Message.jsx";
import {useCitites} from "../contexts/CitiesContext.jsx";
import {useEffect} from "react";

function CityList() {
    const {cities, isLoading} = useCitites(); // from cities Context


    if(isLoading) return <Spinner />;

    if(!cities.length) return (
        <Message message="Add your frist city by clicking on a city on the map" />
    )
    return (
        <ul className={styles.cityList}>
            {cities.map(city => <CityItem city={city} key={city.id} />)}
        </ul>
    )
}



export default CityList;
    