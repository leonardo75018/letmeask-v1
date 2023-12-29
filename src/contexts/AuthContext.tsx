import React, {createContext, ReactNode, useState, useEffect} from 'react';

import { signInWithPopup, GoogleAuthProvider,onAuthStateChanged } from "firebase/auth";
import {auth} from "../services/firebase"

type User = {
  id: String;
  name: String;
  avatar : String
}

type AuthContextType = {
  user : User | undefined ;
  signInWithGoogle : () => Promise<void>;
}
type AuthContextProviderProps = {
  children : ReactNode
}

export const AuthContext = createContext({} as AuthContextType)


export function AuthContextProvider(props :AuthContextProviderProps){

  const [user,setUser] = useState<User>()

  useEffect(() => {
  const unsubscribe =  onAuthStateChanged(auth, user =>{
     if(user){
        const {displayName,photoURL, uid } = user

        if(!displayName || !photoURL){
          throw new Error("Missing informations from google Account")
        }

        setUser({
          id: uid, 
          name : displayName,
          avatar : photoURL
        })

      }
    })

    return () =>{
      unsubscribe()
    }
  },[])

 async function signInWithGoogle(){
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider)

      if(result.user){
        const {displayName,photoURL, uid } = result.user

        if(!displayName || !photoURL){
          throw new Error("Missing informations from google Account")
        }

        setUser({
          id: uid, 
          name : displayName,
          avatar : photoURL
        })
      }
  }

  return <AuthContext.Provider value={{user,signInWithGoogle}}>
    {props.children}
  </AuthContext.Provider>

}