import React from 'react';
import './App.css';
/* router */
import { BrowserRouter as Router,Switch, Redirect,Route } from 'react-router-dom';
/* pages */
import Admin from './Features/Admin/Admin';

function App () {
  return (
    <Router>
      <div>
        <Switch >
          <Route path='/admin' >
            <Admin></Admin>
          </Route>
          <Route path='/'>
            <Redirect to='/admin/restaurant'></Redirect>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
