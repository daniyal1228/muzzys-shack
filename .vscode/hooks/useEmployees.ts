import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";

export function useEmployees() {
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "employees"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmployees(data);
    });

    return () => unsub();
  }, []);

  return employees;
}