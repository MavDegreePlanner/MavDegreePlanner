// import { useNavigate } from 'react-router-dom';
import {useRef, useState, useEffect } from 'react';
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
import { getAllCourses, getUserData, modifyUserChosenCourse, removeUserChosenCourse, userDataDocument } from '../../service/DatabaseService';
import { Course } from '../../models/Course';
import { kNavigateOnNotAuthenticated } from '../../Constants';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../service/AuthService';
import { useNavigate } from 'react-router-dom';
import { FirestoreError } from '@firebase/firestore';
import { ChosenCourse } from '../../models/ChosenCourse';
import Sidebar from './../Sidebar'


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
  
  
  
  
  const userDataYear = useRef(2022);
  const [chosenYear, setChosenYear] = useState(2022);
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
        const courses = await getAllCourses();
        if (courses === null) {
          return;
        }

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
      if (allCourses === undefined) return;

      console.log('fetching chosen courses...');
      const userData = await getUserData();
      
      setLoading(false);
      if (userData === null) {
        setAllCourses(allCourses);
  
        setColumns((columns) => {
          return {
            ...columns,
            'allCourses': {
              id: "allCourses",
              title: 'Course List',
              courses: allCourses,
            },
          }
        });
        return;
      };
      userDataYear.current = Number(userData.startingYear);
      console.log("Year is: " + userDataYear.current)
      const summerCourses: Course[] = [];
      const springCourses: Course[] = [];
      const winterCourses: Course[] = [];
      const fallCourses: Course[] = [];

      userData.chosenCourses.forEach((chosenCourse) => {
        const fullChosenCourse = allCourses.find((course) => {
          return course.courseId === chosenCourse.courseId;
        });

        if (fullChosenCourse === undefined) return

        const index = allCourses.indexOf(fullChosenCourse, 0);
        if (index > -1) {
          allCourses.splice(index, 1);
        }

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
      
      setAllCourses(allCourses);
  
      setColumns((columns) => {
        return {
          ...columns,
          'allCourses': {
            id: "allCourses",
            title: 'Course List',
            courses: allCourses,
          },
        }
      });

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

      // Make firebase call to update data only if semester changed
      if (newColumn.id === 'allCourses') {
        removeUserChosenCourse(draggedCourse.courseId);
      } else {
        modifyUserChosenCourse(new ChosenCourse(
          draggedCourse.courseId,
          newColumn.id,
          year,
        ));
      }
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
        modifyUserChosenCourse(new ChosenCourse(
          draggedCourse.courseId,
          newFinishColumn.id,
          year,
        ));
      }
    }
  };

  // const fetchyear = async () => 
  // {
  //   const userDataYear = await getUserData();
  //   const state = {
  //     genres: [
  //       { key: userDataYear.startingYear, value: "1", display: "Action" },
  //       { key: 1001, value: "2", display: "Adventure" },
  //       { key: 1002, value: "3", display: "Comedy" }
  //     ],
  //     selected: '' // A default value can be used here e.g., first element in genres
  //   };
  // }

 
  const changeDegreeyear = (e: any) =>
  {
    setYear(e);
    
  };
  
  return (
    <div className="App" style={{backgroundColor: "#c2b6b6",backgroundImage: "linear-gradient(315deg, #c2b6b6 0%, #576574 74%)"}}>
      <Sidebar/>
      <div>
        <label>
          Chosen Year
        </label>
        <select
          className="selectbox_year"
          required
          value={chosenYear}
          onChange={(e) => {
            changeDegreeyear(e.target.value ?? 2022);
            console.log("Chosen year: " + e.target.value);
            userDataYear.current = Number(e.target.value)
            setChosenYear(userDataYear.current)
            console.log("Updated year: " + userDataYear.current);
          }}
        >
          <option value={userDataYear.current}>{userDataYear.current}</option>
          <option value={userDataYear.current + 1}>{userDataYear.current + 1}</option>
          <option value={userDataYear.current + 2}>{userDataYear.current + 2}</option>
          <option value={userDataYear.current + 3}>{userDataYear.current + 3}</option>
        </select>
      </div>
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
                    || course.department.toLowerCase().includes(searchTerm.toLowerCase())
                    || (course.courseId + " - " + course.description).toLowerCase().includes(searchTerm.toLowerCase())
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
