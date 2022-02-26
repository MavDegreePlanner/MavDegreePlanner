export class ChosenCourse {
    readonly courseId: string;
    readonly semester: string;

    constructor(courseId: string, semester: string) {
      this.courseId = courseId;
      this.semester = semester;
    }
}