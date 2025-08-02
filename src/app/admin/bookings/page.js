"use client"
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function Page() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      setBookings(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">All Bookings</h1>
      {bookings.map(b => (
        <div key={b.id} className="border p-2 mb-2 rounded">
          <div><strong>Name:</strong> {b.name}</div>
          <div><strong>Date:</strong> {b.date}</div>
          <div><strong>Service:</strong> {b.service}</div>
        </div>
      ))}
    </div>
  );
}
