import { Availability } from './Availability';
import { Major } from './MajorEnum';

export class Course {
  readonly firebaseId: string;
  readonly coreqIds: string[];
  readonly prereqIds: string[];
  readonly courseId: string;
  readonly courseNumber: number;
  readonly department: string;
  readonly description: string;
  readonly requiredInMajors: Major[];
  readonly availability: Availability;

  constructor(
    firebaseId: string,
    coreqIds: string[],
    prereqIds: string[],
    courseId: string,
    courseNumber: number,
    department: string,
    description: string,
    requiredInMajors: Major[],
    availability: Availability
  ) {
    this.firebaseId = firebaseId;
    this.courseId = courseId;
    this.coreqIds = coreqIds;
    this.prereqIds = prereqIds;
    this.courseNumber = courseNumber;
    this.department = department;
    this.description = description;
    this.requiredInMajors = requiredInMajors;
    this.availability = availability;
  }
}
