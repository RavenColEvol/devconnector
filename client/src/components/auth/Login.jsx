import React, {useState} from 'react'
import {Link, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import { login } from '../../redux/actions/auth'

const Login = ({login, isAuthenticated}) => {

    const [formData, setFormData] = useState({
        email:'',
        password:''
    })

    const { email, password } = formData;

    const handleChange = e => {
        setFormData({...formData,[e.target.name]:e.target.value})
    }

    const handleSubmit = e => {
        e.preventDefault();
        login({email, password});
    };

    if(isAuthenticated) 
        return <Redirect to='/dashboard' />

    return (
        <>
            <h1 className="large text-primary">Sign In</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
            <form className="form" onSubmit={(e) => handleSubmit(e)}>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        onChange={(e) => handleChange(e)}
                        value={email}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={(e) => handleChange(e)}
                        value={password}
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Login" />
            </form>
            <p className="my-1">
                Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
        </>
    )
}

Login.protoType = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    }
}

export default connect(mapStateToProps,{login})(Login)
