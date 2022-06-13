import React from 'react'
import { SingleProduct } from './SingleProduct'

export const Products = ({products, addToCart}) => {

    return products.map((singleProduct)=>(
        <SingleProduct key = {singleProduct.id} singleProduct = {singleProduct} addToCart = {addToCart}/>
    ))
}
