import { app } from './FirebaseSetup';
import { Course } from '../models/Course';
import { 
  getFirestore,
  Firestore,
  collection,
  getDocs,
  DocumentData,
  QuerySnapshot,
  QueryDocumentSnapshot,
  getDoc,
  doc,
  DocumentSnapshot,
  setDoc,
  onSnapshot,
  FirestoreError,
  SnapshotOptions
} from 'firebase/firestore';
import { Availability } from '../models/Availability';
import { Major, majorEnumFromString } from '../models/MajorEnum';
import { UserData } from '../models/UserData';
import { auth } from './AuthService';
import { ChosenCourse } from '../models/ChosenCourse';
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

const db: Firestore = getFirestore(app);

const userDataConverter = {
  toFirestore(data: UserData): DocumentData {
    return {uid: data.uid, major: data.major, startingSemester: data.startingSemester};
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): UserData {
    const data = snapshot.data(options)!;
    const uid: string = data.uid;
    const major: string = data.major
    const startingSemester: string = data.startingSemester;

    const chosenCourses: ChosenCourse[] = [];
    for (let i = 0; i < data.chosenCourses.length; i++) {
      const chosenCourseMap = data.chosenCourses[i];
      if (chosenCourseMap !== undefined) {
        const chosenCourse = new ChosenCourse(
          chosenCourseMap.courseId,
          chosenCourseMap.semester,
        );
        chosenCourses.push(chosenCourse);
      }
    }

    const coursesTaken: string[] = [];
    for (let i = 0; i < data.coursesTaken.length; i++) {
      const course = data.requiredInMajors[i];
      if (course !== undefined) {
        coursesTaken.push(course);
      }
    }

    return new UserData(uid, major, startingSemester, chosenCourses, coursesTaken);
  }
};

const userDataDocument = (userId: string) => doc(db, 'users', userId).withConverter(userDataConverter);

/**
 * @deprecated Since version Feb 20, 2022. Will be deleted soon. Use `getAllCoursesObject` instead.
 */
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

/**
 * Retrieve all available courses from Firestore
 * @returns Courses
 */
const getAllCoursesObject = async (): Promise<Course[] | null> => {
  const allCoursesCol = collection(db, 'allCourses');
  const courses : Course[] | null = await getDocs(allCoursesCol)
    .then((snapshot: QuerySnapshot<DocumentData>) => {
      let documents: DocumentData[] = [];
      let courses: Course[] = [];
      for (let i = 0; i < snapshot.docs.length; i++) {
        const documentSnapshot: QueryDocumentSnapshot<DocumentData> | undefined = snapshot.docs.at(i);
        if (documentSnapshot !== undefined && documentSnapshot.exists()) {
          const data = documentSnapshot.data();
          documents.push(data);

          const availabilityMap = data.availability;
          const availability = new Availability(
            availabilityMap.fall,
            availabilityMap.spring,
            availabilityMap.summer,
          );
          const requiredInMajors: Major[] = [];
          
          for (let i = 0; i < data.requiredInMajors.length; i++) {
            const major = majorEnumFromString(data.requiredInMajors[i]);
            if (major !== undefined) {
              requiredInMajors.push(major);
            }
          }

          const course = new Course(
            documentSnapshot.id,
            data.coreqIds,
            data.prereqIds,
            data.courseId,
            data.courseNumber,
            data.department,
            data.description,
            requiredInMajors,
            availability,
          );

          courses.push(course);
        }
      }
      return courses;
    })
    .catch((error) => {
      alert(error.message)
      return null;
    })
  
  return courses;
};

/**
 * Retrieve the user data from Firestore
 * @returns UserData
 * @throws FirestoreError
 */
const getUserData = async (): Promise<UserData | null> => {
  const userId = auth.currentUser?.uid;
  if (userId === null || userId === undefined) return null;

  const userSnapshot = await getDoc(userDataDocument(userId));
  const userData = userSnapshot.data()
  if (userData === undefined) {
    return null
  }

  return userData;
};


/**
 * Update the user data in Firestore
 * @param userData 
 * @returns success
 * @throws FirestoreError
 */
const setUserData = async (userData: UserData): Promise<boolean> => {
  const userId = auth.currentUser?.uid;
  if (userId === null || userId === undefined) return false;

  await setDoc(userDataDocument(userId), userData).catch((error) => {
    alert(error.message)
    return false;
  });
  return true;
};

// export const streamUserData = (next: ((snapshot: UserData) => void) | undefined, error) => {
//   const userId = auth.currentUser?.uid;
//   if (userId === null || userId === undefined) return false;

//   const userDoc = doc(db, 'users', userId);
//   const unsubscribe = onSnapshot(
//     ,
//     (snapshot: UserData) => {

//     },
//     (error: FirestoreError) => {
      
//     },
//   );
//   return unsubscribe;
// };

export { db, userDataDocument, getAllCourses, getAllCoursesObject, getUserData, setUserData };