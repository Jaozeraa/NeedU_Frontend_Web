import React, { useState, ChangeEvent, FormEvent } from 'react'
import './styles.css'
import { Link, useHistory } from 'react-router-dom'
import { FiX } from 'react-icons/fi'
import store from 'store'
import api from '../../services/api'
import logo from '../../assets/logo.png'
import professor from '../../assets/professor.svg'
import aluno from '../../assets/aluno.svg'

const LogInPage = () => {
    const [checked, setChecked] = useState(false)
    const [exit, setExit] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const history = useHistory()

    function handleExit() {
        if(!exit) {
            setExit(true)
        } else {
            setExit(false)
        }
    }

    function handleSelectOption(id: string) {
        if(id === 'teacher') {
            return history.push('/signin-teacher')
        } 
            return history.push('/signin-user')
    }

    function handleCheck() {
        if(checked) {
            return setChecked(false)
        }
        return setChecked(true)
    }

    function handleBack() {
        return history.push('/')
    }

    function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value)
    }

    function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value)
    }

    function handleSubmit(event: FormEvent) {
        event.preventDefault()
        api.get("users", {
            params: {
                email,
                password
            }
        }).then(response => {
            console.log(typeof(response.data[0]))
            if(response.data[0]===undefined){
                api.get('teacher-auth', {
                    params: {
                        email,
                        password
                    }
                }).then(response => {
                    if(response.data[0]===undefined) {
                        alert('Email ou senha inválido')
                        return history.push('/')
                    }else{
                        store.set('user', response.data)
                        history.push('/home')
                    }
                })
            } else {
                store.set('user', response.data)
                history.push('/home')
            }
        })
    }

    return(
        <>
            <div id="login-page">
                <div className="content">
                    <header>
                        <img 
                            onClick={handleBack}
                            src={logo} 
                            alt="NeedU"/>
                    </header>
                    <main>
                        <h1>
                            Bem-vindo de<br/>
                            volta
                        </h1>
                        <form onSubmit={handleSubmit}>
                            <div className="field">
                                <label htmlFor="email">E-mail</label>
                                <input 
                                    onChange={handleEmailChange}
                                    type="text" 
                                    name="email" 
                                    id="email"
                                    placeholder="Seu e-mail"
                                    required
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="password">Senha</label>
                                <input 
                                    onChange={handlePasswordChange}
                                    type="password" 
                                    name="password" 
                                    id="password"
                                    placeholder="Sua senha"
                                    required
                                />
                            </div>
                            <div className="line1">
                                <div 
                                    className="check"
                                    onClick={handleCheck}
                                >
                                    <span>
                                        <span 
                                            className={checked ? "selected" : ""}
                                        />
                                    </span>
                                    <p>Mantenha-me conectado</p>
                                </div>
                                <Link to="#">
                                        Esqueci a senha
                                </Link>
                            </div>
                            <button type="submit">
                                <strong>Entrar</strong>
                            </button>
                            <div className="line2">
                                <p>Ainda não tem uma conta?</p>
                                <Link 
                                    to="#"
                                    onClick={handleExit}
                                >
                                    Cadastre-se
                                </Link>
                            </div>
                        </form>
                    </main>
                </div>
            </div>
            <div 
                id="modal"
                className={exit ? "hide" : ""}
            >
                <div className="content">
                    <div className="header">
                        <h1>Escolha seu tipo de cadastro</h1>
                        <Link 
                            to="#"
                            onClick={handleExit}
                        >
                            <span>
                                <FiX />
                            </span>
                            Fechar
                        </Link>
                    </div>
                    <main>
                        <div 
                            onClick={() => handleSelectOption('teacher')}
                            className="professor"
                        >
                            <label htmlFor="professor">Professor</label>
                            <img src={professor} alt="imagem-professor"/>
                        </div>
                        <div 
                            onClick={() => handleSelectOption('student')}
                            className="aluno"
                        >
                            <label htmlFor="aluno">Aluno</label>
                            <img src={aluno} alt="imagem-aluno"/>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}

export default LogInPage