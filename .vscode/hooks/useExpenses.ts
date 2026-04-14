import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";

export function useExpenses() {
  const [expenses, setExpenses] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "expenses"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExpenses(data);
    });

    return () => unsub();
  }, []);

  return expenses;
}