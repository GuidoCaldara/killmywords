import React from 'react';
import './gameboard.style.scss'

const StartGamePopUp = (props) =>{
  return(
    <div className="challenge-popup-container">
      <div className="challenge-popup game-popup">
      {
        props.currentUserStatus ?
        <h1>Waiting for your opponent</h1> :
        (<div>
          <h1>Are you ready to fight?</h1>
          <button type="button" onClick={(e) => props.onClick(e)} className="button">Let's do it!</button>  
        </div>)
      }
          
      </div>
    </div>
  )
}
export default StartGamePopUp

