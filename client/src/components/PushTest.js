import React, { useState } from 'react'
import { Modal, Form, Row, Col } from 'react-bootstrap'
import axios from 'axios'

const PushTest = (props) => {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [testName, setTestName] = useState("")

    const onChangeTestName = e => {
        setTestName(e.target.value)
    }

    const onSubmit = e => {
        e.preventDefault()
        console.log('posting')
        axios.post(`${props.api}/api/commit`, {
            test_name: testName,
            email: props.email,
        })
            .then(res => console.log(res.data))
            .catch(err => console.error(err))

        setTestName("")
        setModalIsOpen(false)
        props.handler()
    }

    return (
        <div>
            <button type="button" className="btn btn-primary" onClick={() => setModalIsOpen(true)}>Push Test</button>
            <Modal show={modalIsOpen} size="lg"
                onHide={() => setModalIsOpen(false)}
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Push Test Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row} className="mb-3" controlId="formTestName">
                            <Form.Label column sm={2}>Test Name: </Form.Label>
                            <Col sm={10}>
                                <Form.Control type="text" value={testName} onChange={onChangeTestName}></Form.Control>
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-secondary" onClick={() => setModalIsOpen(false)}>Close</button>
                    <button type="button" className="btn btn-primary" onClick={onSubmit}>Push Test</button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default PushTest
