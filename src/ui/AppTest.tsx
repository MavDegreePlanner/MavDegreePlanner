import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  DragUpdate,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { query, collection, getDocs, doc } from 'firebase/firestore';
import db from './firebase.config';
import initialData from './initial-data';
import Column from './Column';
import Course from './Course';
import styled from 'styled-components';
import { getAllCoursesObject } from '../../service/DatabaseService';

const Header = styled.div`
  font-size: 40px;
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: black;
  color: rgba(255, 255, 255, 0.829);
`;

const Home = styled.div`
  background-size: 100%;
  background-position: top;
  height: 100vh;
`;

const Container = styled.div`
  display: flex;
`;

const DropContainer = styled.div`
  background-color: #e1f2fb;
  margin: 5px;
  border: 1px double lightgray;
  border-radius: 5%;
  flex: 1;
  display: flex;
  flex-direction: column;
`;
const Title = styled.h3`
  padding: 8px;
`;
const CourseList = styled.div<any>`
  padding: 10px;
  background-color: ${(props: any) =>
    props.isDraggingOver ? '#e0e0e0' : '#fff'};
  flex: 1;
  min-height: 50%;
`;

const CourseContainer = styled.div<any>`
  border: 1px solid #bbded6;
  border-radius: 10%;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${(props: any) => (props.isDragging ? '#8AC6D1' : '#fff')};
  display: flex;
`;

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  padding: 10,
  background: isDragging ? '#4a2975' : 'white',
  color: isDragging ? 'white' : 'black',

  ...draggableStyle,
});

function AppTest() {
  const [courseCatalog, setCourseCatalog] = useState<{
    courseList: any;
    columns: any;
    columnOrder: string[];
  }>(initialData);

  const [searchTerm, setSearchTerm] = useState('');
  const onChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const fetchCourse = async () => {
      const event = query(collection(db, 'allCourses'));
      const querySnapShot = await getDocs(event);
      const tempList: any = [];

      querySnapShot.forEach((doc) => {
        tempList.push({ id: doc.id, ...doc.data() });
      });

      setCourseCatalog({
        ...courseCatalog,
        courseList: tempList,
        columns: {
          ...courseCatalog.columns,
          allCourses: {
            ...courseCatalog.columns.allCourses,
            courseIds: tempList,
          },
        },
      });
    };
    fetchCourse();
  }, []);

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

    // startColumn: where the item from
    // finishColumn: where the item being dropped in
    const startColumn = courseCatalog.columns[source.droppableId];
    const finishColumn = courseCatalog.columns[destination.droppableId];

    if (startColumn === finishColumn) {
      const newCourseIds = Array.from(startColumn.courseIds);
      const [draggedCourse] = newCourseIds.splice(source.index, 1);

      newCourseIds.splice(destination.index, 0, draggedCourse);

      const newColumn = {
        ...startColumn,
        courseIds: newCourseIds,
      };

      const newCourses = {
        ...courseCatalog,
        columns: {
          ...courseCatalog.columns,
          [newColumn.id]: newColumn,
        },
      };
      setCourseCatalog(newCourses);
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

      const newCourses = {
        ...courseCatalog,
        columns: {
          ...courseCatalog.columns,
          [newStartColumn.id]: newStartColumn,
          [newFinishColumn.id]: newFinishColumn,
        },
      };
      setCourseCatalog(newCourses);
    }
  };

  return (
    <div className="App">
      {/* <Home><Header>MAV DEGREE PLANNER</Header></Home> */}
      <DragDropContext onDragEnd={onDragEnd}>
        <input placeholder="Search..." onChange={onChange} />
        <Container>
          {courseCatalog.columnOrder.map(() => {
            const column = courseCatalog.columns.allCourses;

            Object.keys(courseCatalog.columns.allCourses.courseIds)
              .filter((course: string) => {
                if (
                  searchTerm === '' ||
                  course.toLowerCase().includes(searchTerm.toLowerCase())
                ) {
                  return course;
                }
              })
              .map((course) => {
                return (
                  <Column
                    key={courseCatalog.columns.allCourses.id}
                    column={courseCatalog.columns.allCourses}
                    courses={course}
                  />
                );
              });
          })}
          {courseCatalog.columnOrder.map((columnId: string) => {
            const column = courseCatalog.columns[columnId];
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

export default AppTest;
