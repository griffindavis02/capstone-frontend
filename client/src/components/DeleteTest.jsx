import React, {useState} from 'react'
import { Modal, Form } from 'react-bootstrap'
import axios from 'axios'

const PushTest = (props) => {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [testName, setTestName] = useState("")
    const [allowDelete, setAllowDelete] = useState(false)

    const onChangeTestName = e => {
        setTestName(e.target.value)
        if (e.target.value === props.selectedTest.test_name) setAllowDelete(true)
        else setAllowDelete(false)
    }

    const onSubmit = e => {
        e.preventDefault()

        axios.delete(`/api/delete/${props.selectedTest._id}`)
        .then(res => console.log(res.data))
        .catch(err => console.error(err))

        setTestName("")
        setModalIsOpen(false)
        setAllowDelete(false)
        props.handler()
    }

    return (
        <div>
            <button type="button" className="btn btn-danger mx-1" onClick={() => setModalIsOpen(true)}>Delete Test</button>
            <Modal show={modalIsOpen} size="lg"
            onHide={() => setModalIsOpen(false)}
            aria-labelledby="contained-modal-title-vcenter"
            centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Delete Test "{props.selectedTest.test_name}"</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTestName">
                            <Form.Label>Type test name "{props.selectedTest.test_name}" to delete</Form.Label>
                                <Form.Control type="text" value={testName} onChange={onChangeTestName}></Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-secondary" onClick={()=>setModalIsOpen(false)}>Close</button>
                    {allowDelete ? 
                        <button type="button" className="btn btn-danger" onClick={onSubmit}>Delete Test</button>
                        : <button type="button" className="btn btn-danger" disabled={true}>Delete Test</button>
                    }
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default PushTest
