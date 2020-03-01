import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from './components/auth/Home'
import Project from './components/projects/Project'
import SecureRoute from './components/common/SecureRoute'
import UnSecureRoute from './components/common/UnSecureRoute'
import NotFound from './components/common/NotFound'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <UnSecureRoute exact path={'/'} component={Home}/>
          <SecureRoute path={'/project-board'} component={Project} />
          <Route path="/*" component={NotFound} />
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default App
