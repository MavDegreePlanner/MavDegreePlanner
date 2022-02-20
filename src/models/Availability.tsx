export class Availability {
  readonly fall: boolean;
  readonly spring: boolean;
  readonly summer: boolean;

  constructor(fall: boolean, spring: boolean, summer: boolean) {
    this.fall = fall;
    this.spring = spring;
    this.summer = summer;
  }
}
