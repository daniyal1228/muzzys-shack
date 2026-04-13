import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../.expo/lib/firebase";

export function useRevenue() {
  const [revenue, setRevenue] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "revenue"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRevenue(data);
    });

    return () => unsub();
  }, []);

  return revenue;
}