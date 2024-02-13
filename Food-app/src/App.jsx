import React, { useState, useEffect } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "./firebaseconfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import RecipesPage from './components/RecipesPage';

function App() {
  const [user, setUser] = useState(null);
  const [foodItem, setFoodItem] = useState("");
  const [foodList, setFoodList] = useState([]);
  const [date, setDate] = useState("");
  const auth = getAuth();

  useEffect(() => {
    // Listen for auth state changes
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch foods when user is signed in
        fetchFoods(currentUser.uid);
      } else {
        // Clear food list when signed out
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
        userId: user.uid, // Associate food item with user ID
        foodItem,
        date,
      });
      setFoodItem("");
      setDate("");
      fetchFoods(user.uid); // Refresh the list of food items
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

  return (
    <BrowserRouter>
      <div className="flex flex-col items-center justify-center min-h-screen">
        {user ? (
          <>
            <nav>
              <button onClick={handleSignOut} className="sign-out-btn">Sign Out</button>
              <Link to="/recipes" className="recipes-link">Get Recipes</Link>
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

            <div className="food-list">
              <h2>Food List</h2>
              <ul>
                {foodList.map(({ id, foodItem, date }) => (
                  <li key={id}>{foodItem} - {date}</li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <button onClick={handleSignIn}>Sign in with Google</button>
        )}

        <Routes>
          <Route path="/recipes" element={<RecipesPage foodList={foodList} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
