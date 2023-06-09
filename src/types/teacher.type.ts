import { Department } from "./department.type";

export type Teacher = {
  id: number;

  m_department_id: number;

  teacher_code: string;

  email: string;

  last_name: string;

  first_name: string;

  phone_number?: string;

  description?: string;

  department?: Department;
};
