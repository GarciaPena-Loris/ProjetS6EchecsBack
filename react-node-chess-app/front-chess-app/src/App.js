import React from "react";
import "./App.css";
import { Routes, Route } from 'react-router-dom';
import RequireAuth from "./components/RequireAuth/RequireAuth";
import UnRequireAuth from "./components/RequireAuth/UnRequireAuth";
import ErrorBoundary from "./components/RequireAuth/ErrorBoundary";
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
      <ErrorBoundary>
        <Navbar />
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/connexion" element={<UnRequireAuth component={Connexion} />} />
          <Route path="/inscription" element={<UnRequireAuth component={Inscription} />} />
          <Route path="/selectionExercices" element={<RequireAuth component={SelectionExercices} />} />
          <Route path="/exercices" element={<RequireAuth component={Exercices} />} />
          <Route path="/niveaux" element={<RequireAuth component={Niveaux} />} />
          <Route path="*" element={<Accueil />} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default App;