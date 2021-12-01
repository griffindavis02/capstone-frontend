import React, {useState} from 'react'
import { Modal, Form, Row, Col } from 'react-bootstrap'
import axios from 'axios'

const PushTest = (props) => {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [testName, setTestName] = useState("")

    const onChangeTestName = e => {
        console.log(e.target.value)
        setTestName(e.target.value)
    }

    const onSubmit = e => {
        e.preventDefault()

        axios.post('/api/commit', {
            test_name: testName,
            user: props.user,
        })
        .then(res => console.log(res.data))
        .catch(err => console.error(err))

        setTestName("")
        setModalIsOpen(false)
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
                    {/* <form className="form-inline" onSubmit={onSubmit}>
                        <div className="col-md-12 form-group">
                            <label className="col-md-2 col-form-label" for="test_name">Name for Test: </label>
                            <input type="text" name="test_name" className="form-control col-sm-10" value={testName} onChange={onChangeTestName}/>
                        </div>
                    </form> */}
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" class="btn btn-secondary" onClick={()=>setModalIsOpen(false)}>Close</button>
                    <button type="button" class="btn btn-primary" onClick={onSubmit}>Push Test</button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default PushTest
