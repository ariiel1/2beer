import React from 'react'
import { Navbar } from './Navbar'
import { useState, useEffect } from 'react';
import { auth, fs } from '../firebase-config';
import { Link, useNavigate } from 'react-router-dom'

export const Profile = () => {

    const nav = useNavigate();

    function GetCurrentUser(){
        const [user, setUser]=useState(null);
        useEffect(()=>{
            auth.onAuthStateChanged(user=>{
                if(user){
                    fs.collection('users').doc(user.uid).get().then(snapshot=>{
                        setUser(snapshot.data().Name);
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

    const [totalProducts, setTotalProducts]=useState(0);
     useEffect(()=>{        
         auth.onAuthStateChanged(user=>{
             if(user){
                 fs.collection('cart ' + user.uid).onSnapshot(snapshot=>{
                     const qty = snapshot.docs.length;
                     setTotalProducts(qty);
                 })
             }
         })       
     })  

     const handleLogout=()=>{
        auth.signOut().then(()=>{
          nav('/login')
        })
      }

      const goToVerify=()=>{
          nav('/verify')
      }

  return (
        <>
            <Navbar user={user} totalProducts={totalProducts}></Navbar>
            <br></br>
            {user&&<>
                <div className='container'>
                    <h1 className='text-center'>{user}</h1>
                    <div className='btn btn-success btn-md logout-btn'onClick={goToVerify}>verify age!</div>
                    <br></br>
                    <br></br>
                    <div className='btn btn-danger btn-md logout-btn'onClick={handleLogout}>logout!</div>
                </div>
            </>}
        </>
  )
}
