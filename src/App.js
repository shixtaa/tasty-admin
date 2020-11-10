import React from 'react';
import './App.css';
/* router */
import { BrowserRouter as Router,Switch } from 'react-router-dom';

import PrivateRoute from './Common/PrivateRoute'
import {routerConfig} from './Router/index'
import _ from 'lodash'


function App () {
  
  function renderRouter (){
    return _.map(routerConfig,(item)=>{
      return <PrivateRoute { ...item } key={ Math.random() }></PrivateRoute>;
    });
  }
  return (
    <Router>
      <div>
        <Switch >
          {/* <Route path='/admin' >
            <Admin></Admin>
          </Route>
          <Route path='/'>
            <Redirect to='/admin/restaurant'></Redirect>
          </Route> */}
          {renderRouter()}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
