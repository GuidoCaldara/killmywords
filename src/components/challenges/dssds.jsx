import React from 'react';
import ChallengePopUp from './challengepopup.component'
import ChallengeCard from './challengecard.component'
import {signInWithGoogle, signOut, database} from '../utils/firebase'


class Dashboard extends React.Component{
  constructor(props){
    super(props)
    this.currentUser = {...this.props.currentUser}
    this.state = {
      showPopUp: false,
      challenges: [],
      userChallenge: null,
      userGame: null
    }
  }
 
  startGame = (challenge) => {
    const game = {
      creator: challenge.creator,
      opponent: challenge.opponent,
      created_at: new Date(),
      started: false
    }
    var creator = database.ref('users/'+ challenge.creator + '/games/').push();
    var opponent = database.ref('users/'+ challenge.opponent + '/games/').push();
    creator.set(challenge);
    opponent.set(challenge);

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

    database.ref('users/'+ this.currentUser.uid + '/games/').orderByKey().on('child_added', (game)=>{
      this.setState({userGame: game})
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
    let page = null
    { this.setState.userGame ?
      page = <h1>Let's play</h1> :
      page = ( <div>
        <h2>Hey {this.currentUser.name}</h2>
        <h4>Open a challenge or Join an existing one</h4>
        <button onClick={() => this.setState({showPopUp: true})}>Add a new challenge</button>
        { this.state.showPopUp ? 
          <ChallengePopUp 
            onClick={this.createChallenge}
            closeModal={() => this.setState({showPopUp: false})}
          /> 
          : null }
          {this.state.challenges.map((challenge,i) =>
            <ChallengeCard key={i} 
              {...challenge}
              onClick={this.joinChallenge}
              currentUser={this.currentUser}
             />
          )}
      </div>
)
    }
    return(
      {page}
    )
  }
}

export default Dashboard