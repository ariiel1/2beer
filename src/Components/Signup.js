import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth, fs } from '../firebase-config'



export const Signup = () => {

    const nav = useNavigate();

    const [name, setName]=useState('');
    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');

    const [errorMsg, setErrorMsg]=useState('');
    const [successMsg, setSuccessMsg]=useState('');

    const handleSignup=(e)=>{
        e.preventDefault();
        // console.log(name, email, password)
        auth.createUserWithEmailAndPassword(email, password).then((credentials)=>{
            console.log(credentials);;
            fs.collection('users').doc(credentials.user.uid).set({
                Name: name,
                Email: email,
                Password: password
            }).then(()=>{
                setSuccessMsg('Sign Up Successful. You will be automatically redirected to the Login page');
                setName('');
                setEmail('');
                setPassword('');
                setErrorMsg('');
                setTimeout(()=>{
                    setSuccessMsg('');
                    nav('/login')
                },2000)
            }).catch((error=>setErrorMsg(error.message)))
        }).catch((error)=>{
            setErrorMsg(error.message)
        })
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
                <h1>Sign Up</h1>
                <hr></hr>
                {successMsg&&<>
                    <div className='success-msg'>{successMsg}</div>
                    <br></br>
                </>}
                <form className='form-group' autoComplete='off' onSubmit={handleSignup}>
                    <label>Username</label>
                    <input type='text' className='form-control' required
                    onChange={(e)=>setName(e.target.value)} value={name}></input>
                    <br></br>
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
                        Already have an account? 
                        <Link to='/login' className='link'> Login</Link>
                        </span>
                        <button type ='submit' className='btn btn-success btn-md login-btn'> Sign Up </button>
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