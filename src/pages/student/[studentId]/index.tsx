import Layout from "@/components/layout";
import { ATTENDANCE_API_DOMAIN } from "@/constants/axios-constant";
import {
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { classNames } from "@/utils/class-name-util";
import { delay } from "@/utils/delay-util";
import studentImg from "../../../../public/student.png";
import emptyDataImg from "../../../../public/empty-data.svg";
import courseImg from "../../../../public/course-img.jpg";
import { Course } from "@/types/course.type";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import { Student } from "@/types/student-type";

const StudentDetailPage = () => {
  const router = useRouter();
  const studentId = router.query.studentId;

  const [fileStudentImg, setFileStudentImg] = useState<File>();
  const [studentData, setStudentData] = useState<Student>();
  const [firstNameUpdate, setFirstNameUpdate] = useState<string>();
  const [lastNameUpdate, setLastNameUpdate] = useState<string>();
  const [emailUpdate, setEmailUpdate] = useState<string>();
  const [phoneNumberUpdate, setPhoneNumberUpdate] = useState<string>();
  const [genderUpdate, setGenderUpdate] = useState<string>();
  const [ageUpdate, setAgeUpdate] = useState<string>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [showInputPassword, setShowInputPassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [newPass, setNewPass] = useState<string>();
  const [showDialogDelStudent, setShowDialogDelStudent] =
    useState<boolean>(false);

  useEffect(() => {
    if (studentId) {
      const fetchStudentData = async () => {
        const { data } = await axios.get(
          `${ATTENDANCE_API_DOMAIN}/admin/get-student-info/${studentId}`,
          {
            headers: {
              authorization: `Bearer ${Cookies.get("admin_access_token")}`,
            },
          }
        );
        setStudentData(data);
      };

      fetchStudentData();
    }
  }, [studentId]);

  useEffect(() => {
    const fetchListOfStudentCourses = async () => {
      const { data } = await axios.get(
        `${ATTENDANCE_API_DOMAIN}/admin/get-student-course/${studentId}`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("admin_access_token")}`,
          },
        }
      );
      setCourses(data);
    };

    fetchListOfStudentCourses();
  }, [studentId]);

  const handleUpdateStudentInfo = async () => {
    await delay(1000);
    if (
      firstNameUpdate ||
      lastNameUpdate ||
      emailUpdate ||
      phoneNumberUpdate !== undefined ||
      genderUpdate ||
      ageUpdate !== undefined
    ) {
      const { data } = await axios.patch(
        `${ATTENDANCE_API_DOMAIN}/admin/update-student-info/${studentId}`,
        {
          first_name: firstNameUpdate,
          last_name: lastNameUpdate,
          email: emailUpdate,
          phone_number: phoneNumberUpdate === "" ? null : phoneNumberUpdate,
          gender: genderUpdate,
          age: ageUpdate === "" ? null : Number(ageUpdate),
        },
        {
          headers: {
            authorization: `Bearer ${Cookies.get("admin_access_token")}`,
          },
        }
      );
    }
    router.reload();
  };

  const handleChangeStudentPassword = async () => {
    await delay(1000);
    if (!newPass) return;

    const { data } = await axios.post(
      `${ATTENDANCE_API_DOMAIN}/admin/change-password-student/${studentId}`,
      { newPass },
      {
        headers: {
          authorization: `Bearer ${Cookies.get("admin_access_token")}`,
        },
      }
    );

    router.reload();
  };

  const handleDeleteStudent = async () => {
    await delay(1000);
    const { data } = await axios.delete(
      `${ATTENDANCE_API_DOMAIN}/admin/delete-student/${studentId}`,
      {
        headers: {
          authorization: `Bearer ${Cookies.get("admin_access_token")}`,
        },
      }
    );

    await router.push("/student");
  };

  return (
    <>
      <Layout>
        {studentData && (
          <>
            <div className="border border-slate-200 bg-white rounded-lg shadow-xl">
              <div className="header-group w-full px-10 py-5">
                <h1 className="text-xl font-semibold text-gray-900">
                  Student management
                </h1>
              </div>

              <div className="pb-6 student-info-group grid grid-cols-5">
                <div className="student-image border-r border-gray-900/10 col-span-2 py-4 px-16 flex flex-col justify-start items-center gap-y-6">
                  <div className="relative bg-slate-200 w-[280px] h-[320px] flex items-center justify-center">
                    <Image src={studentImg} alt="Student image" />
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
                              setFileStudentImg(e.target.files[0]);
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
                      !fileStudentImg ? "hidden" : "",
                      "rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    )}
                  >
                    Update image
                  </button>
                </div>

                <div className="student-detail col-span-3 p-4">
                  <form>
                    <div>
                      <div>
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                          Personal Information
                        </h2>

                        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                          <div className="sm:col-span-3">
                            <label
                              htmlFor="first_name"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              First name <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2">
                              <input
                                type="text"
                                name="first_name"
                                value={
                                  firstNameUpdate ?? studentData.first_name
                                }
                                onChange={(e) => {
                                  e.preventDefault();
                                  setFirstNameUpdate(e.target.value);
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
                              Last name <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2">
                              <input
                                type="text"
                                name="last_name"
                                value={lastNameUpdate ?? studentData.last_name}
                                onChange={(e) => {
                                  e.preventDefault();
                                  setLastNameUpdate(e.target.value);
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
                              Email address{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2">
                              <input
                                name="email"
                                type="email"
                                value={emailUpdate ?? studentData.email}
                                onChange={(e) => {
                                  e.preventDefault();
                                  setEmailUpdate(e.target.value);
                                }}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label
                              htmlFor="phone_number"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Phone number
                            </label>
                            <div className="mt-2">
                              <input
                                type="text"
                                name="phone_number"
                                placeholder="Ex: 0123456789"
                                value={
                                  phoneNumberUpdate ??
                                  studentData.phone_number ??
                                  ""
                                }
                                onChange={(e) => {
                                  e.preventDefault();
                                  setPhoneNumberUpdate(e.target.value);
                                }}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label
                              htmlFor="student_code"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Student code{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2">
                              <input
                                type="text"
                                name="student_code"
                                value={studentData.student_code}
                                disabled
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-900 disabled:border-slate-200 disabled:shadow-none sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label
                              htmlFor="gender"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Gender <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2">
                              <select
                                id="gender"
                                name="gender"
                                value={genderUpdate ?? studentData.gender}
                                onChange={(e) => {
                                  e.preventDefault();
                                  setGenderUpdate(e.target.value);
                                }}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-900 disabled:border-slate-200 disabled:shadow-none"
                              >
                                <option value={"MALE"}>Male</option>
                                <option value={"FEMALE"}>Female</option>
                              </select>
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label
                              htmlFor="age"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Age
                            </label>
                            <div className="mt-2">
                              <input
                                type="number"
                                name="age"
                                id="age"
                                placeholder="Ex: 21"
                                value={ageUpdate ?? studentData.age ?? ""}
                                onChange={(e) => {
                                  e.preventDefault();
                                  setAgeUpdate(e.target.value);
                                }}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-900 disabled:border-slate-200 disabled:shadow-none"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-x-6">
                          <button
                            type="button"
                            onClick={(e) => {
                              setFirstNameUpdate(undefined);
                              setLastNameUpdate(undefined);
                              setEmailUpdate(undefined);
                              setPhoneNumberUpdate(undefined);
                              setGenderUpdate(undefined);
                              setAgeUpdate(undefined);
                            }}
                            className={classNames(
                              !firstNameUpdate &&
                                !lastNameUpdate &&
                                !emailUpdate &&
                                phoneNumberUpdate === undefined &&
                                !genderUpdate &&
                                ageUpdate === undefined
                                ? "hidden"
                                : "",
                              "text-sm font-semibold leading-6 text-gray-900"
                            )}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={
                              !firstNameUpdate &&
                              !lastNameUpdate &&
                              !emailUpdate &&
                              phoneNumberUpdate === undefined &&
                              !genderUpdate &&
                              ageUpdate === undefined
                                ? true
                                : false
                            }
                            onClick={handleUpdateStudentInfo}
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-slate-500 disabled:cursor-not-allowed"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="mt-8 border border-slate-200 bg-white rounded-lg shadow-xl">
              <div className="header-group w-full px-10 py-5">
                <h1 className="text-xl font-semibold text-gray-900">
                  List of courses
                </h1>
                <span className="text-sm text-gray-600">
                  *The list of courses the student has attended.
                </span>
              </div>

              <div className="w-full px-10 py-5">
                <div>
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
                    <div className="mx-auto grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:grid-cols-5">
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
                                  <Link href={`/course/${course.id}`}>
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

            <div className="mt-8 border border-slate-200 bg-white rounded-lg shadow-xl">
              <div className="header-group w-full px-10 py-5">
                <h1 className="text-xl font-semibold text-gray-900">
                  Settings
                </h1>
                <span className="text-sm text-gray-600">
                  *Student account settings.
                </span>
              </div>

              <div className="w-full px-10 py-5">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-6">
                  <div
                    className={classNames(
                      showInputPassword ? "" : "hidden",
                      "md:col-span-2"
                    )}
                  >
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      Password setting
                    </label>
                    <div className="mt-2 flex items-center gap-x-6">
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="change_pass"
                          value={newPass ?? ""}
                          placeholder="Set new password"
                          onChange={(e) => {
                            e.preventDefault();
                            setNewPass(e.target.value);
                          }}
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

                      <button
                        type="button"
                        onClick={handleChangeStudentPassword}
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
                          setNewPass(undefined);
                        }}
                        className="text-sm font-semibold leading-6 text-gray-900"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  <div
                    className={classNames(
                      showInputPassword ? "hidden" : "",
                      "md:col-span-2"
                    )}
                  >
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      Password setting
                    </label>
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

                  <div className="md:col-span-4"></div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      Remove account
                    </label>
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowDialogDelStudent(true);
                        }}
                        className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Layout>

      <Transition.Root show={showDialogDelStudent} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setShowDialogDelStudent(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Delete student
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to delete this student? All of
                            student data will be permanently removed. This
                            action cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={handleDeleteStudent}
                    >
                      Confirm delete
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setShowDialogDelStudent(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default StudentDetailPage;
