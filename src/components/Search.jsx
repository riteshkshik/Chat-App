import React, { useContext, useState } from 'react';
import { collection, query, where, getDocs, setDoc, updateDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';

const Search = () => {

  const [userName, setUserName] = useState(""); // username typed by the user to search in db
  const [user, setUser] = useState(null);  // user we get from firebase 
  const [err, setErr] = useState(false);
  const {currentUser} = useContext(AuthContext)

  const handleSearch = async () => {
    const q = query(collection(db, "users"), where("displayName", "==", userName));

    try{
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    }catch(err){
      setErr(true)
    }
  };

  const handleKey = (e) =>{
    e.code === "Enter" && handleSearch();
  }

  const handleSelect = async() =>{
    // check where if gp(chats in firestore) exist of not, if not create a new one 
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
    try{
      const res = await getDoc(doc(db, "chats", combinedId));
      if(!res.exists()){
        // create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), {messages: []});

        //create userchats
        await updateDoc(doc(db, "userChats", currentUser.uid),{
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          [combinedId + ".date"]: serverTimestamp()
        })

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    }catch(err){}
    setUser(null);
    setUserName('');
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input value = {userName} type="text" name="" id="" placeholder='Find a user !' onKeyDown={handleKey} onChange={e => setUserName(e.target.value)}/>
      </div>
      {err && <span>User Not Found !</span>}
      {user && <div className="userChat" onClick={handleSelect}>
        <img
          src={user.photoURL}
          alt=""
        />
        <div className="userChatInfo">
          <span>{user.displayName}</span>
        </div>
      </div>}
    </div>
  );
}

export default Search
