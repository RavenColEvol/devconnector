import React, {useState} from 'react'
import {Link} from 'react-router-dom'

const Login = () => {

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
        console.log(formData);
    };

    return (
        <>
            <div className="alert alert-danger">
                Invalid credentials
      </div>
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

export default Login
