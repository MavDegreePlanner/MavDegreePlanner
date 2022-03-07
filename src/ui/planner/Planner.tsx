// import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  DragDropContext,
  // Draggable,
  // DraggableProvided,
  // DraggableStateSnapshot,
  DragUpdate,
  // Droppable,
  // DropResult,
} from 'react-beautiful-dnd';
import Column from './Column';
// import CourseReact from './CourseReact';
import styled from 'styled-components';
import { getAllCoursesObject, getUserData, streamUserData } from '../../service/DatabaseService';
import { Course } from '../../models/Course';
import { kNavigateOnNotAuthenticated } from '../../Constants';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../service/AuthService';
import { useNavigate } from 'react-router-dom';
import { UserData } from '../../models/UserData';
import { FirestoreError } from '@firebase/firestore';

// const Header = styled.div`
//   font-size: 40px;
//   text-align: center;
//   padding-top: 20px;
//   padding-bottom: 20px;
//   background-color: black;
//   color: rgba(255, 255, 255, 0.829);
// `;

// const Home = styled.div`
//   background-size: 100%;
//   background-position: top;
//   height: 100vh;
// `;

const Container = styled.div`
  display: flex;
`;

// const DropContainer = styled.div`
//   background-color: #e1f2fb;
//   margin: 5px;
//   border: 1px double lightgray;
//   border-radius: 5%;
//   flex: 1;
//   display: flex;
//   flex-direction: column;
// `;
// const Title = styled.h3`
//   padding: 8px;
// `;
// const CourseList = styled.div<any>`
//   padding: 10px;
//   background-color: ${(props: any) =>
//     props.isDraggingOver ? '#e0e0e0' : '#fff'};
//   flex: 1;
//   min-height: 50%;
// `;

// const CourseContainer = styled.div<any>`
//   border: 1px solid #bbded6;
//   border-radius: 10%;
//   padding: 8px;
//   margin-bottom: 8px;
//   background-color: ${(props: any) => (props.isDragging ? '#8AC6D1' : '#fff')};
//   display: flex;
// `;

// const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
//   padding: 10,
//   background: isDragging ? '#4a2975' : 'white',
//   color: isDragging ? 'white' : 'black',

//   ...draggableStyle,
// });

function Planner() {
  const [user, loading, authError] = useAuthState(auth);
  const [error, setError] = useState<string>();
  const [userData, setUserData] = useState<UserData>();
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [columns, setColumns] = useState<{
    [key: string]: {
      id: string,
      title: string,
      courseIds: string[],
    },
  }>({
    'allCourses': {
      id: "allCourses",
      title: 'Course List',
      courseIds: [],
    },
    'summer': {
      id: "summer",
      title: 'Summer 1 & 2',
      courseIds: [],
    },
    'spring': {
      id: "spring",
      title: 'Spring',
      courseIds: [],
    },
    'winter': {
      id: "winter",
      title: 'Winter-mester',
      courseIds: [],
    },
    'fall': {
      id: "fall",
      title: 'Fall',
      courseIds: [],
    }
  });
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [year, setYear] = useState<number>(2022);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = streamUserData(
      (userData) => {
        setUserData(userData);const summerCourses: string[] = [];
        const springCourses: string[] = [];
        const winterCourses: string[] = [];
        const fallCourses: string[] = [];
        userData.chosenCourses.forEach((course) => {
          if (course.semester === 'summer' && course.year === year) {
            summerCourses.push(course.courseId);
          } else if (course.semester === 'spring' && course.year === year) {
            springCourses.push(course.courseId);
          } else if (course.semester === 'winter' && course.year === year) {
            winterCourses.push(course.courseId);
          } else if (course.semester === 'fall' && course.year === year) {
            fallCourses.push(course.courseId);
          }
        })
  
        setColumns((columns) => {
          return {
            ...columns,
            'summer': {
              id: "summer",
              title: 'Summer 1 & 2',
              courseIds: summerCourses,
            },
            'spring': {
              id: "spring",
              title: 'Spring',
              courseIds: springCourses,
            },
            'winter': {
              id: "winter",
              title: 'Winter-mester',
              courseIds: winterCourses,
            },
            'fall': {
              id: "fall",
              title: 'Fall',
              courseIds: fallCourses,
            }
          }
        });
        
        // Set column order
        setColumnOrder(['allCourses', 'summer', 'spring', 'winter', 'fall']);
      },
      (onError) => {
        setError('user-data-get-fail');
        console.log(onError.message);
      },
    );
    if (unsubscribe === null) return;

    return unsubscribe;
  }, [year]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses = await getAllCoursesObject();
        if (courses === null) {
          return;
        }
  
        setAllCourses(courses);
        const allCourseIds = courses.map((course) => {
          return course.courseId;
        });
  
        setColumns((columns) => {
          return {
            ...columns,
            'allCourses': {
              id: "allCourses",
              title: 'Course List',
              courseIds: allCourseIds,
            },
          }
        });
      } catch (e) {
        if (e instanceof FirestoreError) {
          setError('all-courses-get-failed')
          console.log(e.message);
        } else {
          setError('all-courses-get-failed')
          console.log('all-courses-get-failed');
        }
      }

    }
    if (loading) return;
    if (!user) return navigate(kNavigateOnNotAuthenticated);

    if (user) {
      fetchCourses();
    }
    
  }, [user, loading, navigate]);

  const [searchTerm, setSearchTerm] = useState('');
  const onChange = (event: any) => {
    setSearchTerm(event.target.value);
  };
  
  // const [courseCatalog, setCourseCatalog] = useState<{
  //   courseList: any;
  //   columns: any;
  //   columnOrder: string[];
  // }>(initialData);

  // useEffect(() => {
  //   const fetchCourse = async () => {
      
  //     const event = query(collection(db, 'allCourses'));
  //     const querySnapShot = await getDocs(event);
  //     const tempList: any = [];

  //     querySnapShot.forEach((doc) => {
  //       tempList.push({ id: doc.id, ...doc.data() });
  //     });

  //     setCourseCatalog({
  //       ...courseCatalog,
  //       courseList: tempList,
  //       columns: {
  //         ...courseCatalog.columns,
  //         allCourses: {
  //           ...courseCatalog.columns.allCourses,
  //           courseIds: tempList,
  //         },
  //       },
  //     });
  //   };

  //   fetchCourse();
    
  // }, []);

  const onDragEnd = (result: DragUpdate) => {
    const { source, destination, draggableId } = result;

    // Check if destination is droppable area
    if (!destination) return;

    // Check if the item is (actually) moved
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (columns === null) return;

    // startColumn: where the item from
    // finishColumn: where the item being dropped in
    const startColumn = columns[source.droppableId];
    const finishColumn = columns[destination.droppableId];

    if (startColumn === finishColumn) {
      const newCourseIds = Array.from(startColumn.courseIds);
      const [draggedCourse] = newCourseIds.splice(source.index, 1);

      newCourseIds.splice(destination.index, 0, draggedCourse);

      const newColumn = {
        ...startColumn,
        courseIds: newCourseIds,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });

      // TODO(@getBoolean): Change to make firebase call to update data
    }
    // Moving from one list to another
    else {
      const startColumnCourseIds = Array.from(startColumn.courseIds);
      const [draggedCourse] = startColumnCourseIds.splice(source.index, 1);

      const newStartColumn = {
        ...startColumn,
        courseIds: startColumnCourseIds,
      };

      const finishColumnCourseIds = Array.from(finishColumn.courseIds);

      finishColumnCourseIds.splice(destination.index, 0, draggedCourse);

      const newFinishColumn = {
        ...finishColumn,
        courseIds: finishColumnCourseIds,
      };
      

      setColumns({
        ...columns,
        [newStartColumn.id]: newStartColumn,
        [newFinishColumn.id]: newFinishColumn,
      });


      // TODO(@getBoolean): Change to make firebase call to update data
    }
  };

  return (
    <div className="App">
      {/* <Home><Header>MAV DEGREE PLANNER</Header></Home> */}
      <DragDropContext onDragEnd={onDragEnd}>
        <input placeholder="Search..." onChange={onChange} />
        <Container>
          {columnOrder.map(() => {
            if (columns === null) {
              console.log('columns is null');
              return;
            };

            const column = columns['allCourses'];

            Object.keys(column.courseIds)
              .filter((course: string) => {
                return searchTerm === '' ||
                  course.toLowerCase().includes(searchTerm.toLowerCase())
              })
              .map((course) => {
                return (
                  <Column
                    key={columns.allCourses.id}
                    column={columns.allCourses}
                    courses={course}
                  />
                );
              });
          })}
          {columnOrder.map((columnId: string) => {
            if (columns === null) {
              console.log('columns is null');
              return;
            };
            
            const column = columns[columnId];
            if (columnId !== 'allCourses') {
              return (
                <Column
                  key={column.id}
                  column={column}
                  courses={column.courseIds}
                />
              );
            }
          })}
        </Container>
      </DragDropContext>
    </div>
  );
}

export default Planner;
