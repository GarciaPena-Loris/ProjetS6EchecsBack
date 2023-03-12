import React from "react";
import './Nomenclature.css';
import '../../Components.css';
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
/*import { useState, useEffect } from 'react';                             ####En attente du back####
import axios from 'axios';*/

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

    //
    console.log(this.color);
    console.log(this.piece);
    console.log(this.move);
    //

    this.state.chess.clear(); // Vide le plateau
    this.state.chess.put({ type: this.piece, color: this.color }, this.move); // Place la pièce sur le plateau

    switch (this.movePieceObj[Object.keys(this.movePieceObj)[0]]) {
      case "wP":
        this.usePieceString = "";
        break;
      case "bP":
        this.usePieceString = "";
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
      //this.pointsgagnes=5;                                       ####En attente du back####
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
      //this.pointsgagnes=-5;                                        ####En attente du back####
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
    //this.handleUpdate();                                        ####En attente du back####
  }

  /*handleUpdate = async () => {                                               ####En attente du back####
    try {
      const response = await axios.put('back'/progressgame/change/:name/:id, { body:this.pointsgagnes });
      console.log(response.data);
    } catch (error) {
      console.error(error);                                                    ####En attente du back####
    }
  }*/

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