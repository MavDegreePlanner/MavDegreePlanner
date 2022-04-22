import React from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot
} from "react-beautiful-dnd";
import styled from "styled-components";
import { Course } from "../../models/Course";
import ReactTooltip from "react-tooltip";

export const Container = styled.div<any>`
  @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&family=Work+Sans:wght@400;700&display=swap');
  display: block;
  border: 1px solid black;
  padding: 8px;
  margin-bottom: 8px;
  overflow: hidden;
  box-shadow: ${(props: any) => (props.isDragging ? "0 0 40px #C1F4C5" : "")};
  border: ${(props: any) => (props.isDragging ? "0.2rem solid #A6CF98" : "")};
  & p {
    font-family: "Work Sans", san-serif;
    margin: 8px;
    font-weight: normal;
    font-size: 15px;
  }
  &:hover {
    cursor: pointer;
    background-color: #f9fcff;
    background-image: linear-gradient(147deg, #f9fcff 0%, #dee4ea 74%);
  }
 }
`;

const PreReq = styled.div`
 display: flex;
 flex-wrap: wrap;
 justify-content: left;
 padding: 7px;
 font-family: "Work Sans", san-serif;
 font-style: italic;
 font-size: 12px;
`;

interface CourseProps {
  course: Course;
  index: number;
}

const CourseReact: React.FC<CourseProps> = ({ course, index }) => {
  return (
    <Draggable draggableId={course.firebaseId} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <Container
          id={course.courseId}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          aria-roledescription="Press space bar to choose the course"
        >
          <span data-tip data-for="preReqTooltip" style={{display: "flex", justifyContent: "space-around", borderBottom: "1px solid #36096d"}}>
            <p style={{fontWeight: "bold"}}>{course.courseId}</p>
            <p>|</p>
            <p>{course.courseId.charAt(course.courseId.length - 3)} cr.</p>
          </span>
          <p>{course.description}</p>
          <hr></hr>
          <PreReq>Prerequisite: {course.prereqIds.join(", ")}</PreReq>
          <hr></hr> 
        </Container>
      )}
    </Draggable>
  );
};

export default CourseReact;
