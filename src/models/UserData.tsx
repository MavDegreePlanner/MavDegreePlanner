import { ChosenCourse } from "./ChosenCourse";

export class UserData {
    uid: string;
    name: string;
    email: string;
    major: string;
    startingSemester: string;
    startingYear: string;
    chosenCourses: ChosenCourse[];
    coursesTaken: string[];

    constructor(uid: string,
        name: string,
        email: string,
        major: string,
        startingSemester: string,
        startingYear: string,
        chosenCourseList: ChosenCourse[],
        coursesTaken: string[]
    ) {
        this.uid = uid;
        this.name = name;
        this.email = email;
        this.major = major;
        this.startingSemester = startingSemester;
        this.startingYear = startingYear;
        this.chosenCourses = chosenCourseList;
        this.coursesTaken = coursesTaken;
    }
}