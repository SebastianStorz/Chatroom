import React, { useRef, useState } from "react";
import './App.css';

import firebase from 'firebase/app'
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { Avatar } from "@material-ui/core"
import { Button, Container, Nav, Form, Col, Row, Image } from 'react-bootstrap';

!firebase.apps.length ? firebase.initializeApp({
  apiKey: "AIzaSyAft9bqHv2DBhI2bNgrFJij5fNAMBil2ww",
  authDomain: "sebastian-chatroom.firebaseapp.com",
  projectId: "sebastian-chatroom",
  storageBucket: "sebastian-chatroom.appspot.com",
  messagingSenderId: "250215730145",
  appId: "1:250215730145:web:7de7543cc4f75da8c760a0"
}) : firebase.app();

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);

  return (

    <div className="center">

      <div className="anker" >
        <section>
          {user ? <ChatRoom /> : <SignIn />}
        </section>
      </div>
    </div>

  );
}

function SignIn() {
  function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <div className="signIn">
      <Button onClick={signInWithGoogle}>Sign in with Google</Button>
    </div>
  )
}

function SignOut() {
  return auth.currentUser && (
    <Button className="signout" variant="danger" onClick={() => auth.signOut()}>Sign Out</Button>
  )
}

function ChatRoom() {

  const autoscroll = useRef()

  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(30);
  const [messages] = useCollectionData(query, { idField: "id" });

  const [messageText, setMessageText] = useState("")

  async function sendMessage(e) {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: messageText,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setMessageText("");
    autoscroll.current.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>

      <div className="fixed-top-right">
        <SignOut />
      </div>


      <div className="messages">
        {messages && messages.map(msg => <Message key={msg.id} message={msg} />)}
        <div ref={autoscroll}></div>
      </div>

      <form className="fixed-bottom" onSubmit={sendMessage}>
        <Form.Control type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)} />
        <Button type="submit" className="send">Send </Button>
      </form>

    </>
  )
}


function Message(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "recived";

  return (
    <div className={`message ${messageClass}`}>
      <div>
        <Image src={photoURL} roundedCircle className="image" />
      </div>
      <div className="text">
        <p>
          {text}
        </p>
      </div>
    </div>
  )
}

export default App;
