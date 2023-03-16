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
    };
    this.chess = null;
    this.pointsGagne = props.pointsGagnes;
    this.pointsPerdu = props.pointsPerdus;
    this.points = 0;
    this.idLevel = 1;
    this.movePieceObj = {}; // Objet contenant la position de la pièce et la pièce
    this.usePieceString = '';

    // decode token
    const decoded = decodeToken(sessionStorage.token);
    this.name = decoded.name;

    this.genererPieceAleatoire();
  }

  genererPieceAleatoire = () => {
    this.chess = new Chess();
    const colors = ['b', 'w'];
    let color = colors[Math.floor(Math.random() * colors.length)];
    const pieces = ['P', 'N', 'B', 'R', 'Q', 'K'];
    let piece = pieces[Math.floor(Math.random() * pieces.length)];
    let moves = this.chess.moves({ piece: piece });
    let move = moves[Math.floor(Math.random() * moves.length)];
    if (move.length > 2) {
      move = move.substring(1);
    }
    this.movePieceObj = {
      [move]: [color] + [piece]
    };

    this.chess.clear(); // Vide le plateau
    this.chess.put({ type: piece, color: color }, move); // Place la pièce sur le plateau

    switch (this.movePieceObj[Object.keys(this.movePieceObj)[0]]) {
      case "wP":
        this.usePieceString = "P";
        break;
      case "bP":
        this.usePieceString = "P";
        break;
      case "bK":
        this.usePieceString = "K";
        break;
      case "bN":
        this.usePieceString = "N";
        break;
      case "bB":
        this.usePieceString = "B";
        break;
      case "bR":
        this.usePieceString = "R";
        break;
      case "bQ":
        this.usePieceString = "Q";
        break;
      default:
        this.usePieceString = this.movePieceObj[Object.keys(this.movePieceObj)[0]].substring(1);
        break;
    }
  };

  handleInputChange = (event) => {
    this.setState({ inputValue: event.target.value });
  };


  handleClick = () => {
    const { inputValue } = this.state;
    const bonneReponse = this.usePieceString + Object.keys(this.movePieceObj)[0];
    if (inputValue === bonneReponse) {
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
              position={this.chess.fen()}
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