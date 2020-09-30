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
       score: {[this.creator]: 0, [this.opponent]: 0},
       round: 1,
       spinner: true,
       attackReady: false,
       defenseReady: false,
       gameOn: false,
       countdown: false,
       gameId: this.props.gameId,
       creatorInput: '',
       attackInputSize: 0,
       gameCompleted: false,
       attack: this.creator,
       defense: this.opponent
     }
  }

  endGame = (winner) => {
    let score = this.state.score
    score[winner] += 1
    database.ref('games/'+ this.props.gameId).update({
      score: score,
      round: this.state.round + 1,
      creatorInput: '',
      attackInputSize: '',
      attackReady: false,
      defenseReady: false,
      attack: this.state.defense,
      defense: this.state.attack
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
         attackInputSize: result.size
       }, this.setState({ 
          creatorInput: result.creator.trim(),
          attackInputSize: result.size
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
    let endGame = false
    let newStateString = e.target.value
    let size = e.target.value.split(" ").join("").length
    if (size > 20){
      newStateString = ''
      size = 0
      endGame = true
    }


      database.ref('games/'+ this.props.gameId).update({
        creatorInput: newStateString,
        attackInputSize: size
      }, () =>{
        if (endGame){
          this.endGame(this.state.attack)
        }
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


  readyToPlay = (isAttack) =>{
    const user =  isAttack ? 'attackReady' : 'defenseReady'
    // const userCreator = (this.props.currentUser.uid === this.creator)
    // const user =  userCreator ? 'attackReady' : 'defenseReady'
    database.ref('games/'+ this.props.gameId).update({
      [user]: true
    }, this.setState({ 
      [user]: true
    }))
  }

  componentDidMount(){
    const userCreator = (this.props.currentUser.uid === this.creator)
    database.ref('games/'+ this.props.gameId).orderByKey().on('child_changed', (update)=>{
      let key = update.key
      this.setState({
        [`${key}`]: update.val()
      }, ()=>{
      })
    })

    database.ref('games/'+ this.props.gameId).orderByKey().on('child_added', (update)=>{
      let key = update.key
      this.setState({
        [`${key}`]: update.val()
      }, ()=>{
      if(this.state.defenseReady && this.state.attackReady && !this.state.gameOn){
        this.startCountdown()
      } 
      })
    })

  }

 
  render(){
    const otherScore = Object.assign({}, this.state.score);
    delete otherScore[this.props.currentUser.uid];
    const value = Object.values(otherScore)[0]
    return(
      <div className="game-board-container">
      <div>Your score = {this.state.score[this.props.currentUser.uid]}</div>
      <div>Other score {value}</div> 
      {(!this.state.attackReady || !this.state.defenseReady) ? 
        <StartGamePopUp 
          onClick={this.readyToPlay} 
          attackReady={this.state.attackReady} 
          defenseReady={this.state.defenseReady}
          currentUser={this.props.currentUser.uid}
          userIsAttack={this.props.currentUser.uid === this.state.attack} /> 
          : null
      }

      {this.props.currentUser.uid === this.state.attack ? 'Attack' : 'Defense'}
      <p>{this.state.gameId}</p>
      <div className="number-box">{this.state.attackInputSize} <span>chars</span></div>
      <div className="main-input-box">
        {this.state.creatorInput.split(" ").map((e,i) => <span key={i} className="word-span">{e}</span>)}
      </div>
        <h2 className="game-input-header">Type here 👇</h2>
        {
          (this.props.currentUser.uid === this.state.attack) ? 
            <input className="game-input" onChange={this.updateInput} value={this.state.creatorInput} onPaste={this.onPaste} /> :
            <input className="game-input" onPaste={this.onPaste} onKeyDown={(e) => this.destroyWord(e, this.cleanInput)}/>        
        }
      </div>
    )
  }
}

export default GameBoard

// {this.state.startCountdown ? <Timer closePopup={this.closePopup}/> : ''}
