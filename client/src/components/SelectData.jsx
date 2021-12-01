import React from 'react'
import {Form, FloatingLabel} from 'react-bootstrap'

const SelectData = props => {
    const changeHandler = e => {
        props.onChange(e.target.value)
    }

    return (
        <FloatingLabel controlId="floatingSelect" label="Previous Tests">
            <Form.Select onChange={changeHandler}>
                <option value="" key="0">Current Test</option>
                {props.tests.map( test => (
                    <option value={test._id} key={test._id}>{test.test_name}</option>
                ))}
            </Form.Select>
        </FloatingLabel>
    )
}

export default SelectData