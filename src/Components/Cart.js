import React, { useState, useEffect } from 'react'
import { Navbar } from './Navbar'
import { auth,fs } from '../firebase-config';
import { CartItems } from './CartItems';


export const Cart = () => {

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
    
    const [cartItems, setCartItems]=useState([]);

    useEffect(()=>{
        auth.onAuthStateChanged(user=>{
            if(user){
                fs.collection('cart ' + user.uid).onSnapshot(snapshot=>{
                    const newCartItem = snapshot.docs.map((doc)=>({
                        ID: doc.id,
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

    const qty = cartItems.map(cartItem=>{
        return cartItem.qty
    })
    const initialValue = 0;
    const cartQty = qty.reduce(
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

        auth.onIdTokenChanged(user=>{
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
        if(Item.qty > 1){
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

     const handleCheckout=()=>{
        alert('Checkout is not available, sorry :/')
     }
   
     return (
        <>
            <Navbar user={user} totalProducts={totalProducts}/>
            <br></br>
            {cartItems.length > 0 && (
                <div className='container'>
                    <h1 className='page-text'>cart!</h1>

                    <div className='summary-box'>
                        <h5>cart summary!</h5>
                        <br></br>
                        <div>
                            Total No. of Items: <span>{cartQty}</span>
                        </div>
                        <hr></hr>
                        <div>
                            Total Price: <span>Rp {cartPrice}</span>
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