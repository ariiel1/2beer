import React from 'react'
import { Navbar } from './Navbar'
import { useState, useEffect } from 'react';
import { auth, fs } from '../firebase-config';
import { useNavigate } from 'react-router-dom'

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

    //Getting cart items
    const [cartItems, setCartItems]=useState([]);
    useEffect(()=>{
        auth.onAuthStateChanged(user=>{
            if(user){
                fs.collection('cart ' + user.uid).onSnapshot(snapshot=>{
                    const newCartItem = snapshot.docs.map((doc)=>({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setCartItems(newCartItem);                    
                })
            }
            else{
                console.log('user is not signed in to retrieve cart');
            }
        })
    },[])  

    //Getting total no of products
    const qty = cartItems.map(cartItem=>{
        return cartItem.qty
    })
    const initialValue = 0;
    const totalProducts = qty.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        initialValue
    );

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
            {user&&<>
                <div className='container'>
                    <h1 className='page-text'>profile!</h1>
                    <div className='common-box'>
                        <h2 className='text-center'>{user}</h2>
                        <br></br>
                        {userAge == 0 && (<>
                            <div className='btn btn-success btn-md logout-btn'onClick={goToVerify}>verify age!</div>
                            <br></br>
                        </>)} 
                        <div className='btn btn-danger btn-md logout-btn'onClick={handleLogout}>logout!</div>
                    </div>
                </div>
            </>}
        </>
  )
}

