import {createContext, useContext, useEffect, useReducer} from "react";

const BASE_URL = 'http://localhost:9000';


const CitiesContext = createContext();

const initialState = {
    cities: [],
    isLoading: false,
    currentCity: {},
    error: "",
}

function reducer(state, action) {
    switch (action.type) {
        case "loading" :
            return {...state, isLoading: true}
        case "cities/loaded" :
            return {...state, isLoading: false, cities: action.payload}
        case "city/loaded" :
            return {...state, isLoading: false, currentCity: action.payload}
        case 'city/created' :
            return {
                ...state,
                isLoading: false,
                cities: [...state.cities, action.payload],
                currentCity: action.payload,

            }
        case 'city/deleted' :
            return {
                ...state,
                isLoading: false,
                cities: state.cities.filter((city) => city.id !== action.payload),
                currentCity: {},
            }
        case 'rejected' :
            return {...state, isLoading: false, error: action.payload}
        default:
            throw new Error("unKnown action type")
    }
}

function CitiesProvider({children}) {

    const [{cities, isLoading, currentCity, error}, dispatch] = useReducer(reducer, initialState)

    // const [cities, setCities] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);
    // const [currentCity, setCurrentCity] = useState({});

    /*  this state is for city.jsx comp to show the city details,
    but we also need this state to highlight the selected city from the citylist comp.
    so only we moved this state to context so that we gain axcess in multiple comp,
    or else we would have just used this state only in city comp  */

    useEffect(function () {
        async function fetchCities() {
            try {
                dispatch({type: "loading"});   //setIsLoading(true);
                const res = await fetch(`${BASE_URL}/cities`);
                const data = await res.json();
                console.log(data);
                dispatch({type: "cities/loaded", payload: data})  //setCities(data);
            } catch (e) {
                dispatch({type: "rejected", payload: "There was an error loading the cities..."});
            } /* finally {
                setIsLoading(false);
            }*/
        }

        fetchCities();
    }, []);

    async function getCity(id) {

        if(Number(id) === currentCity.id) return;

        try {
            dispatch({type: "loading"}) //setIsLoading(true);
            const res = await fetch(`${BASE_URL}/cities/${id}`);
            const data = await res.json();
            console.log(data);
            dispatch({type: 'city/loaded', payload: data})  //setCurrentCity(data);
        } catch (e) {
            dispatch({type: "rejected", payload: "There was an error loading the city..."});
        } /*finally {
            setIsLoading(false);
        }*/
    }

    async function createCity(newCity) {
        try {
            dispatch({type: "loading"}) //setIsLoading(true);
            const res = await fetch(`${BASE_URL}/cities`, {
                method: 'POST',
                body: JSON.stringify(newCity),
                headers: {
                    "Content-Type": "application/json",

                }
            });
            const data = await res.json();
            dispatch({type: 'city/created', payload: data})  //setCities(cities => [...cities, data]);

        } catch (e) {
            dispatch({type: "rejected", payload: "There was an error creating the city..."});
        } /*finally {
            setIsLoading(false);
        }*/
    }

    async function deleteCity(id) {
        try {
            dispatch({type: "loading"}) //setIsLoading(true);
            await fetch(`${BASE_URL}/cities/${id}`, {
                method: 'DELETE',
            });

            dispatch({type: 'city/deleted', payload: id});   //setCities((cities) => cities.filter((city) => city.id !== id));

        } catch (e) {
            alert("There was an error deleting city");
        } /*finally {
            setIsLoading(false);
        }*/
    }


    return (
        <CitiesContext.Provider
            value={{
                cities,
                isLoading,
                currentCity,
                getCity,
                createCity,
                deleteCity,
                error
            }}
        >
            {children}
        </CitiesContext.Provider>
    )
}

function useCitites() {
    const context = useContext(CitiesContext);

    if (context === undefined) throw new Error("CitiesContext was used outside the CitiesProvider")
    return context;
}

export {CitiesProvider, useCitites};