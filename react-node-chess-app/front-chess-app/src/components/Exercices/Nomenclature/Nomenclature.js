import React from "react";
import './Nomenclature.css';
import '../../Components.css';
import { useState } from 'react';
import {Chessboard} from 'react-chessboard'
import {Chess} from 'chess.js'
            

function Nomenclature() {
  const [chess] = useState(new Chess());
  const colors = ['b','w'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const pieces = ['P', 'N', 'B', 'R', 'Q', 'K'];
  const piece = pieces[Math.floor(Math.random() * pieces.length)];
  const moves = chess.moves({ piece: piece });
  var move = moves[Math.floor(Math.random() * moves.length)];
  if (move.length>2){
    move=move.substring(1);
  }
  console.log(move);
  const movePieceObj = {
    [move]: [color]+[piece]
  };
  console.log(movePieceObj);


  const [inputValue, setInputValue] = React.useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    console.log(inputValue);
  };


  return (
    <div className="container">
      <div className="chesscenter">
        <Chessboard
          position={movePieceObj}
          arePiecesDraggable={false}
          width={400}
        />
      </div>
      <input id="saisieposition" type="text" value={inputValue} onChange={handleInputChange}></input>
      <button id="checkposition">En es-tu bien sur?</button>
    </div>
  );
}

export default Nomenclature;