import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './Components/Home'
import { Login } from './Components/Login'
import { NotFound } from './Components/NotFound'
import { Signup} from './Components/Signup'
import { SecretPage } from './Components/SecretPage'
import { Cart } from './Components/Cart'
import { Profile } from './Components/Profile'
import { VerifyAge } from './Components/VerifyAge'


export const App = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path ='/' element = {<Home/>}/>
            <Route path ='/signup' element = {<Signup/>}/>
            <Route path ='/login' element = {<Login/>}/>
            <Route path ='/secretpage' element = {<SecretPage/>}/>
            <Route path ='/cart' element = {<Cart/>}/>
            <Route path ='/profile' element = {<Profile/>}/>
            <Route path ='/verify' element = {<VerifyAge/>}/>
            <Route path ='*' element = {<NotFound/>}/>
        </Routes>
    </BrowserRouter>
  )
}

export default App