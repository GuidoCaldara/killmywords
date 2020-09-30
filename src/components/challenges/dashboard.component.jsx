import React from 'react';
import ChallengesList from './challengeslist.component'
import {database} from '../utils/firebase'
import GameBoard from '../game/gameboard.component'
import Spinner from '../spinner/spinner.component'
import './dashboard.style.scss'

class Dashboard extends React.Component{
  constructor(props){
    super(props)
    this.currentUser = {...this.props.currentUser}
    this.state = {
       spinner: false,
       userGame: null,
       gameDetails: null,
     }
  }
 


  startGame = (challenge) => {
    const game = {
      creator: challenge.creator,
      opponent: challenge.opponent,
      created_at: new Date(),
      started: false,
      attackReady: false,
      defenseReady: false,
      score: {[challenge.creator]: 0, [challenge.opponent]: 0},
      round: 1,

    }
    database.ref('games/').push(game).then((e)=> {
      database.ref('users/'+ challenge.creator + '/games/').push({...game, gameId: e.key})
      database.ref('users/'+ challenge.opponent + '/games/').push({...game, gameId: e.key})       
    })      
  }



  
  componentDidMount(){
    database.ref('users/'+ this.currentUser.uid + '/games/').orderByKey().on('child_added', (game)=>{
      this.setState({
        userGame: game.val(),
        spinner: false
      })
    })
  }

  createChallenge = (name) => {
    const challenge = {
      name: name,
      userName: this.currentUser.name,
      creator: this.currentUser.uid,
      created_at: new Date(),
      started: false
    }
    var newChallenge = database.ref('challenges/').push();
    newChallenge.set(challenge, () => this.setState({userChallenge: challenge}));
  }

  
  render(){
    const gameInfo = {...this.state.userGame, currentUser: this.props.currentUser }
    let page;
    if (this.state.spinner){
      page = <Spinner/>
    } else if (this.state.userGame){
      page = <GameBoard {...gameInfo} /> 
    } else {
      page = <ChallengesList startGame={this.startGame} currentUser={this.props.currentUser}/>
    }
    return(
      <div className="app-container">
        {page}
      </div>
    )
  }
}

export default Dashboard
