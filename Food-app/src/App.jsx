import { useState } from 'react';
import { db } from './firebaseconfig';
import { collection, addDoc } from 'firebase/firestore';

function App() {
	const [foodItem, setFoodItem] = useState('');
	const [date, setDate] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const docRef = await addDoc(collection(db, 'foods'), {
				foodItem,
				date,
			});
			console.log('Document written with ID: ', docRef.id);
			setFoodItem('');
			setDate('');
			alert('Data added successfully');
		} catch (e) {
			console.error('Error adding document: ', e);
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<label>
					Food Item:
					<input
						type='text'
						value={foodItem}
						onChange={(e) => setFoodItem(e.target.value)}
					/>
				</label>
				<label>
					Date:
					<input
						type='date'
						value={date}
						onChange={(e) => setDate(e.target.value)}
					/>
				</label>
				<button type='submit'>Add to Database</button>
			</form>
		</div>
	);
}

export default App;
