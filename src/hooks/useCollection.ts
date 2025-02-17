import { useState, useEffect } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';

export const useCollection = <T>(collectionName: string) => {
  const [documents, setDocuments] = useState<(T & { id: string })[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    try {
      const q = query(
        collection(db, collectionName),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const docs: (T & { id: string })[] = [];
          snapshot.forEach((doc) => {
            docs.push({ ...(doc.data() as T), id: doc.id });
          });
          setDocuments(docs);
          setIsLoading(false);
        },
        (error) => {
          console.error('Error fetching collection:', error);
          setError('Failed to fetch data');
          setIsLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up collection listener:', err);
      setError('Failed to set up data listener');
      setIsLoading(false);
    }
  }, [collectionName]);

  return { documents, error, isLoading };
};
