import React, { useState, useEffect } from 'react'
import { Navbar } from './Navbar'
import { auth,fs } from '../firebase-config';
import { CartItems } from './CartItems';
import { Link, useNavigate } from 'react-router-dom';


export const Cart = () => {

    const nav = useNavigate()

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
        },[])
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

    const price = cartItems.map(cartItem=>{
        return cartItem.TotalPrice
    })
    const cartPrice = price.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        initialValue
    );


    let Item;
    const cartPlus=(cartItem)=>{
        Item = cartItem;
        Item.qty = Item.qty + 1;
        Item.TotalPrice = Item.qty * Item.price;

        auth.onAuthStateChanged(user=>{
            if(user){
                fs.collection('cart ' + user.uid).doc(cartItem.id).update(Item).then(()=>{
                    console.log('added')
                })
            }
            else{
                console.log('not signed in')
            }
        })
    }

    const cartMinus=(cartItem)=>{
        Item = cartItem;
        auth.onAuthStateChanged(user=>{
            if(Item.qty == 0){
                fs.collection('cart ' + user.uid).doc(cartItem.id).delete()
            }})

        if(Item.qty >= 1){
            Item.qty = Item.qty - 1;
            Item.TotalPrice = Item.qty * Item.price;

            auth.onIdTokenChanged(user=>{
                if(user){
                    fs.collection('cart ' + user.uid).doc(cartItem.id).update(Item).then(()=>{
                        console.log('reduced')
                    })
                    
                }
                else{
                    console.log('not signed in')
                }
            })
        }
    }

     const handleCheckout=()=>{
        if(userAge == 0){
            nav('/verify')
        }
        if(userAge >= 2002 && userAge != 0){
            alert('Sorry, you are not old enough!')
        }
        if(userAge <= 2001 && userAge != 0){
            alert('You are old enough but unfortunately the store is not real!')
        }
    }
        
   
     return (
        <>
            <div className='sticky'>
                <Navbar user={user} totalProducts={totalProducts}/>
            </div>
            <br></br>
            {cartItems.length > 0 && (
                <div className='container'>
                    <h1 className='page-text'>cart!</h1>

                    {userAge == 0 && (<>
                    <h5 className='error-msg'>
                        Age verification required! Verify
                        <Link to='/verify' className='link'> here</Link>
                    </h5>
                    </>)} 

                    <div className='summary-box'>
                        <h5>cart summary!</h5>
                        <br></br>
                        <div className='divider'>
                            Total No. of Items: <span>{totalProducts}</span>
                        </div>
                        <div>
                            Total Price: <span>Rp {(cartPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                        </div>
                        <br></br>
                        
                        
                        <button type ='submit' className='btn btn-success btn-md' onClick={handleCheckout}> checkout! </button>
                       
                        
                    </div>

                    <div className='products-box'>
                        <CartItems cartItems={cartItems} cartPlus={cartPlus} cartMinus={cartMinus}/>
                    </div>
                   
                </div>
            )}
            {cartItems.length < 1 && (
                <div className='container-fluid'>Cart is Empty</div>
            )}
        </>
        )
    }