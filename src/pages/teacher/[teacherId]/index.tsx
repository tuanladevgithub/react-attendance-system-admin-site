import Layout from "@/components/layout";
import { ATTENDANCE_API_DOMAIN } from "@/constants/axios-constant";
import { Department } from "@/types/department.type";
import { EyeIcon, EyeSlashIcon, UsersIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Teacher } from "@/types/teacher.type";
import { classNames } from "@/utils/class-name-util";
import { delay } from "@/utils/delay-util";
import teacherImg from "../../../../public/teacher.png";
import emptyDataImg from "../../../../public/empty-data.svg";
import courseImg from "../../../../public/course-img.jpg";
import { Course } from "@/types/course.type";
import Link from "next/link";

const TeacherDetailPage = () => {
  const router = useRouter();
  const teacherId = router.query.teacherId;

  const [fileTeacherImg, setFileTeacherImg] = useState<File>();
  const [showInputPassword, setShowInputPassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teacherData, setTeacherData] = useState<Teacher>();
  const [teacherUpdateData, setTeacherUpdateData] = useState<{
    m_department_id?: number;
    email?: string;
    last_name?: string;
    first_name?: string;
    phone_number?: string;
    description?: string;
  }>();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchListOfDepartments = async () => {
      const { data } = await axios.get(`${ATTENDANCE_API_DOMAIN}/department`);
      setDepartments(data);
    };

    fetchListOfDepartments();
  }, []);

  useEffect(() => {
    if (teacherId) {
      const fetchTeacherData = async () => {
        const { data } = await axios.get(
          `${ATTENDANCE_API_DOMAIN}/admin/get-teacher-info/${teacherId}`,
          {
            headers: {
              authorization: `Bearer ${Cookies.get("access_token")}`,
            },
          }
        );
        setTeacherData(data);
      };

      fetchTeacherData();
    }
  }, [teacherId]);

  useEffect(() => {
    const fetchListOfTeacherCourses = async () => {
      const { data } = await axios.get(
        `${ATTENDANCE_API_DOMAIN}/admin/get-teacher-course/${teacherId}`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      setCourses(data);
    };

    fetchListOfTeacherCourses();
  }, [teacherId]);

  const handleUpdateTeacherInfo = async () => {
    await delay(1000);
    if (teacherUpdateData) {
      const { data } = await axios.patch(
        `${ATTENDANCE_API_DOMAIN}/admin/update-teacher-info/${teacherId}`,
        teacherUpdateData,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );
    }
    router.reload();
  };

  return (
    <>
      <Layout>
        <div className="bg-white rounded-lg shadow-xl">
          <div className="header-group w-full px-10 py-5">
            <h1 className="text-xl font-semibold text-gray-900">
              Teacher management
            </h1>
            <span className="text-sm text-gray-600">*Teacher information.</span>
          </div>

          {teacherData && (
            <div className="teacher-info-group grid grid-cols-5">
              <div className="teacher-image border-r border-gray-900/10 col-span-2 py-4 px-16 flex flex-col justify-start items-center gap-y-6">
                <div className="relative bg-slate-200 w-[350px] h-[450px] flex items-center justify-center">
                  <Image src={teacherImg} alt="Teacher image" />
                </div>

                <div>
                  <form className="flex items-center">
                    <label className="block">
                      <span className="sr-only">Choose image file</span>
                      <input
                        type="file"
                        className="block w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border file:border-green-600 file:border-dashed file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 file:cursor-pointer hover:file:bg-green-100 focus:outline-none"
                        accept=".png"
                        onChange={(e) => {
                          if (e.target.files)
                            setFileTeacherImg(e.target.files[0]);
                        }}
                      />
                    </label>
                  </form>
                </div>
                <button
                  type="button"
                  // onClick={(e) => {
                  //   e.preventDefault();
                  //   setShowInputPassword(true);
                  // }}
                  className={classNames(
                    !fileTeacherImg ? "hidden" : "",
                    "rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  )}
                >
                  Update image
                </button>
              </div>

              <div className="teacher-detail col-span-3 p-4">
                <form>
                  <div className="space-y-8">
                    <div className="border-b border-gray-900/10 pb-6">
                      <h2 className="text-base font-semibold leading-7 text-gray-900">
                        Personal Information
                      </h2>

                      <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label
                            htmlFor="first_name"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            First name
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="first_name"
                              defaultValue={teacherData.first_name}
                              onChange={(e) => {
                                e.preventDefault();
                                setTeacherUpdateData(
                                  !teacherUpdateData
                                    ? { first_name: e.target.value }
                                    : {
                                        ...teacherUpdateData,
                                        first_name: e.target.value,
                                      }
                                );
                              }}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label
                            htmlFor="last_name"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Last name
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="last_name"
                              defaultValue={teacherData.last_name}
                              onChange={(e) => {
                                e.preventDefault();
                                setTeacherUpdateData(
                                  !teacherUpdateData
                                    ? { last_name: e.target.value }
                                    : {
                                        ...teacherUpdateData,
                                        last_name: e.target.value,
                                      }
                                );
                              }}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label
                            htmlFor="department"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Department
                          </label>
                          <div className="mt-2">
                            <select
                              name="department"
                              onChange={(e) => {
                                e.preventDefault();
                                setTeacherUpdateData(
                                  !teacherUpdateData
                                    ? {
                                        m_department_id: Number(e.target.value),
                                      }
                                    : {
                                        ...teacherUpdateData,
                                        m_department_id: Number(e.target.value),
                                      }
                                );
                              }}
                              defaultValue={teacherData.m_department_id}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            >
                              {departments.map((department) => (
                                <option
                                  key={department.id}
                                  value={department.id}
                                >
                                  {department.department_name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label
                            htmlFor="last_name"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Teacher code
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="teacher_code"
                              value={teacherData.teacher_code}
                              disabled
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-900 disabled:border-slate-200 disabled:shadow-none sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Email address
                          </label>
                          <div className="mt-2">
                            <input
                              name="email"
                              type="email"
                              defaultValue={teacherData.email}
                              onChange={(e) => {
                                e.preventDefault();
                                setTeacherUpdateData(
                                  !teacherUpdateData
                                    ? { email: e.target.value }
                                    : {
                                        ...teacherUpdateData,
                                        email: e.target.value,
                                      }
                                );
                              }}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Phone number
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="phone_number"
                              defaultValue={teacherData.phone_number}
                              onChange={(e) => {
                                e.preventDefault();
                                setTeacherUpdateData(
                                  !teacherUpdateData
                                    ? { phone_number: e.target.value }
                                    : {
                                        ...teacherUpdateData,
                                        phone_number: e.target.value,
                                      }
                                );
                              }}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>

                        <div className="col-span-full">
                          <label
                            htmlFor="about"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            About
                          </label>
                          <div className="mt-2">
                            <textarea
                              name="description"
                              rows={4}
                              defaultValue={teacherData.description}
                              onChange={(e) => {
                                e.preventDefault();
                                setTeacherUpdateData(
                                  !teacherUpdateData
                                    ? { description: e.target.value }
                                    : {
                                        ...teacherUpdateData,
                                        description: e.target.value,
                                      }
                                );
                              }}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button
                          type="button"
                          disabled={!teacherUpdateData ? true : false}
                          onClick={handleUpdateTeacherInfo}
                          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-slate-500 disabled:cursor-not-allowed"
                        >
                          Save info
                        </button>
                      </div>
                    </div>

                    <div className="border-b border-gray-900/10 pb-6">
                      <h2 className="text-base font-semibold leading-7 text-gray-900">
                        Password setting
                      </h2>

                      <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div
                          className={classNames(
                            showInputPassword ? "" : "hidden",
                            "sm:col-span-3"
                          )}
                        >
                          <div className="relative mt-2">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value="password_temp"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />

                            <button
                              className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
                              onClick={(e) => {
                                e.preventDefault();
                                setShowPassword(!showPassword);
                              }}
                            >
                              {showPassword ? (
                                <EyeSlashIcon className="w-5 h-5" />
                              ) : (
                                <EyeIcon className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div
                          className={classNames(
                            showInputPassword ? "hidden" : "",
                            "sm:col-span-3"
                          )}
                        >
                          <div className="mt-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setShowInputPassword(true);
                              }}
                              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                              Change password
                            </button>
                          </div>
                        </div>

                        <div
                          className={classNames(
                            showInputPassword ? "" : "hidden",
                            "sm:col-span-3"
                          )}
                        >
                          <div className="mt-2 flex items-center justify-start gap-x-6">
                            <button
                              type="button"
                              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                              Save
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setShowInputPassword(false);
                                setShowPassword(false);
                              }}
                              className="text-sm font-semibold leading-6 text-gray-900"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pb-6">
                      <h2 className="text-base font-semibold leading-7 text-gray-900">
                        List of courses
                      </h2>

                      <div className="mt-5">
                        {!courses || courses.length < 1 ? (
                          <div className="mx-auto my-5 w-full h-fit flex justify-center items-center">
                            <div className="flex flex-col justify-center items-center">
                              <div>
                                <Image
                                  className="h-60 w-auto"
                                  src={emptyDataImg}
                                  alt="Data empty to display"
                                />
                              </div>
                              <div className="text-base text-gray-500">
                                No data to display.
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="mx-auto my-5 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-3 xl:gap-x-8">
                            {courses.map((course) => (
                              <div key={course.id} className="group relative">
                                <div className="bg-slate-50 w-full border-solid border rounded-lg shadow-lg">
                                  <div className="aspect-h-1 aspect-w-2 w-full overflow-hidden rounded-t-lg bg-gray-200">
                                    <Image
                                      src={courseImg}
                                      alt={`${course.subject?.subject_code} - ${course.course_code}`}
                                      className="h-full w-full object-cover object-center group-hover:opacity-75"
                                    />
                                  </div>
                                  <div className="my-1 px-2 flex justify-between">
                                    <div>
                                      <h3 className="text-base text-blue-500">
                                        <Link
                                          href={`/course/${course.id}/session`}
                                        >
                                          <span
                                            aria-hidden="true"
                                            className="absolute inset-0"
                                          />
                                          {course.subject?.subject_name}
                                        </Link>
                                      </h3>
                                      <p className="mt-1 text-sm text-gray-500">
                                        {`${course.subject?.subject_code} - ${course.course_code}`}
                                      </p>
                                    </div>
                                    <div className="flex flex-col items-center justify-center text-sm font-medium text-gray-700">
                                      <div className="mx-1">
                                        <UsersIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </div>
                                      <p>{course.countStudents}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default TeacherDetailPage;
