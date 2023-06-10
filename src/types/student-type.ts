export type Student = {
  id: number;

  student_code: string;

  email: string;

  last_name: string;

  first_name: string;

  gender: "MALE" | "FEMALE";

  phone_number?: string;

  age?: number;
};
