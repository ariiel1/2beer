import React from 'react'

export const SingleProduct = ({singleProduct, addToCart}) => {
    // console.log(singleProduct);
    const handleAddToCart=()=>{
        addToCart(singleProduct);
    }

  return (
    <div className='product'>
        <div className='product-img'>
            <img src={singleProduct.url} alt='product.img'/>
        </div>
        <div className='product-text title'>{singleProduct.title}</div>
        <div className='product-text description'>{singleProduct.description}</div>
        <div className='product-text price'>Rp {(singleProduct.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
        <div className='btn product-btn' onClick={handleAddToCart}>Add to Cart</div>
    </div>
  )
}

