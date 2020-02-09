import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import './challenges.style.scss'
class ChallengePopUp extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      name: ''
    }
  }

  createChallenge = (e) =>{
    this.props.onClick(this.state.name)
    this.props.closeModal()
  }

  render(){
    return (
      <div className="challenge-popup-container">
        <div className="challenge-popup">
          <FontAwesomeIcon className="closeIcon" icon={faTimesCircle} onClick={this.props.closeModal} />
          <h1>Add a new challenge</h1>
          <input placeholder="Give a name to the challenge"type="text" onChange={(e) => this.setState({name: e.target.value})}/>
          <button className="button" type="button" onClick={this.createChallenge}>Add A Challenge</button>
        </div>
      </div>
    )
  }
}

export default ChallengePopUp