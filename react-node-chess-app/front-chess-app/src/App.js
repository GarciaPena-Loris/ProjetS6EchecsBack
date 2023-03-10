import React from "react";
import "./App.css";
import {Routes, Route } from 'react-router-dom';
import RequireAuth from "./components/RequireAuth/RequireAuth";
import Navbar from "./components/Navbar/Navbar";
import Accueil from "./components/Accueil/Accueil";
import Connexion from "./components/Connexion/Connexion";
import Inscription from "./components/Inscription/Inscription";
import SelectionExercices from "./components/SelectionExercices/SelectionExercices.js";
import NomenclaturePage from "./components/NomenclatureExo/NomenclatureExo";
import Nomenclature from "./components/Exercices/Nomenclature/Nomenclature";
import NomenclatureTROIS from "./components/Exercices/Nomenclature/NomenclatureTROIS";
import NomenclatureDEUX from "./components/Exercices/Nomenclature/NomenclatureDEUX";
import NomenclatureQuatre from "./components/Exercices/Nomenclature/NomenclatureQUATRE";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
          <Route path="/" element={<Accueil/>} />
          <Route path="/connexion" element={<Connexion/>} />
          <Route path="/inscription" element={<Inscription/>} />
          <Route path="/selectionExercices" element={RequireAuth(SelectionExercices)} />
          <Route path="/nomenclature" element={RequireAuth(NomenclaturePage)}/>
          <Route path="/Exercices/Nomenclature" element={RequireAuth(Nomenclature)}/>
          <Route path="/Exercices/NomenclatureDEUX" element={RequireAuth(NomenclatureDEUX)}/>
          <Route path="/Exercices/NomenclatureTROIS" element={RequireAuth(NomenclatureTROIS)}/>
          <Route path="/Exercices/NomenclatureQuatre" element={RequireAuth(NomenclatureQuatre)}/>
      </Routes>
    </div>
  );
}

export default App;