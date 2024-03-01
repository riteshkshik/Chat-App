import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Message = ({message}) => {

  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext);
  const [messageTime, setMessageTime] = useState("");

  const ref = useRef();

  useEffect(() =>{
    ref.current?.scrollIntoView({behavior:"smooth"});
  },[message])

  useEffect(()=>{
    calculateMessageTime(message.date.toDate());
  },[]);

  const calculateMessageTime = (date)=>{
    const currentDate = new Date();
    const timeDifferenceHours = Math.floor((currentDate - date) / (1000 * 60 * 60));

    if(timeDifferenceHours >= 24){
      const day = date.getDate();
      const month = date.toLocaleString("default", { month: "short" });
      setMessageTime(`${day} ${month}`);
    }else{
      if(timeDifferenceHours < 1){
        const minutes = Math.floor((currentDate - date) / (1000 * 60));
        setMessageTime(`${minutes} min`);
      }else{
        setMessageTime(`${timeDifferenceHours} hr`)
      }
      
    }

  }
  
  
  return (
    <div ref={ref} className={`message ${message.senderId === currentUser.uid && "owner"}`}>
      <div className="messageInfo">
        <img
          src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL}
          alt=""
        />
        <span>{messageTime}</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img
          src={message.img}
          alt=""
        />}
      </div>
    </div>
  );
}

export default Message


// will be used for single message
