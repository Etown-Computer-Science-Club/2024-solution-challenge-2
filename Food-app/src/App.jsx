import { useState } from "react";
import {useEffect} from "react";
import { db } from "./firebaseconfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

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

useEffect(() => {
	getfoods().then((foods) => setFoodList(foods))
}, [])

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Food Item:
          <input
            type="text"
            value={foodItem}
            onChange={(e) => setFoodItem(e.target.value)}
          />
        </label>
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <button type="submit">Add to Database</button>
      </form>

      <div>
        <h2>Food List</h2>
        <ul>
          {foodList.map((item) => (
            <li key={item.id}>
              {item.foodItem} - {item.date}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
