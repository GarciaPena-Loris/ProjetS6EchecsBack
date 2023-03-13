import React from "react";
import './Nomenclature.css';
import '../../Components.css';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import axios from "axios";
import { decodeToken } from "react-jwt";


class Nomenclature extends React.Component {
  constructor(args) {
    super();
    this.state = {
      inputValue: '',
      correctMessage: ' ',
      incorrectMessage: ' ',
      showCorrect: false,
      showIncorrect: false,
      chess: new Chess(),
    };
    this.pointsGagne = args.pointsGagnes;
    this.pointsPerdu = args.pointsPerdus;
    this.points = 0;
    this.level = 1;
    this.color = '';
    this.piece = '';
    this.move = '';
    this.movePieceObj = {}; // Objet contenant la position de la pièce et la pièce
    this.usePieceString = '';

    this.genererPieceAleatoire();
  }



  genererPieceAleatoire = () => {
    const colors = ['b', 'w'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    const pieces = ['P', 'N', 'B', 'R', 'Q', 'K'];
    this.piece = pieces[Math.floor(Math.random() * pieces.length)];
    const moves = this.state.chess.moves({ piece: this.piece });
    this.move = moves[Math.floor(Math.random() * moves.length)];
    if (this.move.length > 2) {
      this.move = this.move.substring(1);
    }
    this.movePieceObj = {
      [this.move]: [this.color] + [this.piece]
    };

    this.state.chess.clear(); // Vide le plateau
    this.state.chess.put({ type: this.piece, color: this.color }, this.move); // Place la pièce sur le plateau

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
    console.log(bonneReponse);
    if (inputValue === bonneReponse) {
      const text = `Bonne réponse ! La pièce est en ${this.state.inputValue}, vous gagné ${this.pointsGagne} points.`;
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
      const text = `Mauvaise réponse ! La pièce n'est pas en '${this.state.inputValue}', vous perdez ${this.pointsPerdu} points.`;
      this.points = -(this.pointsPerdu);
      this.setState({
        incorrectMessage: text,
        correctMessage: '',
        inputValue: '',
        showCorrect: false,
        showIncorrect: true
      });
      setTimeout(() => {
        this.setState({ showIncorrect: false });
      }, 8000); // Efface le message après 3 secondes

    }
    setTimeout(() => {
      this.handleUpdate();
    }, 2000);
  }

  handleUpdate = async () => {
    try {
      // chiffre un code crypte du type id_level/name/eloActuel/newelo(- or +)
      var CryptoJS = require("crypto-js");
      const decoded = decodeToken(sessionStorage.token);
      const name = decoded.name;
      const global_elo = decoded.global_elo;
      const message = this.level + "/" + name + "/" + global_elo + "/" + this.points;
      const encrypted = CryptoJS.AES.encrypt(message, process.env.REACT_APP_CRYPTO_SECRET).toString();

      const formData = {
        'points': this.points,
        'encrypted': encrypted
      };
      var config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `http://localhost:3001/unlockLevel/save/${name}/${this.level}`,
        headers: {
          'Authorization': `Bearer ${sessionStorage.token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: formData
      };
      axios(config)
        .then(function (response) {
          console.log(response.data);

          // maj de l'elo, refraichissement de la page
        })
        .catch(function (error) {
          console.log(error.response);
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