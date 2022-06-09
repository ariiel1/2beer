import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from'react-icons-kit'
import { shoppingCart } from 'react-icons-kit/feather/shoppingCart'
import { shoppingBag } from 'react-icons-kit/feather/shoppingBag'
import { auth } from '../firebase-config'

export const Navbar = ({user, totalProducts}) => {

  const nav = useNavigate();

  const handleLogout=()=>{
    auth.signOut().then(()=>{
      nav('/login')
    })
  }


  return (
    <div className='navbar'>
    <div className='leftside'>
      <div className='logo'>
        <Link className='logo-text' to='/'>
          <h1 className='logo-text'>2beer!</h1>
        </Link>  
      </div>
    </div>
    <div className='rightside'>
      {!user&&<>
        <div>
          <Link className='navlink' to='/login'>
            <div className='btn btn-success btn-lg login-btn'>Login</div>
          </Link>
        </div>                             
      </>}

      {user&&<>
        {/* <div><Link className='navlink' to='/verify'>Verify age</Link></div> */}
        <div>
            <Link className='navlink' to='/'>
                <Icon icon={shoppingBag} size={30}></Icon>
            </Link>
        </div>
        <div className='cart-menu-btn'>
            <Link className='navlink' to='/cart'>
                <Icon icon={shoppingCart} size={30}></Icon>
            </Link>
            <span className='cart-indicator'>{totalProducts}</span>
        </div>
        {/* <div className='btn btn-danger btn-md'onClick={handleLogout}>logout!</div> */}
        <div><Link className='navlink' to='/profile'>{user}</Link></div>
        </>}
    </div>
</div>
  )
}

