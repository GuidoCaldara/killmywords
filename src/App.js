import React from 'react';
import {auth} from './components/utils/firebase'
import Spinner from './components/spinner/spinner.component'
import Login from './components/login/login.component'
import Dashboard from './components/challenges/dashboard.component'
import './style/index.scss'

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      spinner: true,
      currentUser: null,
    }
  }
  unsubscribeFromAuth = null
  
  componentDidMount(){
    this.unsubscribeFromAuth = auth.onAuthStateChanged((user)=>{
        this.setState({
          spinner: false,
          currentUser: {
            uid: user.uid, 
            name: user.displayName, 
            email: user.email
          }
        })
    })
  }

  componentWillUnmount(){
    this.unsubscribeFromAuth()
  }

  render(){
    let page;
    if (this.state.spinner){
      page = <Spinner/>
    } else if (this.state.currentUser){
      page = <Dashboard currentUser={this.state.currentUser}/>
    } else {
      page = <Login/>
    }
    return (
      <div className="app">
        {page}
      </div>
    );
  }
}

export default App;
//      { this.state.currentUser ? <Dashboard currentUser={this.state.currentUser}/> :  }
