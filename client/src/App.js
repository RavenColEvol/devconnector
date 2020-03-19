import React from 'react';
import { BrowserRouter as Router, Switch , Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Alert from './components/layout/Alert'

import { Provider } from 'react-redux'
import store from './store'

import './App.css';

const App = () => (
  <>
  <Provider store={store}>
    <Router>
      <Navbar/>
        <Route exact path='/' component={Landing}></Route>
        <section className="container">
          <Alert/>
          <Switch>
            <Route exact path='/login' component={Login}></Route>
            <Route exact path='/register' component={Register}></Route>
          </Switch>
        </section>
    </Router>
  </Provider>
  </>
)

export default App;