import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';




function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        console.log(authUser);
        setUser(authUser);
      }else{
        setUser(null);
      }
    })
    return ()=>{
      unsubscribe();
    }
  },[user, username]);

   useEffect(() => {
      db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot=> {
        setPosts(snapshot.docs.map(doc => 
          ({id:doc.id,
            post:doc.data()
          })));
      })
   }, []);
    
  const signUp = (event) => {
      event.preventDefault();
      auth
      .createUserWithEmailAndPassword(email,password)
      .then((authUser)=>{
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error)=> alert(error.message));

      setOpen(false);
  }
  const signIn = (event)=> {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  }

  return (
    <div className ="App">
     <Modal
        open={open}
        onClose={() => setOpen(false)}>

       <div style={modalStyle} className={classes.paper}>

       <form className="app__signup">
       <center>
       <div className = "app__headerImage">
           <h1> 📸</h1>
           </div>
           </center>
           <Input  
           placeholder= "Username"
           type ="text"
           value ={username}
           onChange = {(e) => setUsername(e.target.value)}

           />

           <Input  
           placeholder= "email"
           type ="text"
           value ={email}
           onChange = {(e) => setEmail(e.target.value)}

           />
          
          <Input  
           placeholder= "password"
           type ="password"
           value ={password}
           onChange = {(e) => setPassword(e.target.value)}

           />

           <Button type = "submit" onClick = {signUp}>Sign Up</Button>
       
       </form>
       </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}>

       <div style={modalStyle} className={classes.paper}>

       <form className="app__signup">
       <center>
       <div className = "app__headerImage">
           <h1> 📸</h1>
           </div>
           </center>

           <Input  
           placeholder= "email"
           type ="text"
           value ={email}
           onChange = {(e) => setEmail(e.target.value)}

           />
          
          <Input  
           placeholder= "password"
           type ="password"
           value ={password}
           onChange = {(e) => setPassword(e.target.value)}

           />

           <Button type = "submit" onClick = {signIn}>Sign In</Button>
       
       </form>
       </div>
      </Modal>
      
      <div className= "app__header">
          <div className = "app__headerImage">
           <h1> 📸PicsWatch</h1>
           </div>
           {user ? (
          <Button onClick ={() => auth.signOut()}>Logout</Button> 
          ):(
            <div className = "app__loginContainer">
            <Button onClick ={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick ={() => setOpen(true)}>Sign Up</Button>
            
            </div>
          )}
       </div>

       {/* ////////////////////////  welcom text ///////////// */}

       <h2 className="welcomeText"> Welcome to PicsWatch  🙋‍♂️, <br/>
        see what other people are upto🎬</h2>
        
       {/* ///////////////////////// posts/////////////////// */}
        
          <div className = "app__posts">
           <div className = "app__postsLeft">
           {
              posts.map(({id,post}) =>(
            <Post 
              key = {id}
              postId = {id}
              user={user}
              username = {post.username}
              caption = {post.caption}
              imageURL = {post.imageURL}
            />
            ))
           }
          
           <div className="app__InstaEmbed">
           <h1 className="Dev_info">👇 Developer 👇</h1>
              <InstagramEmbed
                  url='https://www.instagram.com/p/BdBMfWTn9pf/?utm_source=ig_web_copy_link'
                  maxWidth={320}
                  hideCaption={false}
                  containerTagName='div'
                  protocol=''
                  injectScript
                  onLoading={() => {}}
                  onSuccess={() => {}}
                  onAfterRender={() => {}}
                  onFailure={() => {}}

                  />
           
           </div>
           </div>
           
       
       </div>

       

      {user?.displayName ?(
      <ImageUpload username ={user.displayName}/>
     ):(
      <h3>Sorry You Need To login to Upload</h3>
     )}

    </div>
    
  );
}

export default App;
