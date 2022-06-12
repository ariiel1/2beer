import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { auth, fs } from '../firebase-config';
import axios from 'axios'

export const VerifyAge = () => {


    const [ocr, setOCR] = useState('')
    const [nauth, setNauth] = useState('')

    // const getOCR = () => {
    //     var img = {'images': ['data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC']}
    //     fetch("https://api.cloud.nodeflux.io/syncv2/analytics/ocr-ktp", {
    //     mode: 'cors',
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'NODEFLUX-HMAC-SHA256 Credential=JWOYAM50616MPDAXORTCNE65H/20220611/nodeflux.api.v1beta1.ImageAnalytic/StreamImageAnalytic, SignedHeaders=x-nodeflux-timestamp, Signature=9c8b382cd38f0a426ae7942f04ac539987ba01bce50988fdc1a17efe576d63d4',
    //         'x-nodeflux-timestamp': '20220611T023943Z',},
    //       body: JSON.stringify(img)
    //     })
    //     .then((response) => response.json())
    //     .then((data) => {
    //         setOCR(data)
    //     }) 
        
    //   }

    const [b64, setB64] = useState('')

    const image = 'imagesadad'

    const handleBased = e => {
        const files = e.target.files;
        const file = files[0];
        getBase64(file);
  };
 
  const onLoad = fileString => {
    // console.log(fileString);
    setB64(fileString)
    console.log(b64)
  };
 
  const getBase64 = file => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      onLoad(reader.result);
  }};

    async function nodefluxAuth() {
        const res = await axios.post('https://twobeer-be.herokuapp.com/nodeflux', {
            'image': b64
        }, {
            headers: 'application/json'
        });
        console.log(res.data)
    }
    
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
    <div>
        <Navbar user = {user} totalProducts={totalProducts}/>
        <button onClick={nodefluxAuth}>test</button>
        <form>
        <input type="file" onChange={handleBased} />
        {/* <textarea rows="50" cols="50" value={this.base64code}></textarea> */}
      </form>
    </div>
  )
}