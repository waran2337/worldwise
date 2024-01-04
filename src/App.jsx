import {useEffect, useState} from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

import Product from "./pages/Product.jsx";
import Homepage from "./pages/Homepage.jsx";
import Pricing from "./pages/Pricing.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import AppLayout from "./pages/AppLayout.jsx";
import Login from "./pages/Login";
import CityList from "./components/CityList.jsx";
import CountryList from "./components/CountryList";
import City from "./components/City.jsx";
import Form from "./components/Form.jsx";
import {CitiesProvider} from "./contexts/CitiesContext";
import {AuthProvider} from "./contexts/FakeAuthContext";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";


function App() {

    return (
        <AuthProvider>
            <CitiesProvider>
                <BrowserRouter>
                    <Routes>
                        <Route index element={<Homepage/>}/>
                        <Route path="product" element={<Product/>}/>
                        <Route path="pricing" element={<Pricing/>}/>
                        <Route path="login" element={<Login/>}/>
                        <Route path="app"
                               element={
                                   <ProtectedRoute>
                                       <AppLayout/>
                                   </ProtectedRoute>
                               }>
                            <Route index element={<Navigate replace to="cities"/>}/>
                            <Route path="cities" element={<CityList/>}></Route>
                            <Route path="cities/:id" element={<City/>}/>
                            <Route path="countries" element={<CountryList/>}/>
                            <Route path="form" element={<Form/>}/>
                        </Route>
                        <Route path="*" element={<PageNotFound/>}/>
                    </Routes>
                </BrowserRouter>
            </CitiesProvider>
        </AuthProvider>
    );
}

export default App;