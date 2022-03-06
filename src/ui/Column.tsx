import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import Course from "./Course";

const Container = styled.div`
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
    props.isDraggingOver ? "#e0e0e0" : "#fff"};
  flex: 1;
  min-height: 50%;
`;

interface ColumnProps {
  column: any;
  courses: any;
}

const Column: React.FC<ColumnProps> = ({ column, courses }) => {
  return (
    <Container>
      <Title>{column.title}</Title>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <CourseList ref={provided.innerRef} {...provided.droppableProps}>
            {courses.map((course: any, index: number) => (
              <Course key={course.id} course={course} index={index} />
            ))}
            {provided.placeholder}
          </CourseList>
        )}
      </Droppable>
    </Container>
  );
};

export default Column;
