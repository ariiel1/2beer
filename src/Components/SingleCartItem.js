import React from 'react'
import { Icon } from 'react-icons-kit'
import { plus } from 'react-icons-kit/feather/plus'
import { minus } from 'react-icons-kit/feather/minus'
import { auth,fs } from '../firebase-config';

export const SingleCartItems = ({cartItem,cartPlus,cartMinus}) => {

    const handleCartPlus=()=>{
        cartPlus(cartItem);
    }

    const handleCartMinus=()=>{
        cartMinus(cartItem);
    }

    const handleCartDelete=()=>{
        auth.onAuthStateChanged(user=>{
            if(user){
                fs.collection('cart ' + user.uid).doc(cartItem.ID).delete().then(()=>{
                    console.log('successfully deleted');
                })
            }
        })
    }
    
    return (
        <div className='product'>
            <div className='product-img'>
                <img src={cartItem.url} alt="product-img"/>
            </div>
            <div className='product-text title'>{cartItem.title}</div>
            <div className='product-text description'>{cartItem.description}</div>
            <div className='product-text price'>Rp {cartItem.price}</div>
            <span>Quantity</span>
            <div className='product-text quantity-box'>
                <div className='action-btns minus' onClick={handleCartMinus} >
                    <Icon icon={minus} size={20}/>
                </div>                
                <div>{cartItem.qty}</div>               
                <div className='action-btns plus' onClick={handleCartPlus}>
                    <Icon icon={plus} size={20}/>
                </div>
            </div>
   
            <div className='btn btn-danger btn-md cart-btn' onClick={handleCartDelete} >remove from cart!</div>            
        </div>
    )
}