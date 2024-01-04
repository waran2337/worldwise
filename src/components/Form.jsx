// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import {useEffect, useState} from "react";

import styles from "./Form.module.css";
import Button from "./Button.jsx";
import {useNavigate} from "react-router-dom";
import BackButton from "./BackButton.jsx";
import {useUrlPosition} from "../hooks/useUrlPosition.js";
import Message from "./Message.jsx";
import Spinner from "./Spinner.jsx";
// Date picker lib
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useCitites} from "../contexts/CitiesContext.jsx";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

export function convertToEmoji(countryCode) {
    const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

const flagemojiToPNG = (flag) => {
    var countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt()).map(char => String.fromCharCode(char - 127397).toLowerCase()).join('')
    return (<img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt='flag'/>)
}

function Form() {
    const navigate = useNavigate();
    const [cityName, setCityName] = useState("");
    const [country, setCountry] = useState("");
    const [date, setDate] = useState(new Date());
    const [notes, setNotes] = useState("");
    const [isLoadingGeoCoding, setIsLoadingGeoCoding] = useState(false);
    const [emoji, setEmoji] = useState("")
    const [geocodeingError, setGeocodingError] = useState("");

    const [lat, lng] = useUrlPosition(); // custom Hook
    const {createCity, isLoading} = useCitites();// function and state from context api

    useEffect(function () {
        if(!lat && !lng) return;

        async function fetchCityData() {
            try {
                setIsLoadingGeoCoding(true);
                setGeocodingError("");

                const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
                const data = await res.json();
                console.log(data);

                if (!data.countryCode) throw new Error("that doesn't seems to be a city. Click some where else 😏")

                setCityName(data.city || data.locality);
                setCountry(data.countryName);
                setEmoji(convertToEmoji(data.countryCode));

            } catch (err) {
                setGeocodingError(err.message)
            } finally {
                setIsLoadingGeoCoding(false);
            }
        }

        fetchCityData();
    }, [lat, lng])

    async function handleSubmit(e) {
        e.preventDefault();

        if(!cityName || !date) return;

        const newCity = {
            cityName,
            country,
            emoji,
            date,
            notes,
            position: {lat, lng},
        }

        await createCity(newCity);
        console.log(newCity);
        navigate(`/app/cities`);
    }

    if(!lat && !lng) return <Message message="Start by clicking on the map" />

    if (isLoadingGeoCoding) return <Spinner />

    if(geocodeingError) return <Message message={geocodeingError} />

    return (
        <form className={`${styles.form} ${isLoading? styles.loading : ""}`} onSubmit={handleSubmit}>
            <div className={styles.row}>
                <label htmlFor="cityName">City name</label>
                <input
                    id="cityName"
                    onChange={(e) => setCityName(e.target.value)}
                    value={cityName}
                />
                {<span className={styles.flag}>{flagemojiToPNG(emoji)}</span>}
            </div>

            <div className={styles.row}>
                <label htmlFor="date">When did you go to {cityName}?</label>
                <DatePicker id="date" selected={date} onChange={(date) => setDate(date)} dateFormat="dd/MM/yyyy"/>
            </div>

            <div className={styles.row}>
                <label htmlFor="notes">Notes about your trip to {cityName}</label>
                <textarea
                    id="notes"
                    onChange={(e) => setNotes(e.target.value)}
                    value={notes}
                />
            </div>

            <div className={styles.buttons}>
                <Button type="primary">Add</Button>
                <BackButton>Back</BackButton>
            </div>
        </form>
    );
}

export default Form;
