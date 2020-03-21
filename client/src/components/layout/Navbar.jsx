import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {logout} from '../../redux/actions/auth'

function Navbar({isAuthenticated, logout}) {
    return (
        <nav className="navbar bg-dark">
            <h1>
                <Link to="/"><i className="fas fa-code"></i> DevConnector</Link>
            </h1>
            <ul>
                <li><Link to="/dashboard">Dashboard</Link></li>
                
                { isAuthenticated ? <li><span onClick={logout}>Logout</span></li> : <>
                    <li><Link to="/register">Register</Link></li>
                    <li><Link to="/login">Login</Link></li>
                </>}
            </ul>
        </nav>
    )
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
    }
}

export default connect(mapStateToProps, {logout})(Navbar)