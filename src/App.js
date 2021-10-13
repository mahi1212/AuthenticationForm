import { getAuth, signInWithPopup, GoogleAuthProvider, updateProfile , sendPasswordResetEmail, sendEmailVerification, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import './App.css';
import initializeAuthentication from './Firebase/firebase.init';
import { useState } from 'react';

initializeAuthentication()
const googleProvider = new GoogleAuthProvider();
const auth = getAuth();

function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLogin, setIslogin] = useState(false)

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
  }
  const handleEmailChange = e => {
    setEmail(e.target.value)
  }
  const handlePassword = e => {
    setPassword(e.target.value)
  }
  const handleName = e => {
    setName(e.target.value)
  }
  const toggleLogIn = e => {
    setIslogin(e.target.checked)
  }

  const handleRegistration = e => {
    e.preventDefault()
    console.log(email, password)
    if (password.length < 6) {
      setError("Password must be six character long")
      return
    }
    if (!/([0-9])/.test(password)) {
      setError("password should contain atleast one number")
      return
    }
    isLogin ? loginUser(email, password) : registerNewUser(email, password)
  }

  const loginUser = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user
        console.log(user)
        setError('')
      }).catch(error => {
        setError(error.message)
      })
  }
  const registerNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user
        setError('')
        varifyEmail()
        setUserName()
        console.log(user)
      }).catch(error => {
        setError(error.message)
      })
  }

  const setUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: name
    }).then((result) => {
      console.log('Profile Updated')
    }).catch((error) => {
      setError(error.message)
    });
  }

  const varifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(result => {
        console.log(result)
      }).catch(error => {
        setError(error.message)
      })
  }

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(result => {
        console.log(result)
      }).catch(error => {
        setError(error.message)
      })
  }

  return (
    <div>
      <div className="mt-4 mx-3">
        <h3 className=' bg-success p-2'>Please {isLogin ? "Login" : "Register"}</h3>
        <form onSubmit={handleRegistration}>
          { !isLogin && <div class="row mb-3">
            <label for="inputAddress" class="col-sm-2 form-label">Name</label>
            <div className="col-sm-10">
              <input onBlur={handleName} type="text" class="form-control" placeholder="Enter name" />
            </div>
          </div>}

          <div class="row mb-3">
            <label for="inputEmail3" class="col-sm-2 col-form-label">Email</label>
            <div class="col-sm-10">
              <input onBlur={handleEmailChange} type="email" class="form-control" placeholder="Email" id="inputEmail3" required />
            </div>
          </div>

          <div class="row mb-3">
            <label for="inputPassword3" class="col-sm-2 col-form-label">Password</label>
            <div class="col-sm-10">
              <input onBlur={handlePassword} type="password" class="form-control" placeholder="Password" id="inputPassword3" required />
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-sm-10 offset-sm-2">
              <div class="form-check">
                <input onChange={toggleLogIn} class="form-check-input" type="checkbox" id="gridCheck1" />
                <label class="form-check-label" for="gridCheck1">
                  Already registered ?
                </label>
              </div>
            </div>
          </div>
          <div className="row mb-3 text-danger">
            {error}
          </div>
          <button type="submit" class="btn btn-primary" onClick={handleRegistration}>
            {isLogin ? 'Login' : 'Register'}</button>
          <button type="submit" class="btn btn-secondary mx-3" onClick={handleResetPassword}>
            Forgot Password</button>

        </form>
      </div>
      <hr />
      <button onClick={handleGoogleSignIn} >Google Sign-in</button>
    </div>
  );
}

export default App;
