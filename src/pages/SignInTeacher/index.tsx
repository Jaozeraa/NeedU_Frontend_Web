import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import axios from 'axios'

import Dropzone from '../../components/Dropzone'
import logo from '../../assets/logo.png'
import api from '../../services/api'
import './styles.css'

interface Subject {
    id: number
    title: string
    image_url: string
}

interface IBGEUFResponse {
    sigla: string;
    nome: string
  }

  interface IBGECityResponse {
    nome: string;
  }

const SigInTeacher = () => {
    const history = useHistory()
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [ufs, setUfs] = useState<IBGEUFResponse[]>([])
    const [cities, setCities] = useState<string[]>([])
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: 0,
        description: '',
        password: ''
    })
    const [selectedUf, setSelectedUf] = useState<string>("0")
    const [selectedCity, setSelectedCity] = useState<string>("0")
    const [selectedSex, setSelectedSex] = useState<string>("0")
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])
    const [selectedSubjects, setSelectedSubjects] = useState<number[]>([])
    const [selectedFile, setSelectedFile] = useState<File>()

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords
            setInitialPosition([latitude, longitude])
        })
    }, [])

    useEffect(() => {
        api.get('subjects').then(response => {
            setSubjects(response.data)
        })
    }, [])

    useEffect(() => {
        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(response => {
            setUfs(response.data)
        })
    }, [])

    useEffect(() => {
        if(selectedUf !== "0") {
            axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
                .then(response => {
                    const cities = response.data.map(city => city.nome)
                    setCities(cities)
                })
        }
        return
    }, [selectedUf])

    function handleSelectSubjects(id: number) {
        const alreadySelected = selectedSubjects.findIndex(subject => subject === id)

        if (alreadySelected >= 0) {
            const filteredSubjects = selectedSubjects.filter(subject => subject !== id)
            setSelectedSubjects(filteredSubjects)
        } else {
            setSelectedSubjects([...selectedSubjects, id])
        }
    }

    function handleChangeUf(event: ChangeEvent<HTMLSelectElement>) {
        return setSelectedUf(event.target.value)
    }

    function handleChangeCity(event: ChangeEvent<HTMLSelectElement>) {
        return setSelectedCity(event.target.value)
    }

    function handleChangeSex(event: ChangeEvent<HTMLSelectElement>) {
        return setSelectedSex(event.target.value)
    }

    function handleSelectLocation(event: LeafletMouseEvent) {
        const { lat, lng }= event.latlng
        return setSelectedPosition([lat, lng])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target
        setFormData({...formData, [name]: value})
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()
        
        const { name, email, age, description, password } = formData
        const sex = selectedSex
        const uf = selectedUf
        const city = selectedCity
        const [latitude, longitude] = selectedPosition
        const subjects = selectedSubjects

        if(!selectedFile) {
            return alert('Selecione uma foto sua')
        }

        if(sex === '0') {
            return alert('Selecione seu sexo')
        }

        if(latitude === 0 && longitude === 0) {
            return alert('Coloque seu endereço no mapa clicando na sua localização')
        }

        if(selectedUf === '0') {
            return alert('Selecione seu estado')
        }

        if(selectedCity === '0') {
            return alert('Selecione sua cidade')
        }

        if(subjects[0] === undefined) {
            return alert('Selecione ao menos uma matéria que deseja ensinar')
        }

        const data = new FormData()
            data.append('name', name)
            data.append('email', email)
            data.append('age', String(age))
            data.append('password', password)
            data.append('sex', sex)
            data.append('description', description)
            data.append('uf', uf)
            data.append('city', city)
            data.append('latitude', String(latitude))
            data.append('longitude', String(longitude))
            data.append('subjects', subjects.join(','))
            data.append('image', selectedFile)

        await api.post('teachers', data)

        alert('Cadastrado com sucesso')
        history.push('/')
    }

    return (
        <div id="signin-page">
            <div className="content">
            <header>
                <img src={logo} alt="NeedU"/>
                <Link to='/'>
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>
                    Cadastro <br/>
                    Professor
                </h1>

                <Dropzone onFileUploaded={setSelectedFile}/>

                <fieldset>
                    <legend>
                        <h2>Seus dados</h2>
                    </legend>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="name">Nome completo</label>
                            <input 
                                onChange={handleInputChange}
                                type="text"
                                name="name"
                                id="name"
                                required
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="sex">Sexo</label>
                            <select 
                                value={selectedSex}
                                onChange={handleChangeSex}
                                name="sex" 
                                id="sex"
                            >
                                <option value="0">Selecione seu sexo</option>
                                    <option value="m">Masculino</option>
                                    <option value="f">Feminino</option>
                            </select>
                        </div>
                    </div>
                    <div className="field-group-input">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input 
                                onChange={handleInputChange}
                                type="email"
                                name="email"
                                id="email"
                                required
                            />
                        </div>
                        <div className="field">
                        <label htmlFor="age">Idade</label>
                        <input 
                            onChange={handleInputChange}
                            type="number"
                            name="age"
                            id="age"
                            required
                        />
                        </div>
                    </div>
                    <div className="field">
                    <label htmlFor="description">Descrição</label>
                            <input 
                                onChange={handleInputChange}
                                type="text"
                                name="description"
                                id="description"
                                required
                            />
                    </div>
                    <div className="field">
                    <label className="password" htmlFor="password">Senha</label>
                            <input 
                                onChange={handleInputChange}
                                type="password"
                                name="password"
                                id="password"
                                required
                            />
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione seu endereço no mapa</span>
                    </legend>
                        <Map 
                            onClick={handleSelectLocation}
                            center={initialPosition} 
                            zoom={15}
                        >
                            <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            < Marker position={selectedPosition}/>
                        </Map>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select 
                                value={selectedUf}
                                onChange={handleChangeUf}
                                name="uf" 
                                id="uf"
                            >
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option 
                                        key={uf.sigla}
                                        value={uf.sigla}>{uf.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select 
                                value={selectedCity}
                                onChange={handleChangeCity}
                                disabled={selectedUf === "0" ? true : false}
                                name="city" 
                                id="city"
                            >
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option
                                        key={city} 
                                        value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Matérias</h2>
                        <span>Selecione sua(s) matéria(s)</span>
                    </legend>

                    <ul className="items-grid">
                        {subjects.map(subject => (
                            <li 
                                key={subject.id} 
                                onClick={() => {handleSelectSubjects(subject.id)}}
                                className={selectedSubjects.includes(subject.id) ? 'selected' : ''}
                            >
                                <img src={subject.image_url} alt={subject.title}/>
                                <span>{subject.title}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>
                <button type="submit">
                    Cadastrar
                </button>
            </form>
            </div>
        </div>
    )
}

export default SigInTeacher