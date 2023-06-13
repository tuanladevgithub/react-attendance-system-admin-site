import { Subject } from "./subject.type";

export type CourseSchedule = {
  id: number;

  t_course_id: number;

  day_of_week: number;

  start_hour: number;

  start_min: number;

  end_hour: number;

  end_min: number;

  course?: Course;
};

export type Course = {
  id: number;

  m_subject_id: number;

  t_teacher_id: number;

  course_code: string;

  description?: string;

  start_date: string;

  end_date?: string;

  countStudents?: number;

  subject?: Subject;

  courseSchedules?: CourseSchedule[];
};
