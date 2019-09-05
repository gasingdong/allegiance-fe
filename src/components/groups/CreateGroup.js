import React, { useState, useEffect } from "react";
import useForm from "../utils/useForm";

import { Form, Button, Segment, Modal, Header, Message } from 'semantic-ui-react'
import { axiosWithAuth } from "../utils/axiosWithAuth";
import useGetToken from "../utils/useGetToken"
import { useSelector, useDispatch } from "react-redux"
import styled from "styled-components"
import { ADD_GROUP } from "../../reducers/userReducer"

const CreateGroup = props => {
    const loggedInUser = useSelector(state => state.userReducer.loggedInUser);
    const dispatch = useDispatch();
    const [isLoading, setLoading] = useState()
    const [modalOpen, setModal] = useState(false)
    const [isError, setError] = useState();


    //Fetches Auth0 token for axios call
    const [token] = useGetToken();


    //Imports form custom hook to handle state, form entry and form submission.
    const requestType = window.location.pathname === '/editgroup' ? editGroup : createGroup
    const { values, handleChange, handleSubmit, setValues } = useForm(requestType);

    //If in edit mode, sets group to equal props. Then sets form input values to the group's current info.
    const group = props.location.state ? props.location.state.group : null
    useEffect(() => {
        if (group && window.location.pathname === '/editgroup') {
            let { id, updated_at, created_at, ...groupInfo } = group
            setValues(groupInfo)
        }
    }, [props, setValues, group])

    //Creates a new group and pushes the user to the group page after submission.
    async function createGroup() {
        setLoading(true)
        try {
            setError(false)
            const newGroup = {
                ...values,
                creator_id: loggedInUser.id
            }
            const result = await axiosWithAuth([token]).post('/groups/', newGroup)
            console.log(result)
            const addedGroup = {
                name: result.data.newGroup.group_name,
                image: result.data.newGroup.image,
                id: result.data.newGroup.id,
                user_type: 'admin'
            }
            dispatch({ type: ADD_GROUP, payload: addedGroup })
            const push = () => {
                props.history.push(`/group/${result.data.newGroup.id}`)
            }

            setTimeout(push, 1000);
        }
        catch {
            setLoading(false)
            setError(true)
        }
    }


    //Edits existing group and pushes the user to the group page after submission.
    async function editGroup() {
        setLoading(true)
        try {
            setError(false)
            const updatedGroup = {
                ...values
            }
            const result = await axiosWithAuth([token]).put(`/groups/${group.id}`, updatedGroup)
            console.log(result)
            const push = () => {
                props.history.push(`/group/${group.id}`)
            }

            setTimeout(push, 1000);
        }

        catch {
            setLoading(false)
            setError(true)
        }
    }


    //Deletes a group.
    async function deleteGroup() {
        setLoading(true)
        try {
            setError(false)
            const result = await axiosWithAuth([token]).delete(`/groups/${group.id}`)
            console.log(result)
            const push = () => {
                props.history.push(`/profile`)
            }

            setTimeout(push, 1000)
        }
        catch {
            setLoading(false)
            setError(true)
        }
    }

    const privacy = values && values.privacy_setting ? values.privacy_setting.charAt(0).toUpperCase() + values.privacy_setting.slice(1) : null
    return (
        <Segment raised color='blue' style={{ width: '90%', margin: '1rem auto' }}>
            <Form onSubmit={handleSubmit} error>
                <BasicInfoHolder>
                    <Modal
                        open={modalOpen}
                        onClose={() => setModal(false)}
                        trigger={<GroupLogo onClick={() => setModal(true)} src={values.image || 'https://react.semantic-ui.com/images/wireframe/image.png'} />}>
                        <Header icon='image' content="Please enter your image's URL" />
                        <Modal.Content>
                            <Form.Input
                                fluid
                                onChange={handleChange}
                                value={values.image || ''}
                                name='image'
                                type='text' />
                            <Button color='green' onClick={() => setModal(false)}>Done</Button>
                        </Modal.Content>
                    </Modal>
                    <NameHolder>
                        <BoldInput
                            required
                            size='large'
                            style={{ marginLeft: '7px' }}
                            transparent
                            placeholder='Name Your Group'
                            onChange={handleChange}
                            value={values.group_name || ''}
                            name='group_name'
                            type='text'
                        />
                        <Form.Input
                            required
                            style={{ marginLeft: '7px' }}
                            transparent
                            placeholder='Group Slogan'
                            onChange={handleChange}
                            value={values.description || ''}
                            name='description'
                            type='text' />
                    </NameHolder>
                </BasicInfoHolder>
                <Form.Group widths='equal'>
                    <Form.Input
                        required
                        label='Zip Code'
                        placeholder='Zip Code'
                        minLength='5'
                        maxLength='5'
                        onChange={handleChange}
                        value={values.location || ''}
                        name='location'
                        type='text' />
                    <Form.Input
                        required
                        label='Acronym'
                        placeholder='Acronym'
                        maxLength='4'
                        onChange={handleChange}
                        value={values.acronym || ''}
                        name='acronym'
                        type='text' />
                </Form.Group>
                <Form.Field required label='Privacy Setting' onChange={handleChange} name='privacy_setting' control='select' defaultValue={values.privacy_setting || ''}>
                    {window.location.pathname === '/editgroup'
                        ? <option value={values.privacy_setting}>{privacy} </option>
                        : <option value='' disabled hidden>Choose Privacy setting...</option>}
                    {privacy !== "Public" || privacy !== undefined ? <option value='public'>Public</option> : null}
                    {privacy !== "Private" || privacy !== undefined ? <option value='private'>Private</option> : null}
                    {privacy !== "Hidden" || privacy !== undefined ? <option value='hidden'>Hidden</option> : null}
                </Form.Field>
                <div>
                    {isError
                        ? <Message
                            error
                            header="Failed to submit form"
                            content="Please make sure all fields are filled out accurately." />
                        : null}
                    {isLoading
                        ? <Button loading>Submit</Button>
                        : <Button type='submit'>Submit</Button>}
                    {window.location.pathname === '/editgroup'
                        ? <Modal closeIcon trigger={<Button color='red' type='button'>Delete Group</Button>} basic size='small'>
                            <Header icon='trash' content='Permanently Delete Group' />
                            <Modal.Content>
                                <p>
                                    Clicking Delete will permanently delete your group. Clicking the X will cancel the deletion.
                                </p>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button color='red' onClick={() => deleteGroup()}>
                                    Delete
                                </Button>
                            </Modal.Actions>
                        </Modal>
                        : null}
                </div>
            </Form>
        </Segment>
    )
}

const GroupLogo = styled.img`
	border-color: black;
    object-fit: cover;
    width: 80px;
    height: 80px;
    border-radius: 50%;
	border: 1px solid black;
    flex: 0 0 auto;`

const BasicInfoHolder = styled.div`
    display: flex;
    flex-direction: row;`

const NameHolder = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
`

const BoldInput = styled(Form.Input)`
input:first-child {
    font-weight: bold;
}`
export default CreateGroup
