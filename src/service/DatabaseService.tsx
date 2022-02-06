import { app } from './FirebaseSetup';
import {
  getFirestore,
  Firestore,
  collection,
  getDocs,
  DocumentData,
} from 'firebase/firestore/lite';
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

const db: Firestore = getFirestore(app);

const getAllCourses = async (): Promise<DocumentData[] | null> => {
  const allCoursesCol = collection(db, 'allCourses');
  return await getDocs(allCoursesCol)
    .then((snapshot) => {
      return snapshot.docs.map((doc) => doc.data());
    })
    .catch((error) => {
      return null;
    });
};

export { db, getAllCourses };
