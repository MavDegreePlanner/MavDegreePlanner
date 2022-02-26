export enum Major {
  SoftwareEngineering,
  ComputerScience,
  ComputerEngineering
}

export const majorEnumFromString = (majorString: string) : Major | undefined => {
  switch (majorString) {
    case "Software Engineering":
      return Major.SoftwareEngineering;
    case "Computer Engineering":
      return Major.ComputerEngineering;
    case "Computer Science":
      return Major.ComputerScience;
    default:
      console.log(`[ERROR]: Unknown required major - "${majorString}"`);
      return undefined;
  }
}