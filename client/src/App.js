import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Alert from './components/layout/Alert'
import PrivateRoute from './components/routing/PrivateRoute'
import Dashboard from './components/dashboard'
import CreateProfile from './components/profile-form/CreateProfile'
import EditProfile from './components/profile-form/EditProfile'
import AddExperience from './components/profile-form/AddExperience'
import AddEducation from './components/profile-form/AddEducation'

import { Provider } from 'react-redux'
import store from './store'
import { loadUser } from './redux/actions/auth'
import setAuthToken from './util/setAuthToken'

import './App.css';

if (localStorage.getItem('token')) {
  setAuthToken(localStorage.getItem('token'))
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <>
      <Provider store={store}>
        <Router>
          <Navbar />
          <Route exact path='/' component={Landing}></Route>
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path='/login' component={Login}></Route>
              <Route exact path='/register' component={Register}></Route>
              <PrivateRoute exact path='/dashboard' component={Dashboard}></PrivateRoute>
              <PrivateRoute exact path='/create-profile' component={CreateProfile}></PrivateRoute>
              <PrivateRoute exact path='/edit-profile' component={EditProfile}></PrivateRoute>
              <PrivateRoute exact path='/add-experience' component={AddExperience}></PrivateRoute>
              <PrivateRoute exact path='/add-education' component={AddEducation}></PrivateRoute>
            </Switch>
          </section>
        </Router>
      </Provider>
    </>
  )
}

export default App;
