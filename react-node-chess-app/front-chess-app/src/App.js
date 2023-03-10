import React from "react";
import "./App.css";
import {Routes, Route } from 'react-router-dom';
import RequireAuth from "./components/RequireAuth/RequireAuth";
import Navbar from "./components/Navbar/Navbar";
import Accueil from "./components/Accueil/Accueil";
import Connexion from "./components/Connexion/Connexion";
import Inscription from "./components/Inscription/Inscription";
import SelectionExercices from "./components/SelectionExercices/SelectionExercices.js";
import Exercices from "./components/ExercicePage/ExercicePage";
import Niveaux from "./components/NiveauxPage/NiveauxPage";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
          <Route path="/" element={<Accueil/>} />
          <Route path="/connexion" element={<Connexion/>} />
          <Route path="/inscription" element={<Inscription/>} />
          <Route path="/selectionExercices" element={RequireAuth(SelectionExercices)} />
          <Route path="/exercices" element={RequireAuth(Exercices)}/>
          <Route path="/niveaux" element={RequireAuth(Niveaux)}/>
      </Routes>
    </div>
  );
}

export default App;