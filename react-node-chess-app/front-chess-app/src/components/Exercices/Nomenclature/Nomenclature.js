import React from "react";
import './Nomenclature.css';
import '../../Components.css';
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
/*import { useState, useEffect } from 'react';                             ####En attente du back####
import axios from 'axios';*/

class Nomenclature extends React.Component {
  constructor() {
    super();
    this.state = {
      inputValue: '',
      correctMessage: '',
      incorrectMessage: '',
      chess: new Chess(),
    };
    this.colors = ['b', 'w'];
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.pieces = ['P', 'N', 'B', 'R', 'Q', 'K'];
    this.piece = this.pieces[Math.floor(Math.random() * this.pieces.length)];
    this.moves = this.state.chess.moves({ piece: this.piece });
    this.move = this.moves[Math.floor(Math.random() * this.moves.length)];
    if (this.move.length > 2) {
      this.move = this.move.substring(1);
    }
    this.movePieceObj = {
      [this.move]: [this.color] + [this.piece]
    };
    this.state.chess.clear()
    this.state.chess.put({ type: this.piece, color: this.color }, this.move)
    this.usePieceString = this.piece;
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
        this.usePieceString=this.movePieceObj[Object.keys(this.movePieceObj)[0]].substring(1);
        break;
    }
    //this.pointsgagnes=0;                                        ####En attente du back####

  }

  handleInputChange = (event) => {
    this.setState({ inputValue: event.target.value });
  };


  handleClick = () => {
    const { inputValue, chess } = this.state;
    const str = this.usePieceString + Object.keys(this.movePieceObj)[0];
    console.log(str);
    console.log(inputValue);
    if (inputValue === str) {
      const text = "Bravo c'était ça !";
      //this.pointsgagnes=5;                                       ####En attente du back####
      this.setState({ chess: chess, correctMessage: text, incorrectMessage: '', inputValue: '' });

    }
    else {
      const text = "NON ! TU ES NUL ! TOUT LE MONDE A REUSSI SAUF TOI !"
      //this.pointsgagnes=-5;                                        ####En attente du back####
      this.setState({ chess: chess, incorrectMessage: text, correctMessage: '', inputValue: '' });

    }
    this.handleUpdate();
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
      <div className="containerNom">
        <div className="chesscenter">
          <h2>Ecrivez le coup de la pièce</h2>
          <Chessboard
            position={this.state.chess.fen()}
            arePiecesDraggable={false}
            width={400}
          />
        </div>
        <div className="elementsDroite">
          <input id="saisieposition" type="text" placeholder="Entrez le coup..." value={this.state.inputValue} onChange={this.handleInputChange}></input>
          <button id="checkposition" onClick={this.handleClick}>Valider</button>
          <div id="correctMessage">{this.state.correctMessage} </div>
          <div id="incorrectMessage">{this.state.incorrectMessage} </div>
        </div>
      </div>
    );
  }
}
export default Nomenclature;