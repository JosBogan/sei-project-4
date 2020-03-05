import React from 'react'
import { Route, Redirect } from 'react-router-dom'

import Auth from '../../lib/auth'

const SecureRoute = ({ component: Component, ...rest }) => {
  if (Auth.isAuthenticated()) return <Route component={Component} {...rest} />
  Auth.logout()
  return <Redirect to="/" />
}

export default SecureRoute