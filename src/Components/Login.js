import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../firebase-config';
import { Navbar } from './Navbar';
export const Login = () => {

    const nav = useNavigate();

    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');

    const [errorMsg, setErrorMsg]=useState('');
    const [successMsg, setSuccessMsg]=useState('');

    const handleLogin=(e)=>{
        e.preventDefault();
        // console.log(email, password)
        auth.signInWithEmailAndPassword(email, password).then(()=>{
            setSuccessMsg('Login Successful. You will be automatically redirected to the Home page');
            setEmail('');
            setPassword('');
            setErrorMsg('');
            setTimeout(()=>{
                setSuccessMsg('');
                nav('/')
            },2000)
        }).catch((error=>setErrorMsg(error.message)))
    }

    return (
        <div>
            <div className='navbar'>
                <div className='leftside'>
                    <div className='logo'>
                        <Link className='logo-text' to='/'>
                            <h1 className='logo-text'>2beer!</h1>
                        </Link>  
                    </div>
                </div>
            </div>
            <div className='container'>
                <br></br>
                <br></br>
                <h1>Login</h1>
                <hr></hr>
                {successMsg&&<>
                    <div className='success-msg'>{successMsg}</div>
                    <br></br>
                </>}
                <form className='form-group' autoComplete='off' onSubmit={handleLogin}>
                    <label>Email</label>
                    <input type='email' className='form-control' required
                    onChange={(e)=>setEmail(e.target.value)} value={email}></input>
                    <br></br>
                    <label>Password</label>
                    <input type='password' className='form-control' required
                    onChange={(e)=>setPassword(e.target.value)} value={password}></input>
                    <br></br>
                    <div className='btn-box'>
                        <span>
                        Don't have an account? 
                        <Link to='/signup' className='link'> Sign Up </Link>
                        </span>
                        <button type ='submit' className='btn btn-success btn-md login-btn'> Login </button>
                    </div>
                </form>
                {errorMsg&&<>
                    <br></br>
                    <div className='error-msg'>{errorMsg}</div>
                </>}
            </div>
        </div>

    )
}

