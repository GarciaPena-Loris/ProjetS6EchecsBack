import React from "react";
import "./App.css";
import {Routes, Route } from 'react-router-dom';
import Accueil from "./components/Accueil/Accueil";
import Connexion from "./components/Connexion/Connexion";
import Inscription from "./components/Inscription/Inscription";
import Nomenclature from "./components/Exercices/Nomenclature/Nomenclature";
import NomenclatureDEUX from "./components/Exercices/Nomenclature/NomenclatureDEUX";

function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/" element={<Accueil/>} />
          <Route path="/connexion" element={<Connexion/>} />
          <Route path="/inscription" element={<Inscription/>} />
          {/* <Route path="/Exercices/Nomenclature" element={<Nomenclature/>}/> */}
          <Route path="/Exercices/NomenclatureDEUX" element={<NomenclatureDEUX/>}/>
      </Routes>
    </div>
  );
}

export default App;