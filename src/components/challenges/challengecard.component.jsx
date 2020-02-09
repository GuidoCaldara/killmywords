import React from 'react'
import './challenges.style.scss'


const ChallengeCard = (props) => {
  return (
    <div className="challenge-card">
      <h4>{props.name}</h4>
      <p className="card-tagline creator">Creator:</p>
      <p>{props.userName}</p>
      <p className="card-tagline">best 4 out of 7</p>
      <button className='button small' onClick={() => {props.onClick(props)}}>Let's Fight!</button>
    </div>
  )
}

export default ChallengeCard