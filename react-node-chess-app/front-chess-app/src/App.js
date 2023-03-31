import { React } from "react";
import "./App.css";
import { Routes, Route } from 'react-router-dom';
import { GlobalProvider } from './components/GlobalContext/GlobalContext';
import RequireAuth from "./components/RequireAuth/RequireAuth";
import UnRequireAuth from "./components/RequireAuth/UnRequireAuth";
import ErrorBoundary from "./components/RequireAuth/ErrorBoundary";
import Navbar from "./components/Navbar/Navbar";
import Accueil from "./components/Accueil/Accueil";
import NoPage from "./components/NoPage/NoPage";
import Connexion from "./components/Connexion/Connexion";
import Inscription from "./components/Inscription/Inscription";
import SelectionExercices from "./components/SelectionExercices/SelectionExercices.js";
import Exercices from "./components/ExercicePage/ExercicePage";
import Niveaux from "./components/NiveauxPage/NiveauxPage";
import Compte from "./components/Compte/Compte.js";

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <GlobalProvider>
        <Navbar />
        <Routes >
          <Route path="/" element={<Accueil />} />
          <Route path="/connexion" element={<UnRequireAuth component={Connexion}/>} />
          <Route path="/inscription" element={<UnRequireAuth component={Inscription} />} />
          <Route path="/selectionExercices" element={<RequireAuth component={SelectionExercices} />} />
          <Route path="/exercices" element={<RequireAuth component={Exercices} />} />
          <Route path="/niveaux" element={<RequireAuth component={Niveaux} />} />
          <Route path="/compte" element={<RequireAuth component={Compte} />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
        </GlobalProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;