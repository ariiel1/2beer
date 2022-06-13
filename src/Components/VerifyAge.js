import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { auth, fs } from '../firebase-config';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

export const VerifyAge = () => {
    
    const nav = useNavigate()

    const [errorMsg, setErrorMsg]=useState('');
    const [successMsg, setSuccessMsg]=useState('');

    //base 64 conversion taken from https://codingshiksha.com
    const [b64, setB64] = useState('')

    const handleBased = e => {
        const files = e.target.files;
        const file = files[0];
        getBase64(file);
  };
 
  const onLoad = fileString => {
        setB64(fileString)
  };
 
  const getBase64 = file => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
        onLoad(reader.result);
  }};

    async function nodeFlux() {
        const res = await axios.post('https://twobeer-be.herokuapp.com/nodeflux', {
            'image': b64
        }, {
            headers: 'application/json'
        })
        .then((res) => {
            console.log(res)
            return res
        })
        .then((res) => {
            auth.onAuthStateChanged(user=>{
                if(user){
                    if(res.data.message == 'OCR_KTP Service Success' && res.data.result[0].tanggal_lahir != ""){
                        fs.collection('users').doc(user.uid).update({age: parseInt(res.data.result[0].tanggal_lahir.slice(6, 10))})
                        .then(() => {
                            console.log('age update');
                            setSuccessMsg('Verification successful, you will be redirected to the home page!')
                            setErrorMsg('')
                            setTimeout(()=>{
                                setSuccessMsg('');
                                nav('/')
                            },2000)
                        })
                    }
                    if(res.data.result[0].tanggal_lahir == ""){
                        setErrorMsg('Date of birth not detected')
                    }
                    else{
                        setErrorMsg(res.data.message)
                    }
                }
            })
        })
        
    }

    
    function GetCurrentUser(){
        const [user, setUser]=useState(null);
        useEffect(()=>{
            auth.onIdTokenChanged(user=>{
                if(user){
                    fs.collection('users').doc(user.uid).get().then(temp=>{
                        setUser(temp.data().Name);
                    })
                }
                else{
                    setUser(null);
                }
            })
        })
        return user;
    }

    const user = GetCurrentUser();

    function GetCurrentUserAge(){
        const [userAge, setUserAge]=useState(null);
        useEffect(()=>{
            auth.onIdTokenChanged(user=>{
                if(user){
                    fs.collection('users').doc(user.uid).get().then(temp=>{
                        setUserAge(temp.data().age);
                    })
                }
                else{
                    setUserAge(null);
                }
            })
        })
        return userAge;
    }

    const userAge = GetCurrentUserAge();

    const [cartItems, setCartItems]=useState([]);
    useEffect(()=>{
        auth.onIdTokenChanged(user=>{
            if(user){
                fs.collection('cart ' + user.uid).onSnapshot(snapshot=>{
                    const newCartItem = snapshot.docs.map((doc)=>({
                        cartId: doc.id,
                        ...doc.data(),
                    }))
                    setCartItems(newCartItem);
                })
            }
            else{
                console.log('not signed in')
            }
        })
    })

    const [totalProducts, setTotalProducts]=useState(0);
    useEffect(()=>{
        auth.onIdTokenChanged(user=>{
            if(user){
                fs.collection('cart '+ user.uid).onSnapshot(snapshot=>{
                    const qty = snapshot.docs.length;
                    setTotalProducts(qty);
                })
            }
        })
    })

  return (
    <div>
        <Navbar user = {user} totalProducts={totalProducts}/>
        <br></br>
        <div className='container'>
            <h1 className='page-text'>verify age!</h1>
            <div className='common-box'>
                <h5>Input KTP Image</h5>
                <input type="file" onChange={handleBased} className='form-control'></input>
                {/* <h7>max file size: 800 KB</h7> */}
                <br></br>
                <button onClick={nodeFlux} className='btn btn-success btn-md w-100'>verify!</button>
            </div>
            {successMsg&&<>
                    <div className='success-msg'>{successMsg}</div>
                    <br></br>
                </>}
            {errorMsg&&<>
                    <br></br>
                    <div className='error-msg'>{errorMsg}</div>
                </>}
        </div>
    </div>
  )
}