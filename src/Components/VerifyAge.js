import React, { useState, useEffect } from 'react'
import { Navbar } from './Navbar'
import { auth, fs } from '../firebase-config';

export const VerifyAge = () => {

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
    <Navbar user = {user} totalProducts={totalProducts}/>
  )
}
