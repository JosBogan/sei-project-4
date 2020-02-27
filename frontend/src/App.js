import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from './components/auth/Home'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route path={'/'} component={Home}/>
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default App
