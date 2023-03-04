import React from "react";
import "./App.css";
import {Routes, Route } from 'react-router-dom';
import Accueil from "./components/Accueil/Accueil";
import Connexion from "./components/Connexion/Connexion";
import Inscription from "./components/Inscription/Inscription";
import Nomenclature from "./components/Exercices/Nomenclature/Nomenclature";
import NomenclatureTROIS from "./components/Exercices/Nomenclature/NomenclatureTROIS";
import Puzzle from "./components/Exercices/Nomenclature/Puzzle/Puzzle";
import NomenclatureDEUX from "./components/Exercices/Nomenclature/NomenclatureDEUX";
import NomenclatureQuatre from "./components/Exercices/Nomenclature/NomenclatureQUATRE";


function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/" element={<Accueil/>} />
          <Route path="/connexion" element={<Connexion/>} />
          <Route path="/inscription" element={<Inscription/>} />
          <Route path="/Exercices/Nomenclature" element={<Nomenclature/>}/>
          <Route path="/Exercices/NomenclatureDEUX" element={<NomenclatureDEUX/>}/>
          <Route path="/Exercices/NomenclatureTROIS" element={<NomenclatureTROIS/>}/>
          <Route path="/Exercices/NomenclatureQuatre" element={<NomenclatureQuatre/>}/>
          <Route path="/Exercices/Puzzle/Puzzle" element={<Puzzle/>}/>
      </Routes>
    </div>
  );
}

export default App;