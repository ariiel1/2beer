import React from 'react'
import { SingleCartItems } from './SingleCartItem'

export const CartItems = ({cartItems,cartPlus,
    cartMinus}) => {
    return cartItems.map((cartItem)=>(
        <SingleCartItems key={cartItem.id} cartItem={cartItem}
           cartPlus={cartPlus}
           cartMinus={cartMinus}
        />
    ))
}