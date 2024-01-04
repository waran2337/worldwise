import styles from "./City.module.css";
import {useParams, useSearchParams} from "react-router-dom";
import {useCitites} from "../contexts/CitiesContext.jsx";
import {useEffect} from "react";
import Spinner from "./Spinner.jsx";
import BackButton from "./BackButton.jsx";

const formatDate = (date) =>
    new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "long",
    }).format(new Date(date));

const flagemojiToPNG = (flag) => {
    var countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt()).map(char => String.fromCharCode(char - 127397).toLowerCase()).join('')
    return (<img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt='flag'/>)
}


function City() {
    const {id} = useParams(); // used to access param in URL
    const {getCity, currentCity, isLoading} = useCitites();   // state values fom context.

    // fetching current city details data from the getCity() which is stored in the Context.
    useEffect(function () {
        getCity(id);
    }, [id]);


    const {cityName, emoji, date, notes} = currentCity;

    if (isLoading) return <Spinner/>

    return (
        <div className={styles.city}>
            <div className={styles.row}>
                <h6>City name</h6>

                <h3>
                    <span>{emoji}</span> {cityName}
                </h3>
            </div>

            <div className={styles.row}>
                <h6>You went to {cityName} on</h6>
                <p>{formatDate(date || null)}</p>
            </div>

            {notes && (
                <div className={styles.row}>
                    <h6>Your notes</h6>
                    <p>{notes}</p>
                </div>
            )}

            <div className={styles.row}>
                <h6>Learn more</h6>
                <a
                    href={`https://en.wikipedia.org/wiki/${cityName}`}
                    target="_blank"
                    rel="noreferrer"
                >
                    Check out {cityName} on Wikipedia &rarr;
                </a>
            </div>

            <div><BackButton /></div>
        </div>
    );
}

export default City;
