import Layout from "@/components/layout";
import { ATTENDANCE_API_DOMAIN } from "@/constants/axios-constant";
import { LIST_HOURS, LIST_MINS } from "@/constants/common-constant";
import { Course, CourseSchedule } from "@/types/course.type";
import { Subject } from "@/types/subject.type";
import { classNames } from "@/utils/class-name-util";
import { formatTimeDisplay24Hours } from "@/utils/date-time-util";
import { Listbox, Transition } from "@headlessui/react";
import {
  CalendarDaysIcon,
  ChevronUpDownIcon,
  ClockIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";

const dayTitles = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CourseDetailPage = () => {
  const router = useRouter();
  const courseId = router.query.courseId;

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [course, setCourse] = useState<Course>();
  const [updateCourseData, setUpdateCourseData] = useState<{
    m_subject_id: number;
    course_code: string;
    start_date: string;
    end_date: string;
    description?: string;
  }>();
  const [schedulesByDayOfWeek, setSchedulesByDayOfWeek] = useState<
    { dayOfWeek: string; schedules: CourseSchedule[] }[]
  >([]);
  const [openFormAddSchedule, setOpenFormAddSchedule] =
    useState<boolean>(false);
  const [addScheduleDayOfWeek, setAddScheduleDayOfWeek] = useState<number>();
  const [addScheduleTime, setAddScheduleTime] = useState<{
    start_hour: number;
    start_min: number;
    end_hour: number;
    end_min: number;
  }>({ start_hour: 8, start_min: 0, end_hour: 9, end_min: 0 });

  useEffect(() => {
    const fetchListOfSubjects = async () => {
      const { data } = await axios.get(`${ATTENDANCE_API_DOMAIN}/subject`);
      setSubjects(data);
    };

    fetchListOfSubjects();
  }, []);

  useEffect(() => {
    const fetchCourseData = async () => {
      const { data } = await axios.get<Course>(
        `${ATTENDANCE_API_DOMAIN}/admin/course/${courseId}`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("admin_access_token")}`,
          },
        }
      );
      setCourse(data);
      setUpdateCourseData({
        m_subject_id: data.m_subject_id,
        course_code: data.course_code,
        start_date: data.start_date,
        end_date: data.end_date,
        description: data.description,
      });

      const schedules = data.courseSchedules;
      if (schedules) {
        const days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];

        const tmpSchedulesDayOfWeek: {
          dayOfWeek: string;
          schedules: CourseSchedule[];
        }[] = [];
        days.forEach((dayOfWeek, idx) => {
          const dayOfWeekSchedules = schedules.filter(
            (schedule) => schedule.day_of_week == idx
          );
          if (dayOfWeekSchedules.length > 0) {
            tmpSchedulesDayOfWeek.push({
              dayOfWeek,
              schedules: dayOfWeekSchedules,
            });
          }
        });
        setSchedulesByDayOfWeek(tmpSchedulesDayOfWeek);
      }
    };

    if (courseId) fetchCourseData();
  }, [courseId]);

  const handleUpdateCourse = () => {
    const updateCourse = async () => {
      await axios.post<Course>(
        `${ATTENDANCE_API_DOMAIN}/admin/course/${courseId}`,
        updateCourseData,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("admin_access_token")}`,
          },
        }
      );

      router.reload();
    };

    if (course && updateCourseData) {
      if (
        updateCourseData.m_subject_id !== course.subject?.id ||
        updateCourseData.course_code !== course.course_code ||
        updateCourseData.start_date !== course.start_date ||
        updateCourseData.end_date !== course.end_date ||
        updateCourseData.description !== course.description
      ) {
        updateCourse();
      }
    }
  };

  return (
    <>
      <Layout>
        {course && updateCourseData && (
          <div className="bg-white rounded-lg shadow-xl">
            <div className="header-group w-full px-10 py-5">
              <h1 className="text-xl font-semibold text-gray-900">
                Subject & course management
              </h1>
              <span className="text-sm text-gray-600">*Course detail.</span>
            </div>

            <div className="course-detail-group h-full overflow-hidden flex items-center justify-center">
              <div className="sm:px-6 w-full">
                <div className="py-4 md:py-7 px-4 md:px-8 xl:px-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                      <form>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                          <div className="sm:col-span-full">
                            <label
                              htmlFor="subject"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Subject<span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2">
                              <select
                                name="subject"
                                value={updateCourseData?.m_subject_id}
                                onChange={(e) => {
                                  e.preventDefault();
                                  console.log(course);
                                  console.log(updateCourseData);
                                  setUpdateCourseData({
                                    ...updateCourseData,
                                    m_subject_id: parseInt(e.target.value),
                                  });
                                }}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              >
                                {subjects.map((subject) => (
                                  <option key={subject.id} value={subject.id}>
                                    {`${subject.subject_code} - ${subject.subject_name}`}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="sm:col-span-full">
                            <label
                              htmlFor="teacher"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Teacher
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2">
                              <input
                                type="text"
                                name="teacher"
                                value={
                                  course.teacher?.last_name +
                                  " " +
                                  course.teacher?.first_name
                                }
                                disabled
                                onChange={(e) => {
                                  e.preventDefault();
                                }}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:bg-gray-200 disabled:cursor-not-allowed"
                              />
                            </div>
                          </div>

                          <div className="col-span-1">
                            <label
                              htmlFor="start_date"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Start date<span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2">
                              <div className="customDatePickerWidth">
                                <ReactDatePicker
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  selected={
                                    new Date(updateCourseData.start_date)
                                  }
                                  onChange={(date: Date) => {
                                    if (date)
                                      setUpdateCourseData({
                                        ...updateCourseData,
                                        start_date: format(date, "yyyy-MM-dd"),
                                      });
                                  }}
                                  dateFormat={"dd MMMM yyyy"}
                                  selectsStart
                                  startDate={
                                    new Date(updateCourseData.start_date)
                                  }
                                  endDate={new Date(updateCourseData.end_date)}
                                  maxDate={new Date(updateCourseData.end_date)}
                                  placeholderText="Select start date..."
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-span-1">
                            <label
                              htmlFor="end_date"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              End date<span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2">
                              <div className="customDatePickerWidth">
                                <ReactDatePicker
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  selected={new Date(updateCourseData.end_date)}
                                  onChange={(date: Date) => {
                                    if (date)
                                      setUpdateCourseData({
                                        ...updateCourseData,
                                        end_date: format(date, "yyyy-MM-dd"),
                                      });
                                  }}
                                  dateFormat={"dd MMMM yyyy"}
                                  selectsEnd
                                  startDate={
                                    new Date(updateCourseData.start_date)
                                  }
                                  endDate={new Date(updateCourseData.end_date)}
                                  minDate={
                                    new Date(updateCourseData.start_date)
                                  }
                                  placeholderText="Select end date..."
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-span-full">
                            <label
                              htmlFor="description"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Description
                            </label>
                            <div className="mt-2">
                              <textarea
                                name="description"
                                rows={4}
                                placeholder="About of this course..."
                                value={updateCourseData.description}
                                onChange={(e) => {
                                  e.preventDefault();
                                  setUpdateCourseData({
                                    ...updateCourseData,
                                    description: e.target.value,
                                  });
                                }}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>

                          <div className="col-span-full">
                            <div className="flex items-center justify-center">
                              <button
                                type="button"
                                onClick={handleUpdateCourse}
                                className={classNames(
                                  updateCourseData.m_subject_id !==
                                    course.subject?.id ||
                                    updateCourseData.course_code !==
                                      course.course_code ||
                                    updateCourseData.start_date !==
                                      course.start_date ||
                                    updateCourseData.end_date !==
                                      course.end_date ||
                                    updateCourseData.description !==
                                      course.description
                                    ? "bg-green-600 hover:bg-green-500"
                                    : "bg-gray-500 cursor-not-allowed",
                                  "inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                                )}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>

                    <div>
                      <div className="grid grid-cols-1">
                        <div>
                          <label
                            htmlFor="subject"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Schedules
                          </label>
                          <div className="mt-2">
                            {schedulesByDayOfWeek.map((dayOfWeek) => (
                              <div
                                key={dayOfWeek.dayOfWeek}
                                className="text-sm"
                              >
                                <span className="w-full px-2 flex items-center gap-x-2 rounded-md font-medium text-blue-600 bg-blue-200">
                                  <CalendarDaysIcon className="h-5 w-5" />
                                  {dayOfWeek.dayOfWeek}
                                </span>
                                <div className="my-2 px-6">
                                  <ol className="border-l border-neutral-300">
                                    {dayOfWeek.schedules.map((schedule) => (
                                      <li
                                        key={schedule.id}
                                        className="my-2 py-1.5"
                                      >
                                        <div className="flex-start flex items-center">
                                          <div className="-ml-[5px] mr-3 h-[9px] w-[9px] rounded-full bg-blue-400"></div>
                                          <div className="ml-3 flex items-center gap-x-2 p-1.5 rounded-md hover:shadow-lg hover:bg-gray-100 hover:text-blue-400">
                                            <ClockIcon className="h-4 w-4" />
                                            <span className="cursor-default">
                                              {formatTimeDisplay24Hours(
                                                schedule.start_hour,
                                                schedule.start_min
                                              )}{" "}
                                              -{" "}
                                              {formatTimeDisplay24Hours(
                                                schedule.end_hour,
                                                schedule.end_min
                                              )}
                                            </span>
                                            <div className="h-4 w-4 ml-10 cursor-pointer hover:text-red-500">
                                              <TrashIcon />
                                            </div>
                                          </div>
                                        </div>
                                      </li>
                                    ))}
                                  </ol>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div
                            className={classNames(
                              openFormAddSchedule ? "hidden" : "",
                              "mt-5 p-2 flex flex-col gap-1 justify-center items-center rounded-md border-2 border-dashed text-gray-400 hover:border-gray-400 hover:text-gray-700 hover:cursor-pointer"
                            )}
                            onClick={() => setOpenFormAddSchedule(true)}
                          >
                            <PlusIcon className="w-8" />
                            <span className="text-sm">Add new schedule</span>
                          </div>

                          <div
                            className={classNames(
                              openFormAddSchedule ? "" : "hidden",
                              "mt-5 p-2 rounded-md border-2 border-dashed border-gray-400"
                            )}
                          >
                            <div className="my-5 grid grid-cols-8">
                              <div className="col-span-1">
                                <span className="text-sm font-medium leading-6 text-gray-900">
                                  Week day:
                                </span>
                              </div>
                              <div className="col-span-7 text-sm grid grid-cols-7">
                                {dayTitles.map((dayTitle, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-start gap-x-1"
                                    onClick={() => setAddScheduleDayOfWeek(idx)}
                                  >
                                    <div
                                      className={
                                        addScheduleDayOfWeek === idx
                                          ? "w-4 h-4 rounded-full border-4 border-blue-500"
                                          : "w-4 h-4 rounded-full border-2 border-gray-500 cursor-pointer"
                                      }
                                    ></div>
                                    <span>{dayTitle}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="my-5 grid grid-cols-8">
                              <div className="col-span-1">
                                <span className="text-sm font-medium leading-6 text-gray-900">
                                  Time:
                                </span>
                              </div>
                              <div className="col-span-7 text-sm">
                                <div className="w-full lg:w-1/2 flex justify-between items-center">
                                  <div className="w-16">
                                    <Listbox
                                      value={addScheduleTime.start_hour}
                                      onChange={(value: number) =>
                                        setAddScheduleTime({
                                          ...addScheduleTime,
                                          start_hour: value,
                                        })
                                      }
                                    >
                                      <div className="relative mt-1">
                                        <Listbox.Button className="relative w-full rounded-md border-0 py-1.5 pl-3 text-sm text-left text-gray-800 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                          <span className="block truncate">
                                            {addScheduleTime.start_hour < 10
                                              ? `0${addScheduleTime.start_hour}`
                                              : addScheduleTime.start_hour}
                                          </span>
                                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <ChevronUpDownIcon
                                              className="h-5 w-5 text-gray-400"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        </Listbox.Button>
                                        <Transition
                                          as={Fragment}
                                          leave="transition ease-in duration-100"
                                          leaveFrom="opacity-100"
                                          leaveTo="opacity-0"
                                        >
                                          <Listbox.Options className="absolute mt-1 max-h-24 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {LIST_HOURS.filter(
                                              (hour) =>
                                                parseInt(hour) <=
                                                addScheduleTime.end_hour
                                            ).map((hour) => (
                                              <Listbox.Option
                                                key={hour}
                                                className={({ active }) =>
                                                  `relative cursor-default select-none py-2 pl-3 pr-4 ${
                                                    active
                                                      ? "bg-gray-100 text-gray-900"
                                                      : "text-gray-900"
                                                  }`
                                                }
                                                value={parseInt(hour)}
                                              >
                                                {({ selected }) => (
                                                  <>
                                                    <span
                                                      className={`block truncate ${
                                                        selected
                                                          ? "font-medium"
                                                          : "font-normal"
                                                      }`}
                                                    >
                                                      {hour}
                                                    </span>
                                                  </>
                                                )}
                                              </Listbox.Option>
                                            ))}
                                          </Listbox.Options>
                                        </Transition>
                                      </div>
                                    </Listbox>
                                  </div>

                                  <div className="w-16">
                                    <Listbox
                                      value={addScheduleTime.start_min}
                                      onChange={(value: number) =>
                                        setAddScheduleTime({
                                          ...addScheduleTime,
                                          start_min: value,
                                        })
                                      }
                                    >
                                      <div className="relative mt-1">
                                        <Listbox.Button className="relative w-full rounded-md border-0 py-1.5 pl-3 text-sm text-left text-gray-800 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                          <span className="block truncate">
                                            {addScheduleTime.start_min < 10
                                              ? `0${addScheduleTime.start_min}`
                                              : addScheduleTime.start_min}
                                          </span>
                                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <ChevronUpDownIcon
                                              className="h-5 w-5 text-gray-400"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        </Listbox.Button>
                                        <Transition
                                          as={Fragment}
                                          leave="transition ease-in duration-100"
                                          leaveFrom="opacity-100"
                                          leaveTo="opacity-0"
                                        >
                                          <Listbox.Options className="absolute mt-1 max-h-24 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {LIST_MINS.filter(
                                              (min) =>
                                                addScheduleTime.start_hour <
                                                  addScheduleTime.end_hour ||
                                                parseInt(min) <=
                                                  addScheduleTime.end_min
                                            ).map((min) => (
                                              <Listbox.Option
                                                key={min}
                                                className={({ active }) =>
                                                  `relative cursor-default select-none py-2 pl-3 pr-4 ${
                                                    active
                                                      ? "bg-gray-100 text-gray-900"
                                                      : "text-gray-900"
                                                  }`
                                                }
                                                value={parseInt(min)}
                                              >
                                                {({ selected }) => (
                                                  <>
                                                    <span
                                                      className={`block truncate ${
                                                        selected
                                                          ? "font-medium"
                                                          : "font-normal"
                                                      }`}
                                                    >
                                                      {min}
                                                    </span>
                                                  </>
                                                )}
                                              </Listbox.Option>
                                            ))}
                                          </Listbox.Options>
                                        </Transition>
                                      </div>
                                    </Listbox>
                                  </div>

                                  <div>
                                    <span>to</span>
                                  </div>

                                  <div className="w-16">
                                    <Listbox
                                      value={addScheduleTime.end_hour}
                                      onChange={(value: number) =>
                                        setAddScheduleTime({
                                          ...addScheduleTime,
                                          end_hour: value,
                                        })
                                      }
                                    >
                                      <div className="relative mt-1">
                                        <Listbox.Button className="relative w-full rounded-md border-0 py-1.5 pl-3 text-sm text-left text-gray-800 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                          <span className="block truncate">
                                            {addScheduleTime.end_hour < 10
                                              ? `0${addScheduleTime.end_hour}`
                                              : addScheduleTime.end_hour}
                                          </span>
                                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <ChevronUpDownIcon
                                              className="h-5 w-5 text-gray-400"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        </Listbox.Button>
                                        <Transition
                                          as={Fragment}
                                          leave="transition ease-in duration-100"
                                          leaveFrom="opacity-100"
                                          leaveTo="opacity-0"
                                        >
                                          <Listbox.Options className="absolute mt-1 max-h-24 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {LIST_HOURS.filter(
                                              (hour) =>
                                                parseInt(hour) >=
                                                addScheduleTime.start_hour
                                            ).map((hour) => (
                                              <Listbox.Option
                                                key={hour}
                                                className={({ active }) =>
                                                  `relative cursor-default select-none py-2 pl-3 pr-4 ${
                                                    active
                                                      ? "bg-gray-100 text-gray-900"
                                                      : "text-gray-900"
                                                  }`
                                                }
                                                value={parseInt(hour)}
                                              >
                                                {({ selected }) => (
                                                  <>
                                                    <span
                                                      className={`block truncate ${
                                                        selected
                                                          ? "font-medium"
                                                          : "font-normal"
                                                      }`}
                                                    >
                                                      {hour}
                                                    </span>
                                                  </>
                                                )}
                                              </Listbox.Option>
                                            ))}
                                          </Listbox.Options>
                                        </Transition>
                                      </div>
                                    </Listbox>
                                  </div>

                                  <div className="w-16">
                                    <Listbox
                                      value={addScheduleTime.end_min}
                                      onChange={(value: number) =>
                                        setAddScheduleTime({
                                          ...addScheduleTime,
                                          end_min: value,
                                        })
                                      }
                                    >
                                      <div className="relative mt-1">
                                        <Listbox.Button className="relative w-full rounded-md border-0 py-1.5 pl-3 text-sm text-left text-gray-800 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                          <span className="block truncate">
                                            {addScheduleTime.end_min < 10
                                              ? `0${addScheduleTime.end_min}`
                                              : addScheduleTime.end_min}
                                          </span>
                                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <ChevronUpDownIcon
                                              className="h-5 w-5 text-gray-400"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        </Listbox.Button>
                                        <Transition
                                          as={Fragment}
                                          leave="transition ease-in duration-100"
                                          leaveFrom="opacity-100"
                                          leaveTo="opacity-0"
                                        >
                                          <Listbox.Options className="absolute mt-1 max-h-24 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {LIST_MINS.filter(
                                              (min) =>
                                                addScheduleTime.start_hour <
                                                  addScheduleTime.end_hour ||
                                                parseInt(min) >=
                                                  addScheduleTime.start_min
                                            ).map((min) => (
                                              <Listbox.Option
                                                key={min}
                                                className={({ active }) =>
                                                  `relative cursor-default select-none py-2 pl-3 pr-4 ${
                                                    active
                                                      ? "bg-gray-100 text-gray-900"
                                                      : "text-gray-900"
                                                  }`
                                                }
                                                value={parseInt(min)}
                                              >
                                                {({ selected }) => (
                                                  <>
                                                    <span
                                                      className={`block truncate ${
                                                        selected
                                                          ? "font-medium"
                                                          : "font-normal"
                                                      }`}
                                                    >
                                                      {min}
                                                    </span>
                                                  </>
                                                )}
                                              </Listbox.Option>
                                            ))}
                                          </Listbox.Options>
                                        </Transition>
                                      </div>
                                    </Listbox>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-center">
                              <button
                                type="button"
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setOpenFormAddSchedule(false);
                                }}
                              >
                                Cancel
                              </button>

                              <button
                                type="button"
                                className={classNames(
                                  // !studentCreateData ||
                                  //   !studentCreateData.first_name ||
                                  //   !studentCreateData.last_name ||
                                  //   !studentCreateData.email ||
                                  //   !studentCreateData.gender
                                  //   ? "bg-gray-500 cursor-not-allowed"
                                  //   :
                                  "bg-green-600 hover:bg-green-500",
                                  "inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                                )}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
};

export default CourseDetailPage;
