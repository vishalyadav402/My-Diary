"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/app/firebase/config";

export default function AllProfessionals() {
  const [professionals, setProfessionals] = useState([]);

  useEffect(() => {
    const fetchProfessionals = async () => {
      const q = query(collection(db, "professionals"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProfessionals(data);
    };

    fetchProfessionals();
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">All Skilled Professionals</h2>
      {professionals.length === 0 ? (
        <p>No professionals found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {professionals.map((pro) => (
            <div
              key={pro.id}
              className="border p-4 rounded-lg shadow-md bg-white"
            >
              <p><strong>Name:</strong> {pro.name}</p>
              <p><strong>Mobile:</strong> {pro.mobile}</p>
              <p><strong>Location:</strong> {pro.location}</p>
              <p><strong>Category:</strong> {pro.category}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
