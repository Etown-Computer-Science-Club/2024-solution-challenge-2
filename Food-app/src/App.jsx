import { useState, useEffect } from "react";
import { db } from "./firebaseconfig";
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import RecipesPage from './components/RecipesPage'; 
import { DeleteTwoTone } from '@ant-design/icons';
import {Button } from 'antd';

function App() {
  const [foodItem, setFoodItem] = useState("");
  const [foodList, setFoodList] = useState([]);
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, "foods"), {
        foodItem,
        date,
      });
      console.log("Document written with ID: ", docRef.id);
      setFoodItem("");
      setDate("");
      alert("Data added successfully");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  async function getfoods() {
    try {
      const collectionRef = collection(db, "foods");
      const queryResult = await getDocs(collectionRef);
      const result = queryResult.docs.map((doc) => ({
        id: doc.id,
        foodItem: doc.data().foodItem,
        date: doc.data().date,
      }));

      return result;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
  async function deleteFood(id) {
    const collectionRef = collection(db, "foods");
    const docRef = doc(collectionRef, id);
    await deleteDoc(docRef);

    const newFoodList = foodList.filter(x => x.id != id);
    setFoodList(newFoodList);
  }
  useEffect(() => {
    getfoods().then((foods) => setFoodList(foods));
  }, []);

  return (
    <BrowserRouter>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <nav>
          <Link to="/recipes" className="px-4 py-2 bg-green-500 text-white rounded my-4">Get Recipes</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={
            <>
      <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col items-center gap-4">
        <div>
          <label className="block">
            Food Item:
            <input
              type="text"
              value={foodItem}
              onChange={(e) => setFoodItem(e.target.value)}
              className="mt-1 block w-full"
            />
          </label>
        </div>
        <div>
          <label className="block">
            Date:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full"
            />
          </label>
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Add to Database</button>
      </form>
       

      <div className="mt-8">
  <h2 className="text-center">Food List</h2>
  <ul>
    {foodList.map((item) => (
      <li key={item.id}>
        <Button onClick = {() => deleteFood(item.id)}type="link" danger icon={<DeleteTwoTone twoToneColor="#ff4d4f" />} />
        {item.foodItem} - {item.date}
      </li>
    ))}
  </ul>
</div>
      </>
          } />
          <Route path="/recipes" element={<RecipesPage foodList={foodList} />} />
        </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
