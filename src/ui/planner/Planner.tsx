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
import { getAllCoursesObject, getUserData, modifyUserChosenCourse, removeUserChosenCourse } from '../../service/DatabaseService';
import { Course } from '../../models/Course';
import { kNavigateOnNotAuthenticated } from '../../Constants';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../service/AuthService';
import { useNavigate } from 'react-router-dom';
import { FirestoreError } from '@firebase/firestore';
import { ChosenCourse } from '../../models/ChosenCourse';

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
  const [user, authLoading, authError] = useAuthState(auth);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [columns, setColumns] = useState<{
    [key: string]: {
      id: string,
      title: string,
      courses: Course[],
    },
  }>({
    'allCourses': {
      id: "allCourses",
      title: 'Course List',
      courses: [],
    },
    'summer': {
      id: "summer",
      title: 'Summer 1 & 2',
      courses: [],
    },
    'spring': {
      id: "spring",
      title: 'Spring',
      courses: [],
    },
    'winter': {
      id: "winter",
      title: 'Winter-mester',
      courses: [],
    },
    'fall': {
      id: "fall",
      title: 'Fall',
      courses: [],
    }
  });
  const [columnOrder, setColumnOrder] = useState<string[]>(['allCourses', 'summer', 'spring', 'winter', 'fall']);
  const [year, setYear] = useState<number>(2022);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (errorMessage.length > 0) {
      // TODO: Show error message on screen
      console.error(errorMessage);
    }
  }, [errorMessage]);

  useEffect(() => {
    const fetchAllCourses = async () : Promise<Course[] | undefined> =>  {
      try {
        console.log('fetching courses...');
        const courses = await getAllCoursesObject();
        if (courses === null) {
          return;
        }

        setAllCourses(courses);
        // const allCourseIds = courses.map((course) => {
        //   return course.courseId;
        // });
  
        setColumns((columns) => {
          return {
            ...columns,
            'allCourses': {
              id: "allCourses",
              title: 'Course List',
              courses: courses,
            },
          }
        });

        return courses;
      } catch (e) {
        if (e instanceof FirestoreError) {
          setErrorMessage('all-courses-get-failed')
        } else {
          setErrorMessage('all-courses-get-failed')
        }
        return;
      }
    }

    const fetchChosenCourses = async () => {
      setLoading(true);
      const allCourses = await fetchAllCourses();
      console.log('fetching chosen courses...');
      const userData = await getUserData();
      setLoading(false);
      if (userData === null || allCourses === undefined) return;

      const summerCourses: Course[] = [];
      const springCourses: Course[] = [];
      const winterCourses: Course[] = [];
      const fallCourses: Course[] = [];
      userData.chosenCourses.forEach((chosenCourse) => {
        const fullChosenCourse = allCourses.find((course) => {
          return course.courseId === chosenCourse.courseId;
        });

        if (fullChosenCourse === undefined) return

        if (chosenCourse.semester === 'summer' && chosenCourse.year === year) {
          summerCourses.push(fullChosenCourse);
        } else if (chosenCourse.semester === 'spring' && chosenCourse.year === year) {
          springCourses.push(fullChosenCourse);
        } else if (chosenCourse.semester === 'winter' && chosenCourse.year === year) {
          winterCourses.push(fullChosenCourse);
        } else if (chosenCourse.semester === 'fall' && chosenCourse.year === year) {
          fallCourses.push(fullChosenCourse);
        }
      })

      setColumns((columns) => {
        return {
          ...columns,
          'summer': {
            id: "summer",
            title: 'Summer 1 & 2',
            courses: summerCourses,
          },
          'spring': {
            id: "spring",
            title: 'Spring',
            courses: springCourses,
          },
          'winter': {
            id: "winter",
            title: 'Winter-mester',
            courses: winterCourses,
          },
          'fall': {
            id: "fall",
            title: 'Fall',
            courses: fallCourses,
          }
        }
      });
      
      // Set column order
      setColumnOrder(['allCourses', 'summer', 'spring', 'winter', 'fall']);
    }

    fetchChosenCourses();
  }, [year]);

  useEffect(() => {
    
    if (authLoading) {

    }
    else if (authError) {
      console.warn(authError.message)
    }
    else if (!user) {
      navigate(kNavigateOnNotAuthenticated, { replace: true });
    }
    else if (user) {

    }
    
  }, [user, authLoading, authError, navigate]);

  const [searchTerm, setSearchTerm] = useState('');
  const onChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

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
      const newCourses = Array.from(startColumn.courses);
      const [draggedCourse] = newCourses.splice(source.index, 1);

      newCourses.splice(destination.index, 0, draggedCourse);

      const newColumn = {
        ...startColumn,
        courses: newCourses,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
    }
    // Moving from one list to another
    else {
      const startColumnCourses = Array.from(startColumn.courses);
      const [draggedCourse] = startColumnCourses.splice(source.index, 1);

      const newStartColumn = {
        ...startColumn,
        courses: startColumnCourses,
      };

      const finishColumnCourses = Array.from(finishColumn.courses);

      finishColumnCourses.splice(destination.index, 0, draggedCourse);

      const newFinishColumn = {
        ...finishColumn,
        courses: finishColumnCourses,
      };
      

      setColumns({
        ...columns,
        [newStartColumn.id]: newStartColumn,
        [newFinishColumn.id]: newFinishColumn,
      });

      // Make firebase call to update data only if semester changed
      if (newFinishColumn.id === 'allCourses') {
        removeUserChosenCourse(draggedCourse.courseId);
      } else {
        modifyUserChosenCourse(new ChosenCourse(draggedCourse.courseId, newFinishColumn.id, year));
      }
    }
  };

  return (
    <div className="App">
      {/* <Home><Header>MAV DEGREE PLANNER</Header></Home> */}
      <DragDropContext onDragEnd={onDragEnd}>
        <input placeholder="Search..." onChange={onChange} />
        <Container>
          {columnOrder.map((columnId: string) => {
            if (columnId === 'allCourses') {
              const column = columns['allCourses'];

              const filteredCourses = column.courses
                .filter((course) => {
                  return searchTerm === ''
                    || course.description.toLowerCase().includes(searchTerm.toLowerCase())
                    || course.courseId.toLowerCase().includes(searchTerm.toLowerCase())
                    || course.courseNumber.toString().includes(searchTerm.toLowerCase())
                    || course.department.toString().includes(searchTerm.toLowerCase())
                });
              
              return (
                <Column
                  key={column.id}
                  column={column}
                  courses={filteredCourses}
                />
              );
            }
            
            const column = columns[columnId];
            
            return (
              <Column
                key={column.id}
                column={column}
                courses={column.courses}
              />
            );
          })}
        </Container>
      </DragDropContext>
    </div>
  );
}

export default Planner;
