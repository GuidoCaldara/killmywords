import React from 'react';
import ChallengePopUp from './challengepopup.component'
import ChallengeCard from './challengecard.component'
import {signInWithGoogle, signOut, database} from '../utils/firebase'

// there is a typo, it's not "ChellengesList" but "ChallengesList"
class ChellengesList extends React.Component{
  constructor(props){
    super(props)
    this.currentUser = {...this.props.currentUser}
    this.state = {
      showPopUp: false,
      challenges: [],
      userChallenge: null,
    }
  }

  startGame = (challenge) => {
    this.props.startGame(challenge)
  }

  joinChallenge = (challenge) => {
    const id = challenge.id
    const final_challenge ={
      opponent: challenge.currentUser.uid,
      updated_at: new Date()
    }
    let updates = {}
    updates['/challenges/' + id ] = challenge;
    database.ref('/challenges/' + id).update(final_challenge, (e) => this.startGame({...challenge, ...final_challenge, onClick: null, currentUser: null}))
  }

  componentDidMount(){
    database.ref('challenges/').orderByKey().on('child_added', (challenge)=>{
      const challenges = this.state.challenges
      let key = challenge.key
      challenge = challenge.val()

      challenge.id = key
      challenges.push(challenge)
      this.setState({
        challenges: challenges
      }, () => {console.log(this.state)})
    });
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

    return(
      <div>
        <h2>Hey {this.currentUser.name}</h2>
        <div className="challenges-lsit-title-box">
          <h4>Join an existing challenge or open a new one </h4>
          <button className="button" onClick={() => this.setState({showPopUp: true})}>Add a new challenge</button>
        </div>
          { this.state.showPopUp ?
          <ChallengePopUp
            onClick={this.createChallenge}
            closeModal={() => this.setState({showPopUp: false})}
          />
          : null }
          <div className="challenges-list-container">
            {this.state.challenges.map((challenge,i) =>
              <ChallengeCard key={i}
                {...challenge}
                onClick={this.joinChallenge}
                currentUser={this.currentUser}
              />
            )}
          </div>
      </div>
    )
  }
}

export default ChellengesList
