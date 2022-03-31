import React, { useState, useEffect } from 'react'
import { Form, FormCheck, Modal } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import axios from 'axios'

const AddAdmin = (props) => {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [adminStatus, setAdminStatus] = useState(false)
    const [nonAdmins, setNonAdmins] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])

    useEffect(() => {
        if (!adminStatus) getAdminStatus()
        if (!nonAdmins.length) getNonAdmins()
    })

    const getAdminStatus = async () => {
        const mongoUser = await axios.get(`${props.api}/user-management/get-user/${encodeURIComponent(props.user.email)}`)
        if (mongoUser.data.admin) setAdminStatus(true)
    }

    const getNonAdmins = async () => {
        const users = await axios.get(`${props.api}/user-management/get-non-admins`)
        setNonAdmins(users.data)
    }

    const onCheck = e => {
        if (e.target.checked) {
            setSelectedUsers([...selectedUsers, e.target.id])
        } else {
            setSelectedUsers([...selectedUsers].filter(el => {
                return el != e.target.id
            }))
        }
    }

    const onSubmit = e => {
        e.preventDefault()
        axios.post(`${props.api}/user-management/add-admins`, { _ids: selectedUsers })
        setNonAdmins([...nonAdmins].filter(el => {
            return !selectedUsers.includes(el._id)
        }))
        setSelectedUsers([])
        setModalIsOpen(false)
    }

    return (
        <div>
            {adminStatus && nonAdmins.length
                ? <div>
                    <button
                        type="button"
                        className="btn btn-outline-dark"
                        onClick={() => setModalIsOpen(true)}>Add Admins</button>
                    <Modal
                        show={modalIsOpen} size="lg"
                        onHide={() => setModalIsOpen(false)}
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter">
                                Add Administrators
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                {nonAdmins.map(user => {
                                    return (
                                        <FormCheck
                                            type="checkbox"
                                            id={user._id}
                                            key={user._id}
                                            label={user.email}
                                            onChange={onCheck}
                                        />
                                    )
                                })}

                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <button type="button" className="btn btn-secondary" onClick={() => setModalIsOpen(false)}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={onSubmit}>Give Admin Status</button>
                        </Modal.Footer>
                    </Modal>
                </div>
                : null}
        </div>
    )
}

const addUser = async (api, user) => {
    const existingUser = await axios.get(`${api}/user-management/get-user/${encodeURIComponent(user.email)}`)
    let update = {
        user: user.nickname,
        email: user.email,
        picture: user.picture,
        last_access: user.updated_at,
        admin: false
    }
    if (existingUser.data) update.admin = existingUser.data.admin
    axios.post(`${api}/user-management/add-update-user`, { update })
}

// const addAdmin = e => {

// }

export { addUser, AddAdmin }