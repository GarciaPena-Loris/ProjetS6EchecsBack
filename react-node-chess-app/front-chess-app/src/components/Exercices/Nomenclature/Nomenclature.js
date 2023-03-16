import React from "react";
import './Nomenclature.css';
import '../../Components.css';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import axios from "axios";
import { decodeToken } from "react-jwt";


class Nomenclature extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      correctMessage: ' ',
      incorrectMessage: ' ',
      showCorrect: false,
      showIncorrect: false,
      chess: new Chess(),
    };
    this.pointsGagne = props.pointsGagnes;
    this.pointsPerdu = props.pointsPerdus;
    this.points = 0;
    this.idLevel = props.idLevel;
    this.usePieceString = [];

    // decode token
    const decoded = decodeToken(sessionStorage.token);
    this.name = decoded.name;

    this.genererPieceAleatoire();
  }

  genererPieceAleatoire = () => {
    const alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    this.state.chess.clear(); // Vide le plateau
    let colonneP = Math.floor(Math.random() * 8) + 1;
    let ligneP = Math.floor(Math.random() * 8) + 1;
    const colors = ['b', 'w'];
    let color = colors[Math.floor(Math.random() * colors.length)];
    const pieces = ['P', 'N', 'B', 'R', 'Q', 'K'];
    let piece = pieces[Math.floor(Math.random() * pieces.length)];
    let position = `${alpha[colonneP - 1]}${ligneP}`;

    this.usePieceString.push(piece + position);
    this.usePieceString.push(piece.toLowerCase() + position);
    this.state.chess.put({ type: piece, color: color }, position); // Place la pièce sur le plateau


  };

  handleInputChange = (event) => {
    this.setState({ inputValue: event.target.value });
  };


  handleClick = () => {
    const { inputValue } = this.state;
    if (this.usePieceString.includes(inputValue)) {
      const text = `Bonne réponse ! La pièce est en ${inputValue}, vous gagné ${this.pointsGagne} points.`;
      this.points = this.pointsGagne;
      this.setState({
        correctMessage: text,
        incorrectMessage: '',
        inputValue: '',
        showCorrect: true,
        showIncorrect: false
      });
    }
    else {
      let text = '';
      if (this.props.exerciceElo <= 0) {
        text = `Mauvaise réponse ! La pièce n'est pas en '${inputValue}', vous perdez 0 points.`;
        this.points = 0;
      }
      else {
        text = `Mauvaise réponse ! La pièce n'est pas en '${inputValue}', vous perdez ${this.pointsPerdu} points.`;
        this.points = -(this.pointsPerdu);
      }
      this.setState({
        incorrectMessage: text,
        correctMessage: '',
        inputValue: '',
        showCorrect: false,
        showIncorrect: true
      });
    }
    setTimeout(() => {
      this.setState({ showCorrect: false, showIncorrect: false });
    }, 8000); // Efface le message après 3 secondes
    setTimeout(() => {
      this.handleUpdate();
    }, 2000);
  }

  handleUpdate = () => {
    try {
      // chiffre un code crypte du type id_level/name/eloExerciceActuel/newelo(- or +)
      const CryptoJS = require("crypto-js");
      const message = this.idLevel + "/" + this.name + "/" + this.props.exerciceElo + "/" + this.points;
      const encrypted = CryptoJS.AES.encrypt(message, process.env.REACT_APP_CRYPTO_SECRET).toString();

      const formData = {
        'points': this.points,
        'encrypted': encrypted
      };
      var config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `http://localhost:3001/unlockLevel/save/${this.name}/${this.idLevel}`,
        headers: {
          'Authorization': `Bearer ${sessionStorage.token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: formData
      };
      axios(config)
        .then((response) => {
          // maj de l'elo
          this.props.setExerciceElo(response.data.newEloExercise);
          this.props.updateGlobalElo(response.data.newEloUser);

          // affichage nouvelle piece
          this.genererPieceAleatoire();
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <div className="container-general">
        <div className="jeu">
          <div className="plateau-gauche">
            <Chessboard
              position={this.state.chess.fen()}
              arePiecesDraggable={false}
            />
          </div>
          <div className="elements-droite">
            <i className="consigne">
              Ecrivez la position de la pièce
            </i>
            <input className="reponse-input"
              type="text"
              placeholder="Entrez la position..."
              value={this.state.inputValue}
              onChange={this.handleInputChange} />
            <button className="valider-bouton actual-bouton"
              onClick={this.handleClick}
              {...(this.state.inputValue.length < 3 && { disabled: true })}
            >
              Valider
            </button>
            {this.state.correctMessage &&
              <div className={`response correct-response ${this.state.showCorrect ? 'show' : ''}`}>
                {this.state.correctMessage}
              </div>
            }
            {this.state.incorrectMessage &&
              <div className={`response incorrect-response ${this.state.showIncorrect ? 'show' : ''}`}>
                {this.state.incorrectMessage}
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}
export default Nomenclature;