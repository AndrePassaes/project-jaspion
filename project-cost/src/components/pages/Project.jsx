import React from "react";

import styles from './Project.module.css'

import { useParams } from 'react-router-dom'
import { useState, useEffect} from 'react'

import Loading from "../layout/Loading";
import Container from "../layout/Container";
import Message from "../layout/Message";
import ProjectForm from "../project/ProjectForm";

function Project() {
    const { id } = useParams()
    
    const [project, setProject] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [message, setMessage] = useState()
    const [type, setType] = useState()

    useEffect(() => {

        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },
        }).then((resp) => resp.json())
        .then((data) => {
            setProject(data)
        })
        .catch(err => console.log)
        }, 300)
    }, [id])

    function editPost(project){
        setMessage('')

        //budget validation
        if (project.budget < project.cost) {
            setMessage('O orçamento não pode ser menor que o custo do projeto!')
            setType('error')
            return false            
        }

        fetch(`http://localhost:5000/projects/${project.id}`,{
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(project),
        })
        .then(resp => resp.json())
        .then((data)=> {
            setProject(data)
            setShowProjectForm(false)
            setMessage('Projeto atualizado com sucesso!')
            setType('success')
        })
        .catch(err => console.log(err))
    }

    function toggleProjectForm (){
        setShowProjectForm(!showProjectForm)
    }

    function toggleServiceForm (){
        setShowServiceForm(!showServiceForm)
    }

    return (
        <>
            {project.name ? (
                <div className={styles.project_details}>
                    <Container customClass="column">
                        {message && <Message type={type} msg={message}/>}
                        <div className={styles.details_container}>
                            <h1>projeto: {project.name}</h1>
                            <button className={styles.btn} onClick={toggleProjectForm}>
                                {!showProjectForm ? 'Editar Projeto' : 'Fechar'}
                            </button>
                            {!showProjectForm ? (
                                <div className={styles.project_info}> 
                                    <p>
                                        <span>Categoria:</span> {project.category.name}
                                    </p>
                                    <p>
                                        <span>Total de Orçamento</span> R${project.budget}
                                    </p>
                                    <p>
                                        <span>Total Utilizado: </span>R${project.cost}
                                    </p>
                                </div>
                            ) : (
                                    <div className={styles.project_info}>
                                        <ProjectForm handleSubmit={editPost} 
                                        btnText="Concluir edição" 
                                        projectData={project} />
                                    </div>
                            )}
                        </div>
                        <div className={styles.service_form_container}>
                            <h2>Adicione um serviço:</h2>
                            <button className={styles.btn} onClick={toggleServiceForm}>
                                {!showServiceForm ? 'Adicionar Serviço' : 'Fechar'}
                            </button>
                            <div className={styles.project_info}>
                                {showServiceForm && <div>formulário do serviço</div>}
                            </div>
                        </div>
                        <h2>Serviços</h2>
                        <Container customClass="start">
                            <p>Itens de serviços</p>
                        </Container>
                    </Container>
                </div>
            ) : (
                < Loading />
            )}
        </>
    )
    
}

export default Project