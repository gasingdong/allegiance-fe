import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as types from 'actions/actionTypes'
import { editGroup, createGroup, deleteGroup } from 'actions'

// // import { Mixpanel } from '../analytics/Mixpanel'

import useForm from '../utils/useForm'
import useImageUploader from '../utils/useImageUploader'
import useGetToken from '../utils/useGetToken'
import { axiosWithAuth } from '../utils/axiosWithAuth'
import DeleteGroup from './DeleteGroup'

import { Form, Icon, Modal, Segment } from 'semantic-ui-react'
import styled from 'styled-components'
import Default from '../../assets/walter-avi.png'

const CreateGroup = props => {
  const loggedInUser = useSelector(state => state.userReducer.loggedInUser)
  const dispatch = useDispatch()

  //Fetches Auth0 token for axios call
  const [token] = useGetToken()

  //Imports image upload functions
  const { image, UploaderUI, modalOpen, setModal } = useImageUploader()

  //Imports form custom hook to handle state, form entry and form submission.
  const requestType = window.location.pathname.includes('/editgroup/')
    ? handleGroupEdit
    : handleGroupCreation
  const {
    values,
    handleChange,
    handleSubmit,
    setValues,
    SubmitButton,
    ErrorMessage,
    setError,
    setLoading,
  } = useForm(requestType)

  //If in edit mode, sets group to equal props. Then sets form input values to the group's current info.
  const group = props.location.state ? props.location.state.group : null
  useEffect(() => {
    // window.location.pathname === '/creategroup' &&
    // Mixpanel.activity(loggedInUser.id, 'Start Create Group')
    if (group && window.location.pathname.includes('/editgroup/')) {
      let { id, updated_at, created_at, ...groupInfo } = group
      setValues(groupInfo)
      // Mixpanel.activity(loggedInUser.id, 'Start Edit Group')
    }
  }, [setValues, dispatch])

  //Creates a new group and pushes the user to the group page after submission.
  async function handleGroupCreation() {
    // try {

    const newGroup = {
      ...values,
      image: image || Default,
      creator_id: loggedInUser.id,
    }
    await dispatch(createGroup(newGroup)).then(res => {
      props.history.push(`/group/${res.id}`)
    })
    // const result = await axiosWithAuth([token]).post('/groups/', newGroup)
    // const addedGroup = {
    //   name: result.data.newGroup.group_name,
    //   image: result.data.newGroup.image,
    //   id: result.data.newGroup.id,
    //   user_type: 'admin',
    // }
    // fetch_group_success??
    // Mixpanel.activity(loggedInUser.id, 'Complete Create Group')
    // } catch (err) {
    //   dispatch({ type: types.ADD_GROUP_FAILURE, payload: err })
    //   // Mixpanel.activity(loggedInUser.id, 'Group Creation Failed')
    //   setError(true)
    //   setLoading(false)
    // }
  }

  //Edits existing group and pushes the user to the group page after submission.
  async function handleGroupEdit() {
    const updatedGroup = { ...values, image }
    dispatch(
      editGroup(window.location.pathname.split('/editgroup/')[1], updatedGroup)
    ).then(() => {
      props.history.push(
        `/group/${window.location.pathname.split('/editgroup/')[1]}`
      )
    })
  }

  //Deletes a group.
  async function handleDeleteGroup() {
    dispatch(
      deleteGroup(window.location.pathname.split('/editgroup/')[1])
    ).then(() => props.history.push('/groups'))
  }

  const privacy =
    values && values.privacy_setting
      ? values.privacy_setting.charAt(0).toUpperCase() +
        values.privacy_setting.slice(1)
      : null
  return (
    <FormHolder>
      <FormSegment raised color='violet' style={{ margin: 'auto' }}>
        <Form onSubmit={handleSubmit} error>
          <h4 style={{ fontWeight: 'bold' }}>Select Image</h4>
          <BasicInfoHolder>
            {/* <UploadIcon
              name='edit'
              size='large'
              color='black'
              onClick={() => setModal(true)}
            /> */}
            <Modal
              open={modalOpen}
              onClose={() => setModal(false)}
              trigger={
                <ProfilePic
                  onClick={() => setModal(true)}
                  src={image || values.image || Default}
                  alt={'Image Preview'}
                />
              }
            >
              <UploaderUI displayImage={image || values.image} />
            </Modal>
          </BasicInfoHolder>
          <FieldHolder>
            <ColumnHolder>
              <Form.Group widths='equal'>
                <Form.Input
                  required
                  label='Group Name'
                  placeholder='Name Your Group'
                  onChange={handleChange}
                  value={values.group_name || ''}
                  maxLength='50'
                  name='group_name'
                  type='text'
                />
                <Form.Input
                  required
                  label='Group Slogan'
                  placeholder='Create Your Group Slogan'
                  onChange={handleChange}
                  value={values.description || ''}
                  name='description'
                  type='text'
                />
              </Form.Group>

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
                  type='text'
                />
                <Form.Input
                  required
                  label='Acronym (Max 4 Characters)'
                  placeholder='Acronym'
                  maxLength='4'
                  onChange={handleChange}
                  value={values.acronym || ''}
                  name='acronym'
                  type='text'
                />
              </Form.Group>
              <Form.Field
                required
                label='Privacy Setting'
                onChange={handleChange}
                name='privacy_setting'
                control='select'
                defaultValue={values.privacy_setting || ''}
              >
                <option value={values.privacy_setting}>{privacy || ''}</option>
                {privacy !== 'Public' && privacy !== undefined && (
                  <option value='public'>Public</option>
                )}
                {privacy !== 'Private' && privacy !== undefined && (
                  <option value='private'>Private</option>
                )}
                {privacy !== 'Hidden' && privacy !== undefined && (
                  <option value='hidden'>Hidden</option>
                )}
              </Form.Field>
              <ErrorMessage />
              <SubmitButton />
              {window.location.pathname.includes('/editgroup') && (
                <DeleteGroup delete={handleDeleteGroup} />
              )}
            </ColumnHolder>
          </FieldHolder>
        </Form>
      </FormSegment>
    </FormHolder>
  )
}

const FormHolder = styled.div`
  justify-content:center @media (max-width: 320px) {
    height: 87vh;
  }
`

const FieldHolder = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
`

const ColumnHolder = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  flex: 1;
`

const FormSegment = styled(Segment)`
  max-width: 800px;
  margin: auto;
  marginbottom: 15%;
`

const BoldInput = styled(Form.Input)`
  input:first-child {
    font-weight: bold;
  }
`

const UploadIcon = styled(Icon)`
  display: flex;
  justify-content: center;
`

const ProfilePic = styled.img`
  border-color: black;
  object-fit: cover;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 1px solid black;
  flex: 0 0 auto;
  opacity: 0.6;
`

const BasicInfoHolder = styled.div`
  display: flex;
  justify-content: center;
`

const NameHolder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space - evenly;
  margin-left: 7px;
  margin-bottom: 1rem;
  width: 100%;
`

export default CreateGroup
