import React from 'react';
import {database} from '../utils/firebase'
import Timer from './timer.component.jsx'
import StartGamePopUp from './startgamepopup.component.jsx'
import './gameboard.style.scss'

class GameBoard extends React.Component{
  constructor(props){
    super(props)
    this.creator = this.props.creator
    this.opponent = this.props.opponent
    this.state = {
       spinner: true,
       creatorReady: true,
       opponentReady: true,
       currentUserReady: true,
       gameOn: false,
       countdown: false,
       score: {creator: 0, opponent: 0},
       gameId: this.props.gameId,
       creatorInput: '',
       creatorInputSize: 0,
       gameCompleted: false
     }
  }

  endGame = () => {
    this.setState({
      gameCompleted: true
    })
  }

  closePopup = () =>{
    this.setState({
      startCountdown: false,
      gameOn: true
    })
  }

//Called on every new word from the opponent
  compareStrings = async (word) => {
    const creatorArray = this.state.creatorInput.split(" ")
    this.filterArrays(word, creatorArray ).then((result) => {
      database.ref('games/'+ this.props.gameId).update({
         creatorInput: result.creator,
         size: result.size
       }, this.setState({ 
          creatorInput: result.creator.trim(),
          creatorInputSize: result.size
       }))
    })
  }     

  // remove words from teh creator sentence
  filterArrays  = async (word, creatorArray) =>{
    const index = creatorArray.indexOf(word.trim())
    if (index !== -1) creatorArray.splice(index, 1)
    return {creator: creatorArray.join(" "), size: creatorArray.join("").length }
  }

  // Update creator input 
  updateInput = (e) =>{
    let newStateString = e.target.value
    const size = e.target.value.split(" ").join("").length
    // let newStateString = this.state.creatorInput + e.key
    // const size = newStateString.split(" ").join("").length
      database.ref('games/'+ this.props.gameId).update({
        creatorInput: newStateString,
        size: size
      })
  } 

  onPaste = (e) => {
    e.preventDefault()
    return false
  }

  

  startCountdown = () =>{
    this.setState({
      startCountdown: true
    }, () =>{
    })
  }


  // callback for destroyWord. Clean the user input
  cleanInput = (e) => {
    e.target.value = ''
  }

  //Called when the opponent press space
  destroyWord = (e, callback) => {
    if (e.keyCode !== 32) return
    const word = e.target.value
    this.compareStrings(word)
    callback(e)
  }






  readyToPlay = (e) =>{
    const userCreator = (this.props.currentUser.uid === this.creator)
    const user =  userCreator ? 'creatorReady' : 'opponentReady'
    database.ref('games/'+ this.props.gameId).update({
      [user]: true,
    }, this.setState({ 
      [user]: true,
      currentUserReady: true
    }))
  }

  componentDidMount(){
    const userCreator = (this.props.currentUser.uid === this.creator)
    if (userCreator) window.addEventListener('keydown', this.updateInput);
    database.ref('games/'+ this.props.gameId).orderByKey().on('child_changed', (update)=>{
      let key;
      if (update.key === "size"){
        key = "creatorInputSize"
      } else if (update.key === 'creatorInput'){
        key = 'creatorInput'
      } else if (update.key === 'creatorReady'){
        key = 'creatorReady'
      } else if (update.key === 'opponentReady'){
        key = 'opponentReady'
      }
      this.setState({
        [`${key}`]: update.val()
      }, ()=>{
      if(this.state.opponentReady && this.state.creatorReady && !this.state.gameOn){
        this.startCountdown()
      }
      })
    })
  }

 
  render(){
    return(
      <div className="game-board-container">
      {(!this.state.creatorReady || !this.state.opponentReady) ? 
        <StartGamePopUp onClick={this.readyToPlay} currentUserStatus={this.state.currentUserReady}/> : null
      }
      <p>{this.state.gameId}</p>
      <div className="number-box">{this.state.creatorInputSize} <span>chars</span></div>
      <div className="main-input-box">
        {this.state.creatorInput.split(" ").map((e,i) => <span key={i} className="word-span">{e}</span>)}
      </div>
        <h2 className="game-input-header">Type here 👇</h2>
        {
          (this.props.currentUser.uid === this.creator) ? 
            <input className="game-input" onChange={this.updateInput} value={this.state.creatorInput} onPaste={this.onPaste} /> :
            <input className="game-input" onPaste={this.onPaste} onKeyDown={(e) => this.destroyWord(e, this.cleanInput)}/>        
        }
      </div>
    )
  }
}

export default GameBoard

// {this.state.startCountdown ? <Timer closePopup={this.closePopup}/> : ''}
