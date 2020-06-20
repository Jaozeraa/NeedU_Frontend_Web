import React, { useState, useEffect } from 'react' 
import store from 'store'
import { useHistory } from 'react-router-dom'

import logo from '../../assets/logo.png'
import './styles.css'
import api from '../../services/api'

interface User {
    id: number
    age: number
    email: string
    name: string
    sex: string
    image: string
    city: string
    uf: string
    image_url: string
}

interface Teacher {
    id: number
    age: number
    name: string
    image: string
    image_url: string
    rate: number
}

const HomePage = () => {
    const history = useHistory()
    const [user, setUser] = useState<User[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([])

    useEffect(() => {
        setUser(store.get('user'))
    }, [])

    useEffect(() => {
        user.map(user => {
            api.get("teachers", {
                params: {
                    city: user.city,
                    uf: user.uf,
                    subjects: [1,2,3,4,5,6]
                }
            }).then(response => {
                setTeachers(response.data)
            })
        })
    }, [user])

    function handleExit() {
        history.push('/')
    }

    return (
        <div id="home-page">
            <div className="content">
                <header>
                    <img 
                        className="logo"
                        onClick={handleExit}
                        src={logo} 
                        alt="NeedU"/>
                    {user.map(user => (
                        <div 
                        className="user"
                        key={user.id}
                        >
                                <h3>Bem vind{user.sex!=="m" ? 'a' : 'o'}<strong> {user.name}</strong></h3>
                                <img src={user.image_url} alt="Foto"/>
                        </div>
                    ))}
                </header>
                <main>
                    {teachers.map(teacher => (
                        <div 
                        key={teacher.id}
                        className="teacher">
                            <img src={teacher.image_url} alt="Foto-professor"/>
                            <h3>{teacher.name}</h3>
                            <h4>{teacher.rate} Estrelas</h4>
                        </div>
                    ))}
                </main>
            </div>
        </div>
    )
}

export default HomePage