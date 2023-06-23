import Image from "next/image";
import Layout from "@/components/layout";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import {
  ArrowUpTrayIcon,
  CheckIcon,
  ChevronUpDownIcon,
  FaceFrownIcon,
  MagnifyingGlassIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { Fragment, useEffect, useState } from "react";
import { classNames } from "@/utils/class-name-util";
import { useRouter } from "next/router";
import { Subject } from "@/types/subject.type";
import axios from "axios";
import { ATTENDANCE_API_DOMAIN } from "@/constants/axios-constant";
import spinnerImg from "../../../public/oval.svg";
import emptyDataImg from "../../../public/empty-data.svg";
import courseImg from "../../../public/course-img.jpg";
import { delay } from "@/utils/delay-util";
import Cookies from "js-cookie";
import Link from "next/link";
import { Course } from "@/types/course.type";
import ReactDatePicker from "react-datepicker";
import { format } from "date-fns";

const SubjectAndCoursePage = () => {
  const router = useRouter();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject>();
  const [querySubject, setQuerySubject] = useState<string>("");
  const filteredSubjects =
    querySubject === ""
      ? subjects
      : subjects.filter((subject) =>
          `${subject.subject_code}-${subject.subject_name}`
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(querySubject.toLowerCase().replace(/\s+/g, ""))
        );
  const [searchText, setSearchText] = useState<string>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [showDialogImportCsv, setShowDialogImportCsv] =
    useState<boolean>(false);
  const [fileCsv, setFileCsv] = useState<File>();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [showDialogAddCourse, setShowDialogAddCourse] =
    useState<boolean>(false);
  const [courseCreateData, setCourseCreateData] = useState<{
    m_subject_id?: number;
    teacher_code_or_email?: string;
    start_date?: string;
    end_date?: string;
    description?: string;
  }>();

  useEffect(() => {
    const fetchListOfSubjects = async () => {
      const { data } = await axios.get(`${ATTENDANCE_API_DOMAIN}/subject`);
      setSubjects(data);
    };

    fetchListOfSubjects();
  }, []);

  useEffect(() => {
    const fetchListOfCourses = async () => {
      const { data } = await axios.get(
        `${ATTENDANCE_API_DOMAIN}/admin/search-course`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("admin_access_token")}`,
          },
        }
      );
      setCourses(data);
    };

    fetchListOfCourses();
  }, []);

  const handleSearchCourse = async () => {
    const url = `${ATTENDANCE_API_DOMAIN}/admin/search-course`;

    const { data } = await axios.get(url, {
      headers: {
        authorization: `Bearer ${Cookies.get("admin_access_token")}`,
      },
      params: {
        subjectId: !selectedSubject ? undefined : selectedSubject.id,
        searchText: searchText ?? undefined,
      },
    });
    setCourses(data);
  };

  const handleImportCsv = async () => {
    if (!fileCsv) return;
    console.log(fileCsv);
    setIsUploading(true);
    await delay(2000);
    try {
      let formData = new FormData();

      formData.append("file", fileCsv);

      const { data } = await axios.post<{
        isSuccess: boolean;
        errors: string[];
      }>(`${ATTENDANCE_API_DOMAIN}/admin/upload-course-csv`, formData, {
        headers: {
          authorization: `Bearer ${Cookies.get("admin_access_token")}`,
        },
      });

      setShowDialogImportCsv(false);
      if (!data.isSuccess) setUploadErrors(data.errors);
      else {
        setUploadErrors([]);
        router.reload();
      }
    } catch (error: any) {
      console.log(error);
    }
    setIsUploading(false);
  };

  const handleAddCourse = async () => {
    const url = `${ATTENDANCE_API_DOMAIN}/admin/create-course`;

    const { data } = await axios.post(url, courseCreateData, {
      headers: {
        authorization: `Bearer ${Cookies.get("admin_access_token")}`,
      },
    });
    router.reload();
  };

  return (
    <>
      <Layout>
        <div className="bg-white rounded-lg shadow-xl">
          <div className="header-group w-full px-10 py-5">
            <h1 className="text-xl font-semibold text-gray-900">
              Subject & course management
            </h1>
            <span className="text-sm text-gray-600">
              *List of courses bellow.
            </span>
          </div>

          <div className="list-course-group h-full overflow-hidden flex items-center justify-center">
            <div className="sm:px-6 w-full">
              <div className="py-4 md:py-7 px-4 md:px-8 xl:px-10">
                <div className="sm:flex items-center justify-between">
                  <div className="flex items-center">
                    <Combobox
                      value={selectedSubject}
                      onChange={setSelectedSubject}
                    >
                      <div>
                        <div className="relative rounded-md shadow-sm">
                          <Combobox.Input
                            className="block w-full rounded-md border-0 py-1.5 pl-4 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
                            placeholder="--- Select subject ---"
                            displayValue={(subject: Subject) =>
                              !subject
                                ? "All subjects"
                                : `${subject.subject_code} - ${subject.subject_name}`
                            }
                            onChange={(event) =>
                              setQuerySubject(event.target.value)
                            }
                          />
                          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </Combobox.Button>
                        </div>

                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                          afterLeave={() => setQuerySubject("")}
                        >
                          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-fit overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {filteredSubjects.length === 0 &&
                            querySubject !== "" ? (
                              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                Nothing found.
                              </div>
                            ) : (
                              <>
                                <Combobox.Option
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                      active
                                        ? "bg-indigo-600 text-white"
                                        : "text-gray-900"
                                    }`
                                  }
                                  value={null}
                                >
                                  {({ selected, active }) => (
                                    <>
                                      <span
                                        className={`block truncate ${
                                          selected
                                            ? "font-medium"
                                            : "font-normal"
                                        }`}
                                      >
                                        All subjects
                                      </span>
                                      {selected ? (
                                        <span
                                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                            active
                                              ? "text-white"
                                              : "text-indigo-600"
                                          }`}
                                        >
                                          <CheckIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Combobox.Option>

                                {filteredSubjects.map((subject) => (
                                  <Combobox.Option
                                    key={subject.id}
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active
                                          ? "bg-indigo-600 text-white"
                                          : "text-gray-900"
                                      }`
                                    }
                                    value={subject}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <span
                                          className={`block truncate ${
                                            selected
                                              ? "font-medium"
                                              : "font-normal"
                                          }`}
                                        >
                                          {`${subject.subject_code} - ${subject.subject_name}`}
                                        </span>
                                        {selected ? (
                                          <span
                                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                              active
                                                ? "text-white"
                                                : "text-indigo-600"
                                            }`}
                                          >
                                            <CheckIcon
                                              className="h-5 w-5"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Combobox.Option>
                                ))}
                              </>
                            )}
                          </Combobox.Options>
                        </Transition>
                      </div>
                    </Combobox>

                    <div className="relative mx-2 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-1">
                        <MagnifyingGlassIcon className="text-gray-500 h-5 w-5" />
                      </div>
                      <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        placeholder="Search text..."
                      />
                    </div>

                    <button
                      onClick={handleSearchCourse}
                      className="mx-2 inline-flex items-start justify-start px-6 py-3 bg-green-600 hover:bg-green-500 focus:outline-none rounded"
                    >
                      <p className="text-sm font-medium leading-none text-white">
                        Search
                      </p>
                    </button>
                  </div>

                  <div className="flex items-center">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setShowDialogImportCsv(true);
                      }}
                      className="mx-2 flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 focus:outline-none rounded"
                    >
                      <ArrowUpTrayIcon className="h-[14px] mr-3 text-sm font-medium leading-none text-white" />
                      <p className="text-sm font-medium leading-none text-white">
                        Import CSV
                      </p>
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setShowDialogAddCourse(true);
                      }}
                      className="inline-flex items-start justify-start px-6 py-3 bg-indigo-600 hover:bg-indigo-500 focus:outline-none rounded"
                    >
                      <p className="text-sm font-medium leading-none text-white">
                        Add course
                      </p>
                    </button>
                  </div>
                </div>

                {!courses || courses.length < 1 ? (
                  <div className="mx-auto my-10 w-full h-fit flex justify-center items-center">
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
                  <div className="mx-auto my-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
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
                                <Link href={`/course/${course.id}/session`}>
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
        </div>
      </Layout>

      <Transition.Root show={showDialogImportCsv} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setShowDialogImportCsv(false);
            setFileCsv(undefined);
          }}
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
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ArrowUpTrayIcon
                          className="h-6 w-6 text-green-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Import CSV
                        </Dialog.Title>
                        <div className="mt-4 text-sm text-gray-500">
                          <form className="flex items-center">
                            <label className="block">
                              <span className="sr-only">Choose csv file</span>
                              <input
                                type="file"
                                className="block w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border file:border-green-600 file:border-dashed file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 file:cursor-pointer hover:file:bg-green-100 focus:outline-none"
                                accept=".csv"
                                onChange={(e) => {
                                  if (e.target.files)
                                    setFileCsv(e.target.files[0]);
                                }}
                              />
                            </label>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className={classNames(
                        !fileCsv
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-500",
                        "inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                      )}
                      onClick={handleImportCsv}
                    >
                      {isUploading ? (
                        <Image
                          className="h-5 w-auto"
                          src={spinnerImg}
                          alt="Spinner"
                        />
                      ) : (
                        "Upload"
                      )}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowDialogImportCsv(false);
                        setFileCsv(undefined);
                      }}
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

      <Transition.Root show={uploadErrors.length > 0} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setUploadErrors([]);
          }}
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
                        <FaceFrownIcon
                          className="h-6 w-6 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-red-600"
                        >
                          Import failed, please check your CSV file!
                        </Dialog.Title>
                        <div className="mt-4 text-sm text-gray-500">
                          <ul
                            role="list"
                            className="marker:text-black list-disc pl-5 space-y-3 text-slate-500"
                          >
                            {uploadErrors.map((err, errIndex) => (
                              <li key={errIndex}>{err}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowDialogImportCsv(false);
                        setFileCsv(undefined);
                        setUploadErrors([]);
                      }}
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

      <Transition.Root show={showDialogAddCourse} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setShowDialogAddCourse(false);
          }}
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
                      <div className="mt-3 text-center sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Create course
                        </Dialog.Title>
                        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
                                onChange={(e) => {
                                  e.preventDefault();
                                  setCourseCreateData(
                                    !courseCreateData
                                      ? {
                                          m_subject_id: Number(e.target.value),
                                        }
                                      : {
                                          ...courseCreateData,
                                          m_subject_id: Number(e.target.value),
                                        }
                                  );
                                }}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              >
                                <option disabled selected value={undefined}>
                                  --- Select subject ---
                                </option>
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
                              htmlFor="teacher_code_or_email"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Teacher code or email
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2">
                              <input
                                type="text"
                                name="teacher_code_or_email"
                                placeholder={`Ex: "20230000" or "teacher@sample.com"`}
                                onChange={(e) => {
                                  e.preventDefault();
                                  setCourseCreateData(
                                    !courseCreateData
                                      ? {
                                          teacher_code_or_email: e.target.value,
                                        }
                                      : {
                                          ...courseCreateData,
                                          teacher_code_or_email: e.target.value,
                                        }
                                  );
                                }}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label
                              htmlFor="start_date"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Start date<span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2">
                              <ReactDatePicker
                                className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                selected={
                                  !courseCreateData?.start_date
                                    ? undefined
                                    : new Date(courseCreateData.start_date)
                                }
                                onChange={(date: Date) => {
                                  setCourseCreateData(
                                    !courseCreateData
                                      ? {
                                          start_date: !date
                                            ? undefined
                                            : format(date, "yyyy-MM-dd"),
                                        }
                                      : {
                                          ...courseCreateData,
                                          start_date: !date
                                            ? undefined
                                            : format(date, "yyyy-MM-dd"),
                                        }
                                  );
                                }}
                                dateFormat={"dd MMM yyyy"}
                                showIcon
                                isClearable
                                selectsStart
                                startDate={
                                  !courseCreateData?.start_date
                                    ? undefined
                                    : new Date(courseCreateData.start_date)
                                }
                                endDate={
                                  !courseCreateData?.end_date
                                    ? undefined
                                    : new Date(courseCreateData.end_date)
                                }
                                maxDate={
                                  !courseCreateData?.end_date
                                    ? undefined
                                    : new Date(courseCreateData.end_date)
                                }
                                placeholderText="Select start date..."
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label
                              htmlFor="end_date"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              End date<span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2">
                              <ReactDatePicker
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                selected={
                                  !courseCreateData?.end_date
                                    ? undefined
                                    : new Date(courseCreateData.end_date)
                                }
                                onChange={(date: Date) => {
                                  setCourseCreateData(
                                    !courseCreateData
                                      ? {
                                          end_date: !date
                                            ? undefined
                                            : format(date, "yyyy-MM-dd"),
                                        }
                                      : {
                                          ...courseCreateData,
                                          end_date: !date
                                            ? undefined
                                            : format(date, "yyyy-MM-dd"),
                                        }
                                  );
                                }}
                                dateFormat={"dd MMM yyyy"}
                                showIcon
                                isClearable
                                selectsEnd
                                startDate={
                                  !courseCreateData?.start_date
                                    ? undefined
                                    : new Date(courseCreateData.start_date)
                                }
                                endDate={
                                  !courseCreateData?.end_date
                                    ? undefined
                                    : new Date(courseCreateData.end_date)
                                }
                                minDate={
                                  !courseCreateData?.start_date
                                    ? undefined
                                    : new Date(courseCreateData.start_date)
                                }
                                placeholderText="Select end date..."
                              />
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
                                onChange={(e) => {
                                  e.preventDefault();
                                  setCourseCreateData(
                                    !courseCreateData
                                      ? { description: e.target.value }
                                      : {
                                          ...courseCreateData,
                                          description: e.target.value,
                                        }
                                  );
                                }}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className={classNames(
                        !courseCreateData ||
                          !courseCreateData.m_subject_id ||
                          !courseCreateData.teacher_code_or_email ||
                          !courseCreateData.start_date ||
                          !courseCreateData.end_date
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-500",
                        "inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                      )}
                      onClick={handleAddCourse}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowDialogAddCourse(false);
                      }}
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

export default SubjectAndCoursePage;
