export class ChosenCourse {
    readonly courseId: string;
    readonly semester: string;
    readonly year: number;

    constructor(courseId: string, semester: string, year: number) {
      this.courseId = courseId;
      this.semester = semester;
      this.year = year;
    }
}