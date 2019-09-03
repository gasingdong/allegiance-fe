import React, { useState, useEffect } from "react"
import useForm from "../utils/useForm";
import { Form, Button, Segment } from 'semantic-ui-react'
import { axiosWithAuth } from "../utils/axiosWithAuth";
import useGetToken from "../utils/useGetToken"
import { useSelector } from "react-redux"

const CreateGroup = props => {
    const loggedInUser = useSelector(state => state.userReducer.loggedInUser);
    const [isLoading, setLoading] = useState()

    //Fetches Auth0 token for axios call
    const [token] = useGetToken();

    //Imports form custom hook to handle state, form entry and form submission.
    const requestType = props.location.state && props.location.state.editing === true ? editGroup : createGroup
    const { values, handleChange, handleSubmit, setValues } = useForm(requestType);

    async function createGroup() {
        setLoading(true)
        const newGroup = {
            ...values,
            creator_id: loggedInUser.id
        }
        const result = await axiosWithAuth([token]).post('/groups/', newGroup)
        const push = () => {
            props.history.push(`/group/${result.data.newGroup.id}`)
        }

        setTimeout(push, 1000)
    }

    async function editGroup() {
        setLoading(true)
        const updatedGroup = {
            ...values,
            creator_id: props.location.state.group.creator_id
        }
        const result = await axiosWithAuth([token]).put(`/groups/${props.location.state.group.id}`, updatedGroup)
        const push = () => {
            props.history.push(`/group/${props.location.state.group.id}`)
        }

        setTimeout(push, 1000)
    }

    useEffect(() => {
        if (props.location.state && props.location.state.group && props.location.state.editing === true) {
            let { id, creator_id, ...groupInfo } = props.location.state.group
            setValues(groupInfo)
        }
    }, [props, setValues])

    return (
        <Segment raised color='blue' style={{ width: '90%', margin: '1rem auto' }}>
            <Form onSubmit={handleSubmit}>
                <h1>Create a Group</h1>
                <Form.Input
                    label='Group Name'
                    placeholder='Group Name'
                    onChange={handleChange}
                    value={values.group_name || ''}
                    name='group_name'
                    type='text' />
                <Form.Input
                    label='Location'
                    placeholder='Location'
                    onChange={handleChange}
                    value={values.location || ''}
                    name='location'
                    type='text' />
                <Form.Field label='Privacy Setting' onChange={handleChange} name='privacy_setting' control='select' defaultValue={values.privacy_setting || ''}>
                    {props.location.state && props.location.state.editing === true
                        ? <option value={values.privacy_setting}>{values.privacy_setting}</option>
                        : <option value='' disabled hidden>Choose Privacy setting...</option>}
                    <option value='public'>Public</option>
                    <option value='private'>Private</option>
                    <option value='hidden'>Hidden</option>
                </Form.Field>
                <Form.Input
                    label='Acronym'
                    placeholder='Acronym'
                    onChange={handleChange}
                    value={values.acronym || ''}
                    name='acronym'
                    type='text' />
                <Form.Input
                    label='Description'
                    placeholder='Description'
                    onChange={handleChange}
                    value={values.description || ''}
                    name='description'
                    type='text' />
                <Form.Input
                    label='Group Image'
                    placeholder='Group Image'
                    onChange={handleChange}
                    value={values.image || ''}
                    name='image'
                    type='text' />
                {isLoading
                    ? <Button loading>Submit</Button>
                    : <Button type='submit'>Submit</Button>}
            </Form>
        </Segment>
    )
}

export default CreateGroup