import React, { useRef, useState } from "react";
import './App.css';

import firebase from 'firebase/app'
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { Avatar } from "@material-ui/core"
import { Button, Container, Nav, Form, Col, Row } from 'react-bootstrap';

firebase.initializeApp({
  apiKey: "AIzaSyAft9bqHv2DBhI2bNgrFJij5fNAMBil2ww",
  authDomain: "sebastian-chatroom.firebaseapp.com",
  projectId: "sebastian-chatroom",
  storageBucket: "sebastian-chatroom.appspot.com",
  messagingSenderId: "250215730145",
  appId: "1:250215730145:web:7de7543cc4f75da8c760a0"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);

  return (<>
    <Container maxWidth="sm">
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </Container>
  </>
  );
}

function SignIn() {
  function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
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
      <div className="topnav">
        <SignOut />
      </div>
      <div>
        {messages && messages.map(msg => <Message key={msg.id} message={msg} />)}
        <div ref={autoscroll}></div>
      </div>

      <form className="inputfields" onSubmit={sendMessage}>
        <Row>
          <Col xs="10">
            <Form.Control type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)} />
          </Col>
          <Col xs="2">
            <Button type="submit">Send </Button>
          </Col>
        </Row>
      </form>
    </>
  )
}


function Message(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "recived";

  return (
    <div className={`message ${messageClass}`}>
      <Avatar src={photoURL} />
      <p>{text}</p>
    </div>
  )
}

export default App;
