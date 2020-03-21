import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {getProfile, deleteProfile} from '../../redux/actions/profile'
import {Link} from 'react-router-dom'

import Spinner from '../layout/Spinner'
import DashboardAction from './DashboardAction'
import Experience from './Experience'
import Education from './Education'

const Dashboard = ({getProfile, deleteProfile, auth: {user}, profile: { profile, loading }}) => {

    useEffect(() => {
        getProfile();
    }, [])

    return (
        loading && profile === null ? 
        <Spinner/> :
        <>
            <h1 className="large text-primary">
                Dashboard
            </h1>
            <p className="lead">
                <i className="fas fa-user">
                </i>
                Welcome {user && user.name}
            </p>
            {
                profile !== null ?
                <>
                    <DashboardAction/>
                    <Experience experience={profile.experience}/>
                    <Education education={profile.education}/>
                    <div className='my-2'>
                        <button className='btn btn-danger' onClick={() => deleteProfile()}>
                        <i className='fas fa-user-minus' /> Delete My Account
                        </button>
                    </div>
                </> :
                <>
                    <p>You have not yet setup a profile, please add some info</p>
                    <Link to='/create-profile' className='btn btn-primary my-1'>Create Profile</Link>
                </>
            }
        </>
    )
}

Dashboard.propTypes = {
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    getProfile: PropTypes.func.isRequired,
    deleteProfile: PropTypes.func.isRequired,
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        profile: state.profile
    }
}

export default connect(mapStateToProps, {getProfile, deleteProfile})(Dashboard)
