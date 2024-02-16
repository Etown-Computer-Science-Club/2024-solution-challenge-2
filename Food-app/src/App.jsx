import React, { useState, useEffect } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "./firebaseconfig";
import { collection, addDoc, getDocs, query, where, doc, deleteDoc } from "firebase/firestore";
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import RecipesPage from './components/RecipesPage';
import { DeleteTwoTone } from '@ant-design/icons';
import { Button } from 'antd';


function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(""); // State for email
  const [password, setPassword] = useState(""); // State for password
  const [foodItem, setFoodItem] = useState("");
  const [foodList, setFoodList] = useState([]);
  const [date, setDate] = useState("");
  const auth = getAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('signIn'); // 'signIn' or 'signUp'

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchFoods(currentUser.uid);
      } else {
        setFoodList([]);
      }
    });
  }, []);

  const handleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch((error) => {
      console.error("Error signing in: ", error);
    });
  };

  const handleEmailSignIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        setIsModalOpen(false); // Close the modal on successful sign-in
        // Set user state here if needed
      })
      .catch((error) => {
        console.error("Error signing in with email: ", error.message);
        // Optionally handle errors here
      });
  };
  

  const handleSignUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        setIsModalOpen(false); // Close the modal on successful sign-up
        // You might want to automatically sign the user in here as well
      })
      .catch((error) => {
        console.error("Error signing up: ", error.message);
        // Optionally handle errors here
      });
  };

  const handleSignOut = () => {
    signOut(auth).catch((error) => {
      console.error("Error signing out: ", error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, "foods"), {
        userId: user.uid,
        foodItem,
        date,
      });
      setFoodItem("");
      setDate("");
      fetchFoods(user.uid);
    } catch (error) {
      console.error("Error adding food item: ", error);
    }
  };

  const fetchFoods = async (userId) => {
    const q = query(collection(db, "foods"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setFoodList(items);
  };

  const handleDelete = async (itemId) => {
    try {
      await deleteDoc(doc(db, "foods", itemId));
      setFoodList(foodList.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  return (
  <BrowserRouter>
    <div className="flex flex-col items-center justify-center min-h-screen">
      {user ? (
        <>
          <nav>
            <button onClick={handleSignOut} className="sign-out-btn">Sign Out</button>
          </nav>
          
          <form onSubmit={handleSubmit} className="form">
            <div>
              <label>
                Food Item:
                <input type="text" value={foodItem} onChange={(e) => setFoodItem(e.target.value)} />
              </label>
            </div>
            <div>
              <label>
                Date:
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
            </div>
            <button type="submit">Add to Database</button>
          </form>
          <div className="mt-8">
            <h2 className="text-center">Food List</h2>
            <ul>
              {foodList.map((item) => (
                <li key={item.id}>
                  <Button onClick={() => handleDelete(item.id)} type="link" danger icon={<DeleteTwoTone twoToneColor="#ff4d4f" />} />
                  {item.foodItem} - {item.date}
                </li>
              ))}
            </ul>
            <Link to="/recipes" className="recipes-link">Get Recipes</Link>
          </div>
        </>
      ) : (
        <>
          <div className="text-center mb-4">
            <img src="/favicon.png" alt="Logo" style={{ width: "50%", height: "auto" }} className="mb-4" />
            <h1 className="text-2xl font-bold">WasteNot Pantry</h1>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="big-sign-in-btn">Sign In</button>
        </>
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setIsModalOpen(false)}>&times;</span>
            {modalMode === 'signIn' && (
              <>
                <button onClick={handleSignIn}>Sign in with Google</button>
                <button onClick={() => setModalMode('emailSignIn')}>Sign in with Email</button>
                <button onClick={() => setModalMode('signUp')}>Sign Up</button>
              </>
            )}
            {modalMode === 'emailSignIn' && (
              <form onSubmit={handleEmailSignIn}>
                <div>
                  <label>Email:<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
                </div>
                <div>
                  <label>Password:<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
                </div>
                <button type="submit">Sign In with Email</button>
                <button type="button" onClick={() => setModalMode('signIn')}>Back</button>
              </form>
            )}
            {modalMode === 'signUp' && (
              <form onSubmit={handleSignUp}>
                <div>
                  <label>Email:<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
                </div>
                <div>
                  <label>Password:<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
                </div>
                <button type="submit">Sign Up</button>
                <button type="button" onClick={() => setModalMode('signIn')}>Back</button>
              </form>
            )}
          </div>
        </div>
      )}

      <Routes>
        <Route path="/recipes" element={<RecipesPage foodList={foodList} />} />
      </Routes>
    </div>
  </BrowserRouter>
);

}

export default App;
