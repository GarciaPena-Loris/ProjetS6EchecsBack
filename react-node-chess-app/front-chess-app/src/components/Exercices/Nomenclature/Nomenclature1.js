import React from "react";
import './Nomenclature.css';
import '../../Components.css';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import axios from "axios";
import { decodeToken } from "react-jwt";
import { Button, Stack } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChessKing as whiteKing,
  faChessQueen as whiteQueen,
  faChessRook as whiteRook,
  faChessBishop as whiteBishop,
  faChessKnight as whiteKnight,
  faChessPawn as whitePawn
} from '@fortawesome/free-regular-svg-icons'
import { Howl, Howler } from 'howler';

class Nomenclature extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      message: '',
      showCorrect: false,
      showIncorrect: false,
      chess: new Chess(),
    };
    this.pointsGagnes = props.pointsGagnes;
    this.pointsPerdus = props.pointsPerdus;
    this.points = 0;
    this.idExercice = props.idExercice;
    this.position = '';
    this.couleurCase = "#7e9d4e";
    this.usePieceString = [];

    // decode token
    const decoded = decodeToken(sessionStorage.token);
    this.name = decoded.name;

    // this.soundHover = new Howl({
    //   src: ['/sons/hover.mp3']
    // });
    this.soundHover = new Howl({
      src: ['/sons/fart.mp3']
    });
    this.soundDown = new Howl({
      src: ['/sons/clicdown.wav']
    });
    this.soundUp = new Howl({
      src: ['/sons/clicup.wav']
    });
    this.soundWin = new Howl({
      src: ['/sons/win.wav']
    });
    this.soundWrong = new Howl({
      src: ['/sons/evil.ogg']
    });
  }

  componentDidMount() {
    this.genererPieceAleatoire();
  }

  genererPieceAleatoire = () => {
    const { chess } = this.state;
    const alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    chess.clear(); // Vide le plateau
    let colonneP = Math.floor(Math.random() * 8) + 1;
    let ligneP = Math.floor(Math.random() * 8) + 1;
    const colors = ['b', 'w'];
    let color = colors[Math.floor(Math.random() * colors.length)];
    const pieces = ['P', 'N', 'B', 'R', 'Q', 'K'];
    let piece = pieces[Math.floor(Math.random() * pieces.length)];
    this.position = `${alpha[colonneP - 1]}${ligneP}`;

    this.usePieceString.push(piece + this.position);
    this.usePieceString.push(piece.toLowerCase() + this.position);
    chess.put({ type: piece, color: color }, this.position); // Place la pièce sur le plateau

    this.setState({ chess: chess });
  };

  // couleur des cases
  customSquare = React.forwardRef((props, ref) => {
    const { children, square, style } = props;
    if (square === this.position) {
      return (
        <div ref={ref} style={{ ...style, position: "relative", backgroundColor: this.couleurCase }}> {/* pièce qui mange */}
          {children}
        </div>
      );
    }
    else {
      return (
        <div ref={ref} style={{ ...style, position: "relative" }}>
          {children}
        </div>
      );
    }
  });

  handleInputChange = (event) => {
    this.setState({ inputValue: event.target.value });
  };

  handleClearButtonClick = () => {
    Howler.volume(0.3);
    this.soundUp.play();
    this.setState({ inputValue: '' });
  };

  handlePieceHover = () => {
    Howler.volume(1);
    this.soundHover.play();
  };

  handlePieceUp = (event) => {
    Howler.volume(0.3);
    this.soundUp.play();
    this.setState({ inputValue: this.state.inputValue + event });
  };

  handlePieceDown = () => {
    Howler.volume(0.3);
    this.soundDown.play();
  };


  handleClick = () => {
    Howler.volume(1);
    this.soundUp.play();
    const { inputValue } = this.state;
    if (this.usePieceString.includes(inputValue)) {
      Howler.volume(0.3);
      this.soundWin.play();
      const text = `Bonne réponse ! La pièce est en ${inputValue}, vous gagné ${this.pointsGagnes} points.`;
      this.points = this.pointsGagnes;
      this.setState({
        message: text,
        inputValue: '',
        showCorrect: true,
        showIncorrect: false
      });
    }
    else {
      Howler.volume(1);
      this.soundWrong.play();
      let text = `Mauvaise réponse ! La piéce était en ${this.usePieceString[0]}, vous perdez ${Math.min(this.props.exerciceElo, this.pointsPerdus)} points.`;
      this.points = -(Math.min(this.props.exerciceElo, this.pointsPerdus));
      this.setState({
        message: text,
        inputValue: '',
        showCorrect: false,
        showIncorrect: true
      });
    }
    setTimeout(() => {
      this.setState({ showCorrect: false, showIncorrect: false, message: '' });

      if (this.points !== 0)
        this.handleUpdate();
      else
        this.genererPieceAleatoire();
    }, 3000); // Efface le message après 3 secondes
  }

  handleUpdate = () => {
    try {
      // chiffre un code crypte du type idExercice/name/eloExerciceActuel/newelo(- or +)
      const CryptoJS = require("crypto-js");
      const message = this.idExercice + "/" + this.name + "/" + this.props.exerciceElo + "/" + this.points;
      const encrypted = CryptoJS.AES.encrypt(message, process.env.REACT_APP_CRYPTO_SECRET).toString();

      const formData = {
        'points': this.points,
        'encrypted': encrypted
      };
      var config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `http://localhost:3001/unlockLevel/save/${this.name}/${this.idExercice}`,
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

          // affichage nouvelle piece
          this.genererPieceAleatoire();
        });
    } catch (error) {
      console.error(error);
    }
  }

  piecesBlanchesNom = [
    "Pion", "Tour", "Fou", "Cavalier", "Reine", "Roi"
  ]
  piecesBlanchesIcon = [
    whitePawn, whiteRook, whiteBishop, whiteKnight, whiteQueen, whiteKing
  ]
  piecesBlanchesInput = [
    "P", "R", "B", "N", "Q", "K"
  ]
  lignes = [
    "8", "7", "6", "5", "4", "3", "2", "1"
  ];

  colonnes = [
    "a", "b", "c", "d", "e", "f", "g", "h"
  ]
  custom = [
    "x", "O-O", "O-O-O", "=", "e.p.", "+"
    // "x" pour la prise, "O-O" pour le petit roque, "O-O-O" pour le grand roque, 
    //"=" pour la promotion, "e.p." pour la prise en passant, "+" pour le mat
  ]
  customCoup = [
    "prise", "petit roque", "grand roque", "promotion", "prise en passant", "mat"
  ]

  render() {
    return (
      <div className="container-general">
        <div className="plateau-gauche">
          <Chessboard
            key="board"
            position={this.state.chess.fen()}
            arePiecesDraggable={false}
            customSquare={this.customSquare}
          />
        </div>
        <div className="elements-droite">
          <i className="consigne">
            Ecrivez la position de la pièce
          </i>
          <div className="boutons">
            <div className="groupe-butons" >
              {this.piecesBlanchesIcon.map((line, index) => { // pion tour fou cavalier reine roi
                return (
                  <button className={`pushable ${(index % 2) ? 'pushable-clair' : 'pushable-fonce'}`}
                    key={this.piecesBlanchesNom[index]}
                    title={this.piecesBlanchesNom[index]}
                    onMouseEnter={() => this.handlePieceHover()}
                    onMouseUp={() => this.handlePieceUp(this.piecesBlanchesInput[index])}
                    onMouseDown={() => this.handlePieceDown()}>
                    <span className={`front ${(index % 2) ? 'fronts-clair' : 'fronts-fonce'}`}>
                      <FontAwesomeIcon icon={line} />
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="groupe-butons">
              {this.colonnes.map((line, index) => { // a b c d e f g h
                return (
                  <button className={`pushable ${(index % 2) ? 'pushable-clair' : 'pushable-fonce'}`}
                    key={line}
                    title={line}
                    onMouseEnter={() => this.handlePieceHover()}
                    onMouseUp={() => this.handlePieceUp(line)}
                    onMouseDown={() => this.handlePieceDown()}>
                    <span className={`front ${(index % 2) ? 'fronts-clair' : 'fronts-fonce'}`}>
                      {line}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="groupe-butons" >
              {this.lignes.map((line, index) => { // 1 2 3 4 5 6 7 8
                return (
                  <button className={`pushable ${(index % 2) ? 'pushable-fonce' : 'pushable-clair'}`}
                    key={line}
                    title={line}
                    onMouseEnter={() => this.handlePieceHover()}
                    onMouseUp={() => this.handlePieceUp(line)}
                    onMouseDown={() => this.handlePieceDown()}>
                    <span className={`front ${(index % 2) ? 'fronts-fonce' : 'fronts-clair'}`}>
                      {line}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="groupe-butons" >
              {this.custom.map((line, index) => { // x O-O O-O-O = e.p. +
                return (
                  <button className={`pushable ${(index % 2) ? 'pushable-clair' : 'pushable-fonce'}`}
                    key={line}
                    title={this.customCoup[index]}
                    onMouseEnter={() => this.handlePieceHover()}
                    onMouseUp={() => this.handlePieceUp(line)}
                    onMouseDown={() => this.handlePieceDown()}>
                    <span className={`front custom ${(index % 2) ? 'fronts-clair' : 'fronts-fonce'}`}>
                      {line}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="input">
            <Stack key="stack" spacing={2} direction="row" alignItems="center">
              <input className="reponse-input"
                type="text"
                placeholder="Entrez la position..."
                value={this.state.inputValue}
                onChange={this.handleInputChange} />
              <button className="bouton-3D button-clean"
                key="clean"
                title="supprimer"
                onMouseDown={() => this.handlePieceDown()}
                onMouseEnter={() => this.handlePieceHover()}
                onClick={this.handleClearButtonClick}>
                <span className="texte-3D texte-clean">
                  ✕
                </span>
              </button>
            </Stack>

            <button className="bouton-3D"
              key="valider"
              title="Valider"
              {...(this.state.inputValue.length < 3 && { disabled: true })}
              onMouseEnter={() => this.handlePieceHover()}
              onMouseUp={this.handleClick}
              onMouseDown={() => this.handlePieceDown()}>
              <span className="texte-3D">
                Valider
              </span>
            </button>
          </div>
          <div className={`response ${this.state.showCorrect ? 'show' : this.state.showIncorrect ? 'show incorrect' : ''}`}>
            {this.state.message}
          </div>
        </div>
      </div>
    );
  }
}
export default Nomenclature;