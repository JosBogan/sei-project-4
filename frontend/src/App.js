import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from './components/auth/Home'
import Project from './components/projects/Project'
import SecureRoute from './components/common/SecureRoute'
import UnSecureRoute from './components/common/UnSecureRoute'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <SecureRoute path={'/project-board'} component={Project} />
          <UnSecureRoute path={'/'} component={Home}/>
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default App
