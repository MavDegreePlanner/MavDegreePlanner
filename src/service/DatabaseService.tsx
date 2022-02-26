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
    return {
      uid: data.uid,
      name: data.name,
      email: data.email,
      major: data.major,
      startingSemester: data.startingSemester,
      startingYear: data.startingYear,
      chosenCourses: data.chosenCourses,
      coursesTaken: data.coursesTaken,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): UserData {
    const data = snapshot.data(options)!;
    const uid: string = data.uid;
    const name: string = data.name;
    const email: string = data.email;
    const major: string = data.major;
    const startingSemester: string = data.startingSemester;
    const startingYear: string = data.startingYear;

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

    return new UserData(
      uid,
      name,
      email,
      major,
      startingSemester,
      startingYear,
      chosenCourses,
      coursesTaken
    );
  }
};

const allCoursesConverter = {
  toFirestore(course: Course): DocumentData {
    return {
      firebaseId: course.firebaseId,
      courseId: course.courseId,
      coreqIds: course.coreqIds,
      prereqIds: course.prereqIds,
      courseNumber: course.courseNumber,
      department: course.department,
      description: course.description,
      requiredInMajors: course.requiredInMajors,
      availability: course.availability,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Course {
    const data = snapshot.data(options)!;

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
      snapshot.id,
      data.coreqIds,
      data.prereqIds,
      data.courseId,
      data.courseNumber,
      data.department,
      data.description,
      requiredInMajors,
      availability,
    );

    return course;
  }
};

const userDataDocument = (userId: string) => doc(db, 'users', userId).withConverter(userDataConverter);
const allCoursesCollection = collection(db, 'allCourses').withConverter(allCoursesConverter);

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
  const courses : Course[] | null = await getDocs(allCoursesCollection)
    .then((snapshot: QuerySnapshot<Course>) => {
      let courses: Course[] = [];
      for (let i = 0; i < snapshot.docs.length; i++) {
        const documentSnapshot: QueryDocumentSnapshot<Course> | undefined = snapshot.docs.at(i);
        if (documentSnapshot !== undefined && documentSnapshot.exists()) {
          const data = documentSnapshot.data();
          
          courses.push(data);
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

const streamUserData = (
  onUserData: (userData: UserData) => void,
  onError?: ((error: FirestoreError) => void) | undefined,
  onComplete?: (() => void) | undefined,
) => {
  const userId = auth.currentUser?.uid;
  if (userId === null || userId === undefined) return false;

  const unsubscribe = onSnapshot(userDataDocument(userId), {
    next: (snapshot: DocumentSnapshot<UserData>) => {
      const data = snapshot.data();
      if (data !== undefined) {
        onUserData(data);
      }
    },
    error: (error: FirestoreError) => {
      onError?.call(this, error);
    },
    complete: () => {
      onComplete?.call(this);
    },
  });

  return unsubscribe;
};

export {
  db,
  userDataDocument,
  getAllCourses,
  getAllCoursesObject,
  getUserData,
  setUserData,
  streamUserData,
};