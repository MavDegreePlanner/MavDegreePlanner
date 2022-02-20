import { app } from './FirebaseSetup';
import { Course } from '../models/Course';
import { 
  getFirestore,
  Firestore,
  collection,
  getDocs,
  DocumentData,
  QuerySnapshot,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { Availability } from '../models/Availability';
import { Major } from '../models/MajorEnum';
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

const db: Firestore = getFirestore(app);

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
          const getMajorEnumFromString = (majorString: string) : Major | undefined => {
            switch (majorString) {
              case "Software Engineering":
                return Major.SoftwareEngineering;
              case "Computer Engineering":
                return Major.ComputerEngineering;
              case "Computer Science":
                return Major.ComputerScience;
              default:
                console.log(`[ERROR]: Unknown required major for ${documentSnapshot.id} - "${majorString}"`);
                return undefined;
            }
          }
          for (let i = 0; i < data.requiredInMajors.length; i++) {
            const major = getMajorEnumFromString(data.requiredInMajors[i]);
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

export { db, getAllCourses, getAllCoursesObject };