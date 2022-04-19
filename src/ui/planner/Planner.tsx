import {useRef, useState, useEffect } from 'react';
import {
  DragDropContext,
  DragStart,
  DragUpdate,
  Droppable,
  ResponderProvided,
} from 'react-beautiful-dnd';
import Column, {Container as ColumnContainer, Title as ColumnTitle, CourseList} from './Column';
import CourseReact, {Container as CourseContainer} from './CourseReact';
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
import ReactTooltip from "react-tooltip";
import './Planner.css';
const Container = styled.div`
  display: flex;
`;

const SearchBar = styled.input`
  margin: 10px;
  width: 90%;
  align-self: center;
  &:focus {
     transition: all 0.5s;
     box-shadow: 0 0 40px  #1E56A0;
     border-color: #163172;
     outline: none;
  }
`;

const ChosenYear = styled.div`
  padding: 10px; 
  margin: auto;
  font-size: 22px;
  font-weight: bold;
  text-shadow: 2px 2px 1px #647885;
  width: fit-content;
  &:hover {
    box-shadow: 0 0 100px black;
    border-left: dashed;
    border-right: dashed;
 }
`;


function Planner() {
  const [user, authLoading, authError] = useAuthState(auth);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  // const [coursesTaken, setCoursesTaken] = useState<ChosenCourse[]>([]);
  const takenRef = useRef<ChosenCourse[]>([]);
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
  const [isDropDisabled, setIsDropDisabled] = useState(false);

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

      if (takenRef.current == null) {
        takenRef.current = userData.chosenCourses;
      }
      else {
        userData.chosenCourses.forEach((courseTaken) => {
          if ((takenRef.current.findIndex(ifExisted => ifExisted.courseId === courseTaken.courseId) === -1)) {
            takenRef.current.push(courseTaken);
          }
        })
      }

      userDataYear.current = Number(userData.startingYear);
      console.log("Year is: " + userDataYear.current);

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
      // setCoursesTaken(userData.chosenCourses);
  
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
      setColumnOrder(['allCourses', 'spring', 'summer', 'fall', 'winter']);
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

  const onDragStart = (start: DragStart, provided: ResponderProvided) => {
    setIsDropDisabled(false);
    /*-------Screen reader support-------*/
    provided.announce(`You have chosen a course at ${start.source.droppableId}`);
    /*-------Screen reader support-------*/ 
  };

  const onDragUpdate = (update: DragUpdate, provided: ResponderProvided) => {
    /*-------Screen reader support-------*/
    const message = update.destination
      ? `You have moved the course to position ${update.destination.droppableId}`
      : `You are currently not over a droppable area`;

    provided.announce(message);
    /*-------Screen reader support-------*/
  }

  const onDragEnd = (result: DragUpdate, provided: ResponderProvided) => {
    const { source, destination, draggableId } = result;
    /*-------Screen reader support-------*/
    const message = result.destination
      ? `You have moved the course from
        ${source.droppableId} to ${result.destination.droppableId}`
      : `The course has been returned to its starting position of
        ${source.droppableId}`;
      
    provided.announce(message);
    /*-------Screen reader support-------*/

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

    if (finishColumn.id === "allCourses") setIsDropDisabled(false);

    // Drag and drop within the same column
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
        takenRef.current = takenRef.current.filter((removeCourse => {
          return removeCourse.courseId !== draggedCourse.courseId;
        }))
      } else {
        modifyUserChosenCourse(new ChosenCourse(
          draggedCourse.courseId,
          newColumn.id,
          year,
        ));
      }
      return;
    }
    // Moving from one column to another
    else {
      const startColumnCourses = Array.from(startColumn.courses);
      const [draggedCourse] = startColumnCourses.splice(source.index, 1);

      const finishColumnCourses = Array.from(finishColumn.courses);
      finishColumnCourses.splice(destination.index, 0, draggedCourse);

      const index = columnOrder.indexOf(finishColumn.id);

      /************* PREREQUISITE CHECKING ****************/
      if (draggedCourse.prereqIds.length === 0 || finishColumn.id == "allCourses") {
        setIsDropDisabled(false);
      }
      else {
        let prereqPass = 0;
        draggedCourse.prereqIds.forEach((prereq) => {
          takenRef.current.forEach(course => {
            if (prereq == course.courseId) {
              if (course.year == year) {
                const i = columnOrder.indexOf(course.semester);
                if (i < index) prereqPass++;
              }
              else if (course.year < year) prereqPass++;
            }
          });
        })
        if (prereqPass === draggedCourse.prereqIds.length) {
          setIsDropDisabled(false);
        }
        else {
          var div = document.getElementById(draggedCourse.courseId);
          if (div != null) div.style.border = "2px solid #FF5F00";
          setTimeout(() => {
            if (div != null) div.style.border = "1px solid black";
          }, 2000);

          setIsDropDisabled(true);
          return;
        }
      }
      console.log("isDropDisabled = ", isDropDisabled);
      /************* PREREQUISITE CHECKING ****************/

      /************* COREQUISITE CHECKING ****************/
      if (finishColumn.id !== "allCourses") {
        draggedCourse.coreqIds.forEach((ifCoreq) => {
          if (ifCoreq !== null && (takenRef.current.findIndex(existed => existed.courseId === ifCoreq) === -1)) {
            let index = 0;
            for (var i = 0 ; i < startColumnCourses.length ; i++) {
              if (startColumnCourses[i].courseId === ifCoreq) {
                index = i;
              }
            }
            const [coreq] = startColumnCourses.splice(index, 1);
            console.log(coreq, index);
            finishColumnCourses.splice(destination.index, 0, coreq);
          }
        })
      }
      /************* COREQUISITE CHECKING ****************/
      
      const newStartColumn = {
        ...startColumn,
        courses: startColumnCourses,
      };

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
        takenRef.current = takenRef.current.filter((removeCourse => {
          return removeCourse.courseId !== draggedCourse.courseId;
        }))
      } else {
        modifyUserChosenCourse(new ChosenCourse(
          draggedCourse.courseId,
          newFinishColumn.id,
          year,
        ));
        if ((takenRef.current.findIndex(existed => existed.courseId === draggedCourse.courseId) === -1)) {
          takenRef.current.push(new ChosenCourse(draggedCourse.courseId, newFinishColumn.id, year));
        }
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

 
  const changeDegreeYear = (year: number) =>
  {
    setYear(year);
  };

  return (
    <div className="App" style={{backgroundColor: "#c2b6b6",backgroundImage: "linear-gradient(315deg, #c2b6b6 0%, #576574 74%)"}}>
      <Sidebar/>
      <ChosenYear id="year">
        <label style={{padding:"10px"}}>
          CURRENT YEAR:
        </label>
        <select
          className="selectbox_year"
          required
          value={chosenYear}
          onChange={(e) => {
            changeDegreeYear(Number(e.target.value ?? '2022'));
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
      </ChosenYear>
     
      <DragDropContext onDragStart={onDragStart} onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
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
                <ColumnContainer style={{flex: 1.5, overflow : "auto", background: "white"}}>
                  <ColumnTitle>{column.title}</ColumnTitle>
                  <SearchBar type="search" placeholder="Search..." onChange={onChange} />
                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <CourseList ref={provided.innerRef} {...provided.droppableProps}>
                        {filteredCourses.map((course, index) => (
                          <CourseReact key={course.firebaseId} course={course} index={index} />
                        ))}
                        {provided.placeholder}
                      </CourseList>
                    )}
                  </Droppable>
                </ColumnContainer> 
              );
            }
            else {
              const column = columns[columnId];
              
              return (
                <Column
                  key={column.id}
                  column={column}
                  courses={column.courses}
                  isDropDisabled={isDropDisabled}
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
