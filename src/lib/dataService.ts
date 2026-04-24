import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  updateDoc, 
  doc, 
  setDoc,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { calculateNextReview } from './srs';

export interface Card {
  id: string;
  front: string;
  back: string;
  category: string;
  tags?: string[];
}

export interface UserProgress {
  id?: string;
  userId: string;
  cardId: string;
  nextReview: Date;
  interval: number;
  easeFactor: number;
  reps: number;
  lastReviewed?: Date;
}

export async function fetchCards(category?: string): Promise<Card[]> {
  const cardsRef = collection(db, 'cards');
  const q = category ? query(cardsRef, where('category', '==', category)) : cardsRef;
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Card));
}

export async function fetchUserProgress(userId: string): Promise<UserProgress[]> {
  const progressRef = collection(db, 'userProgress');
  const q = query(progressRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      nextReview: (data.nextReview as Timestamp).toDate(),
      lastReviewed: data.lastReviewed ? (data.lastReviewed as Timestamp).toDate() : undefined
    } as UserProgress;
  });
}

export async function updateProgress(
  userId: string,
  cardId: string,
  quality: number,
  existingProgress?: UserProgress
) {
  const { interval, easeFactor, reps, nextReview } = calculateNextReview(
    quality,
    existingProgress?.interval || 0,
    existingProgress?.easeFactor || 2.5,
    existingProgress?.reps || 0
  );

  const progressData = {
    userId,
    cardId,
    interval,
    easeFactor,
    reps,
    nextReview: Timestamp.fromDate(nextReview),
    lastReviewed: serverTimestamp()
  };

  if (existingProgress?.id) {
    await updateDoc(doc(db, 'userProgress', existingProgress.id), progressData);
  } else {
    await addDoc(collection(db, 'userProgress'), progressData);
  }
}

export async function seedCards(cardsRaw: { front: string; back: string; category: string }[]) {
  const cardsRef = collection(db, 'cards');
  const snapshot = await getDocs(cardsRef);
  if (snapshot.empty) {
    console.log('Seeding cards...');
    for (const card of cardsRaw) {
      await addDoc(cardsRef, card);
    }
    console.log('Seeding complete.');
  }
}
