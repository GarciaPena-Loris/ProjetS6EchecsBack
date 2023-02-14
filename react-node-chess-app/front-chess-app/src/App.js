import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Acceuil from "./scenes/acceuil/Acceuil"
import Connexion from "./scenes/connexion/Connexion";


function App() {
  return (
    <div className="App">
      <header className="App-Header">
          <Connexion/>
      </header>
    </div>
  );
}
export default App;