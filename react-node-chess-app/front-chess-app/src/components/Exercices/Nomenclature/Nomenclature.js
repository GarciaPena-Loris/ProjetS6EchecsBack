import React from "react";
import './Nomenclature.css';
import '../../Components.css';
import { useState } from 'react';
import {Chessboard} from 'react-chessboard'
import {Chess} from 'chess.js'
              
function Nomenclature() {
  const [game, setGame] = useState(new Chess());
  
 

  return (
    <div className="container">
      <div className="chesscenter">
        <Chessboard
            position="start"
            width={400}
            boardStyle={{
              borderRadius: "5px",
              boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
              marginLeft: "50px",
            }}
          />
      </div>
    </div>
  );
}

export default Nomenclature;