import './Register.scss'
import React, { useState } from 'react'
import addAvatar from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate, Link } from 'react-router-dom';


const Register = () => {

  const [err, setErr] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
    try{
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log(res);

      const storageRef = ref(storage, displayName); 
      // console.log(storageRef);

      await uploadBytesResumable(storageRef, file).then(() =>{
        getDownloadURL(storageRef).then(async(downloadURL) =>{
          try{
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL
            });
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/")
          }catch(err){
            console.log("error inside uploadBytesResumable => " + err);
            setErr(true);
          }
        });
      });
    }catch(err){
      console.log("err2=> " + err)
      setErr(true);
    }
    
  }

  const handleImageSubmit = (event) =>{
    const file = event.target.files[0];
    console.log(file);
    if(file){
      setAvatar(file);
    }
  }

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chat App</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="display name" name="" id="" />
          <input type="email" placeholder="email" name="" id="" />
          <input type="password" placeholder="password" name="" id="" />
          <input
            style={{ display: "none" }}
            type="file"
            name=""
            id="file"
            onChange={handleImageSubmit}
          />
          <label htmlFor="file">
            {avatar ? (
              <>
                <img src={URL.createObjectURL(avatar)} alt="" />
                <span>Avatar Selected!</span>
              </>
            ) : (
              <>
                <img src={addAvatar} alt="" />
                <span>Add Your Avatar</span>
              </>
            )}
          </label>
          <button>Sign Up</button>
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          You do have an Account? <Link to="/register">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register
