import React from 'react';
import {signInWithGoogle, signOut} from '../utils/firebase'


const Login = () => { 
  return(
    <div>
      <h1>Login To Play</h1>
      <button onClick={signInWithGoogle}> SignIn</button>
    </div>
  )
}

export default Login