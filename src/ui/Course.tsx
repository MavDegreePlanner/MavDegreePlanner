import React from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot
} from "react-beautiful-dnd";
import styled from "styled-components";

const Container = styled.div<any>`
  border: 1px solid #bbded6;
  border-radius: 10%;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${(props: any) => (props.isDragging ? "#8AC6D1" : "#fff")};
  display: flex;
`;

interface CourseProps {
  course: any;
  index: any;
}

const Course: React.FC<CourseProps> = ({ course, index }) => {
  return (
    <Draggable draggableId={course.id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          {course.courseNumber}
        </Container>
      )}
    </Draggable>
  );
};



export default Course;
