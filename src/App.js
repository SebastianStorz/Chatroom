import React from "react";
import './App.css';

import firebase from 'firebase/app'
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

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

  return (
    <div className="App">
      <header className="App-header">
        asdf
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
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
    <button onClick={() => auth.SignOut()}>Sign Out</button>
  )
}

function ChatRoom() {

  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(30);

  const [messages] = useCollectionData(query, { idField: "id" });

  return (
    <>
      <div>
        {messages && messages.map(msg => <Message key={msg.id} message={msg} />)}
      </div>
    </>
  )

}


function Message(props) {
  const { text, uid } = props.message;

  return <p>{text}</p>
}

export default App;
