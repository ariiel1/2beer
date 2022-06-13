import React, { useState, useEffect } from 'react'
import { Navbar } from './Navbar'
import { Products } from './Products'
import { auth, fs } from '../firebase-config'
import { useNavigate } from 'react-router-dom';
import { CartItems } from './CartItems';

export const Home = () => {

    const nav = useNavigate();

    function GetUserId(){
        const [uid, setUid]=useState(null);
        useEffect(()=>{
            auth.onIdTokenChanged(user=>{
                if(user){
                    setUid(user.uid);
                }
            })
        })
        return uid;
    }

    const uid = GetUserId();

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

    const[products, setProducts]=useState([]);

    const getProducts = async()=>{
        const products = await fs.collection('products').get();
        const productsArray = [];
        for (var prod of products.docs){
            var data = prod.data();
            data.id = prod.id;
            productsArray.push({
                ...data
            })
            if(productsArray.length === products.docs.length){
                setProducts(productsArray);
            }
        }
    }

    useEffect(()=>{
        getProducts();
    })

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

    let Product;
    const addToCart = (product)=>{
        if(uid!==null){
            Product = product
            Product.qty = 1
            Product.TotalPrice = Product.qty*Product.price;
            fs.collection('cart ' + uid).doc(product.id).set(Product).then(()=>{
                console.log('added to cart')
            })
        }
        else{
            nav('login')
        }
    }


    return (
        <div>
            <div className='sticky'>
                <Navbar user={user} totalProducts={totalProducts}/>
            </div>
            <br></br>
            {products.length > 0 && (
                <div className='container'>
                    <h1 className='page-text'>shop!</h1>
                    <div className='products-box'>
                        <Products products={products} addToCart={addToCart}/>
                    </div>
                </div>
            )}
            {products.length < 1 && (
                <div className='container-fluid'>Loading...</div>
            )}
        </div>
    )
}
