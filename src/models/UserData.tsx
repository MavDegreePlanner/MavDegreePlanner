import { ChosenCourse } from "./ChosenCourse";

export class UserData {
    uid: string;
    major: string;
    startingSemester: string;
    chosenCourses: ChosenCourse[];
    coursesTaken: string[];

    constructor(uid: string, major: string, startingSemester: string, chosenCourseList: ChosenCourse[], coursesTaken: string[]) {
        this.uid = uid;
        this.major = major;
        this.startingSemester = startingSemester;
        this.chosenCourses = chosenCourseList;
        this.coursesTaken = coursesTaken;
    }
}