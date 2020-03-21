import axios from 'axios'
import {setAlert} from './alerts'

import {
    GET_PROFILE,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    DELETE_PROFILE,
    CLEAR_PROFILE,
    LOGOUT,
} from './types'


export const getProfile = () => async dispatch => {
    try{
        const res = await axios.get('http://localhost:5000/api/profile/me');

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })

    } catch(err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg : err.response.statusText , status: err.response.status}
        });
    }
}

export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.post('/api/profile', formData, config);
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
        dispatch(setAlert(edit?'Profile updated':'Profile Created','success'));
        if(!edit) {
            history.push('/dashboard');
        }
    } catch(err) {
        const errors = err.response.data.errors;
        
        if(errors) {
            errors.forEach(error => {
                dispatch(setAlert(error.msg, 'danger'));
            });
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText,status:err.response.status}
        });
    }
}

export const addExperience = (formData , history, edit=false) => async (dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.put('/api/profile/experience', formData, config);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('Experience Added.','success'));
        if(!edit) {
            history.push('/dashboard');
        }
    } catch(err) {
        const errors = err.response.data.errors;
        
        if(errors) {
            errors.forEach(error => {
                dispatch(setAlert(error.msg, 'danger'));
            });
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText,status:err.response.status}
        });
    }
}


export const addEducation = (formData , history, edit=false) => async (dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.put('/api/profile/education', formData, config);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('Education Added.','success'));
        if(!edit) {
            history.push('/dashboard');
        }
    } catch(err) {
        const errors = err.response.data.errors;
        
        if(errors) {
            errors.forEach(error => {
                dispatch(setAlert(error.msg, 'danger'));
            });
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText,status:err.response.status}
        });
    }
}


export const deleteExperience = (exp_id) => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/experience/${exp_id}`);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('Experience Deleted.','success'));
    } catch (err) {
        const errors = err.response.data.errors;
        
        if(errors) {
            errors.forEach(error => {
                dispatch(setAlert(error.msg, 'danger'));
            });
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText,status:err.response.status}
        });
    }
}

export const deleteEducation = (edu_id) => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/education/${edu_id}`);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('Education Deleted.','success'));
    } catch (err) {
        const errors = err.response.data.errors;
        
        if(errors) {
            errors.forEach(error => {
                dispatch(setAlert(error.msg, 'danger'));
            });
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText,status:err.response.status}
        });
    }
}

export const deleteProfile = () => async dispatch => {
    try {
        if(window.confirm('Do you really want to delete your Account ?')) {
            await axios.delete('/api/profile');
            dispatch({
                type: DELETE_PROFILE
            })
            dispatch({
                type: CLEAR_PROFILE
            })
            dispatch({
                type: LOGOUT
            })
        }
    } catch(err) {
        const errors = err.response.data.errors;
        
        if(errors) {
            errors.forEach(error => {
                dispatch(setAlert(error.msg, 'danger'));
            });
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: err.response.statusText,status:err.response.status}
        });
    }
}