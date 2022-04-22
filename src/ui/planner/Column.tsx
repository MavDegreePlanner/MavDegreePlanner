import { useEffect, useState } from "react";
import { Droppable, DroppableStateSnapshot } from "react-beautiful-dnd";
import styled from "styled-components";
import { Course } from "../../models/Course";
import CourseReact from "./CourseReact";

export const Container = styled.div`
  background-color: #f9fcff;
  background-image: linear-gradient(147deg, #f9fcff 0%, #dee4ea 74%);
  margin: 5px;
  border: 1px double lightgray;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
`;

export const Title = styled.div`
  position: sticky;
  top: 0;
  background-color: white;
//   box-shadow: 10px 5px 5px black;
  border-bottom: 0.2rem solid #A6CF98;
  border-top: 0.2rem solid #A6CF98;
  border-color: #4E598C;
    &:hover {
      background-color: #537895;
      background-image: linear-gradient(315deg, #537895 0%, #09203f 74%);
      color: white;
      cursor: pointer;
      text-shadow:   6px 6px 20px #5D8BF4,
      -6px -6px 30px #2D31FA,
      -6px -6px 300px #051367;
    }
  color: black;
  font-weight: bold;
  padding: 8px;
  text-shadow: 2px 2px 1px #537895;
  letter-spacing: 2.5px;
`;

export const CourseList = styled.div<any>`
  padding: 8px;
  min-height: 100px;
  flex-grow: 1;
  background-color: ${(props: any) =>
    props.isDraggingOver ? "#F2FFE9" : "white"};
  box-shadow: ${(props: any) => (props.isDraggingOver ? "0 0 200px #C1F4C5" : "")};
`;

const TotalHours = styled.div<any>`
  position: sticky;
  bottom: 0;
  padding: 8px;
  border: 1px double;
  background-color: #ffffff;
  background-image: linear-gradient(315deg, #ffffff 0%, #d7e1ec 74%);
`;

interface ColumnProps {
  column: {
    id: string,
    title: string,
    courses: Course[],
  };
  courses: Course[];
  isDropDisabled: boolean
}

const Column: React.FC<ColumnProps> = ({ column, courses, isDropDisabled }) => {
  const [hours, setHours] = useState(0);

  useEffect(() => {
    let temp = 0;
    column.courses.forEach((course) => {
      temp += parseInt(course.courseId.charAt(course.courseId.length - 3));
    })
    setHours(temp);
  }, [column.courses, courses]);

  return (
    <Container>
      <Title>{column.title}</Title>
      <Droppable droppableId={column.id} isDropDisabled={isDropDisabled}>
        {(provided, snapshot) => (
          <CourseList ref={provided.innerRef} {...provided.droppableProps} isDraggingOver={snapshot.isDraggingOver}>
            {courses.map((course, index) => (
              <CourseReact key={course.firebaseId} course={course} index={index} />
            ))}
            {provided.placeholder}
          </CourseList>
        )}
      </Droppable>
      <TotalHours>Total Hours: {hours}</TotalHours>
    </Container>
  );
};

export default Column;
