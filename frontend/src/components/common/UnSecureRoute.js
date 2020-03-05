import React from 'react'
import { Route, Redirect } from 'react-router-dom'

import Auth from '../../lib/auth'

const UnSecureRoute = ({ component: Component, ...rest }) => {
  if (!Auth.isAuthenticated()) return <Route component={Component} {...rest} />
  return <Redirect to="/project-board/user" />
}

export default UnSecureRoute