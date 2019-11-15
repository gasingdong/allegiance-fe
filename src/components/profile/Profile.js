import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Icon, Loader } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import ProfileAllegiances from './ProfileAllegiances'
import ProfilePostCard from '../profile/ProfilePostCard'
import axios from 'axios'
import useGetToken from '../utils/useGetToken'
import { fetchProfile, fetchProfilePosts } from './store/profileActions'
import defaultBanner from 'assets/defaultBanner.jpg'
import { Typography } from '@material-ui/core'
import Default from '../../assets/walter-avi.png'
import ProfilePostsCard from './ProfileAllegiances'
import MyAllegianceGroups from './MyAllegianceGroups'

const Profile = props => {
  const dispatch = useDispatch()
  const [token] = useGetToken()
  const profile = useSelector(state => state.profile)
  const loggedInUserId = useSelector(state => state.userReducer.loggedInUser.id)
  const posts = profile.posts
  const user = profile.id
  console.log('user::::', user)
  const id = window.location.pathname.split('/profile/')[1]
  const loggedInAllegiances = useSelector(
    state => state.userReducer.loggedInAllegiances
  )

  useEffect(() => {
    if (profile && token) {
      dispatch(fetchProfile(id))
      dispatch(fetchProfilePosts(id))
    }
  }, [id, token, dispatch])

  if (!profile) {
    return (
      <Loader active size='large'>
        Loading
      </Loader>
    )
  }

  return (
    <ProfileContainer>
      <div style={{ maxWidth: '100%' }}>
        <Banner>
          <BannerImage
            src={profile.banner_image || defaultBanner}
            alt='Banner'
          />
        </Banner>
        <ImageCrop>
          {profile.image ? (
            <ProfileImage src={profile.image} alt='Profile' />
          ) : (
            <Icon
              name='football ball'
              size='huge'
              circular
              style={{ fontSize: '5.3rem' }}
            />
          )}
        </ImageCrop>
        <InfoHolder>
          <Name>
            {profile.username && (
              <Typography
                variant='h1'
                noWrap={true}
                style={{ fontWeight: 'bold' }}
              >{`${profile.first_name} ${profile.last_name}`}</Typography>
            )}
          </Name>
          <Bio>{profile.username && <h1>{profile.bio}</h1>}</Bio>

          <Name>
            {props.match.url === '/profile' && (
              <Link to='/makeprofile'>Profile Settings</Link>
            )}
          </Name>
          {/* <p>{loggedInUser.bio}</p> */}
          <div className='alleg-group-container'>
            <div className='select'>
              <DivAllegiance>
                <H2>ALLEGIANCES</H2>
              </DivAllegiance>
            </div>

            <ProfileAllegiances
              loggedInUserId={loggedInUserId}
              user={user}
              name={profile.first_name}
              content={profile.allegiances}
              type='allegiance'
              default={Default}
            />

            <H2>GROUPS</H2>
            <MyAllegianceGroups content={profile.groups} />
          </div>
          <div className='lower-div'>
            <H2>POSTS</H2>
            {profile.posts.map(post => {
              return <ProfilePostCard post={post} />
            })}
          </div>
        </InfoHolder>
      </div>
    </ProfileContainer>
  )
}

const DivAllegiance = styled.div`
  display: flex;
  justify-content: center;
`

const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
`
const Banner = styled.div``

const BannerImage = styled.img`
  width: 100%;
  border-bottom: 10px solid black;
  max-height: 225px;
  object-fit: cover;
`
const InfoHolder = styled.div`
  .alleg-group-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    
  }
  .select {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '5px',
  }
  .groupDiv {
    
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .lower-div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`
const Name = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 10px;
`
const Bio = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 20px;
`
const ImageCrop = styled.div`
  width: 150px;
  height: 150px;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
  border: 1px solid white;
  margin-top: -8rem;
  margin-left: auto;
  margin-right: auto;
  background-color: white;
`
const ProfileImage = styled.img`
  object-fit: cover;
  width: 150px;
  height: 150px;
`
const H2 = styled.h2`
  font-size: 2rem;
  margin-top: 15px;
  margin-bottom: 15px;
  font-weight: bold;
`
const H3 = styled.h3`
  padding-left: 20px;
  font-size: 3rem;
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 0;
`

export default Profile
