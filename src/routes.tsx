import React from 'react'
import { Route , BrowserRouter } from 'react-router-dom'

import InitialPage from './pages/InitialPage'
import LogInPage from './pages/LogInPage'
import SignInTeacher from './pages/SignInTeacher'
import HomePage from './pages/HomePage'
import SignInUser from './pages/SigInUser'

const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={InitialPage} path="/" exact/>
            <Route component={LogInPage} path="/login"/>
            <Route component={SignInTeacher} path="/signin-teacher"/>
            <Route component={SignInUser} path="/signin-user"/>
            <Route component={HomePage} path="/home"/>
        </BrowserRouter>
    )
}

export default Routes