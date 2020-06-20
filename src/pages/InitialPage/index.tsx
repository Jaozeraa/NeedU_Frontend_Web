import React from 'react'
import logo from '../../assets/logo.png'
import { FiBookOpen, FiLogIn } from 'react-icons/fi'
import { Link } from 'react-router-dom'

import './styles.css'

const InitialPage = () => {
    return (
        <div id="initial-page">
            <div className="content">
                <header>
                    <img src={logo} alt="NeedU"/>
                    <Link to="/signin-teacher" >
                        <span>
                            <FiLogIn />
                        </span>
                        <strong>Se torne um professor</strong>
                    </Link>
                </header>
                <main>
                    <h1>
                        Um novo conceito <br/>
                        de professores
                    </h1>
                    <p>
                        Aprenda com as pessoas que<br/>
                        aprendem todos os dias.
                    </p>
                    <Link to="/login">
                        <span>
                            <FiBookOpen />
                        </span>
                        <strong>Começar a aprender</strong>
                    </Link>
                </main>
            </div>
        </div>
    )
}

export default InitialPage