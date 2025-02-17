export interface Employee {
  employeeNumber: string;
  name: string;
  department: string;
}

export interface Visitor {
  visitorName: string;
  profession: string;
  date: string;
  idNumber: string;
}

export interface VisitRecord extends Employee, Visitor {
  id: string;
  timestamp: number;
}
