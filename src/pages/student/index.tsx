import Layout from "@/components/layout";
import {
  ChevronDownIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  FaceFrownIcon,
  IdentificationIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import {
  ArrowUpTrayIcon,
  EllipsisHorizontalCircleIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Listbox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { classNames } from "@/utils/class-name-util";
import { Department } from "@/types/department.type";
import axios from "axios";
import { ATTENDANCE_API_DOMAIN } from "@/constants/axios-constant";
import { Teacher } from "@/types/teacher.type";
import Cookies from "js-cookie";
import { delay } from "@/utils/delay-util";
import Image from "next/image";
import spinnerImg from "../../../public/oval.svg";
import { useRouter } from "next/router";
import { Student } from "@/types/student-type";

const genders = [
  { id: 1, title: "All genders", value: undefined },
  { id: 2, title: "Male", value: "MALE" },
  { id: 3, title: "Female", value: "FEMALE" },
];

const StudentPage = () => {
  const router = useRouter();

  const [selectedGender, setSelectedGender] = useState(genders[0]);
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [students, setStudents] = useState<Student[]>([]);

  const [showDialogImportCsv, setShowDialogImportCsv] =
    useState<boolean>(false);
  const [fileCsv, setFileCsv] = useState<File>();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  useEffect(() => {
    const fetchListOfStudents = async () => {
      const { data } = await axios.get(
        `${ATTENDANCE_API_DOMAIN}/admin/search-student`,
        {
          headers: {
            authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      setStudents(data);
    };

    fetchListOfStudents();
  }, []);

  const handleSearchStudent = async () => {
    const url = `${ATTENDANCE_API_DOMAIN}/admin/search-student`;

    const { data } = await axios.get(url, {
      headers: {
        authorization: `Bearer ${Cookies.get("access_token")}`,
      },
      params: {
        gender: selectedGender.value,
        searchText: searchText ?? undefined,
      },
    });
    setStudents(data);
  };

  const handleImportCsv = async () => {
    if (!fileCsv) return;
    setIsUploading(true);
    await delay(2000);
    try {
      let formData = new FormData();

      formData.append("file", fileCsv);

      const { data } = await axios.post<{
        isSuccess: boolean;
        errors: string[];
      }>(`${ATTENDANCE_API_DOMAIN}/admin/upload-student-csv`, formData, {
        headers: {
          authorization: `Bearer ${Cookies.get("access_token")}`,
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

  return (
    <>
      <Layout>
        <div className="bg-white rounded-lg shadow-xl">
          <div className="header-group w-full px-10 py-5">
            <h1 className="text-xl font-semibold text-gray-900">
              Student management
            </h1>
            <span className="text-sm text-gray-600">
              *List of students bellow.
            </span>
          </div>

          <div className="table-teacher-group h-full overflow-hidden flex items-center justify-center">
            <div className="sm:px-6 w-full">
              <div className="py-4 md:py-7 px-4 md:px-8 xl:px-10">
                <div className="sm:flex items-center justify-between">
                  <div className="flex items-center">
                    <Listbox
                      value={selectedGender}
                      onChange={setSelectedGender}
                    >
                      {({ open }) => (
                        <div className="w-fit">
                          <Listbox.Button className="relative w-64 cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                            <span className="flex items-center">
                              <span className="block truncate">
                                {selectedGender.title}
                              </span>
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                              <ChevronDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </span>
                          </Listbox.Button>

                          <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-fit overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {genders.map((gender) => (
                                <Listbox.Option
                                  key={gender.id}
                                  className={({ active }) =>
                                    classNames(
                                      active
                                        ? "bg-indigo-600 text-white"
                                        : "text-gray-900",
                                      "relative cursor-default select-none py-2 pl-3 pr-9"
                                    )
                                  }
                                  value={gender}
                                >
                                  {({ selected, active }) => (
                                    <div className="flex items-center">
                                      <span
                                        className={classNames(
                                          selected
                                            ? "font-semibold"
                                            : "font-normal",
                                          "block truncate"
                                        )}
                                      >
                                        {gender.title}
                                      </span>
                                    </div>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      )}
                    </Listbox>

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
                      onClick={handleSearchStudent}
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

                    <button className="inline-flex items-start justify-start px-6 py-3 bg-indigo-600 hover:bg-indigo-500 focus:outline-none rounded">
                      <p className="text-sm font-medium leading-none text-white">
                        Add teacher
                      </p>
                    </button>
                  </div>
                </div>

                <div className="mt-7 overflow-x-auto">
                  <table className="w-full whitespace-nowrap text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                      <tr>
                        {/* <th className="p-4">
                        <label
                          htmlFor="checkbox-all-search"
                          className="sr-only"
                        >
                          checkbox
                        </label>
                      </th> */}

                        <th className="px-6 py-3">Code</th>

                        <th className="px-6 py-3">Name</th>

                        <th className="px-6 py-3">Email address</th>

                        <th className="px-6 py-3">Gender</th>

                        <th className="px-6 py-3">Phone number</th>

                        <th className="px-6 py-3">Age</th>

                        <th className="px-6 py-3"></th>

                        <th className="px-6 py-3"></th>
                      </tr>
                    </thead>

                    <tbody>
                      {students.map((student) => (
                        <tr
                          key={student.id}
                          tabIndex={0}
                          className="focus:outline-none h-16 border border-gray-100 rounded"
                        >
                          {/* <td className="pl-4">
                        <div className="ml-5">
                          <div className="bg-gray-200 rounded-sm w-5 h-5 flex flex-shrink-0 justify-center items-center relative">
                            <input
                              placeholder="checkbox"
                              type="checkbox"
                              className="focus:opacity-100 checkbox opacity-0 absolute cursor-pointer w-full h-full"
                            />
                            <div className="check-icon hidden bg-indigo-700 text-white rounded-sm">
                              <svg
                                className="icon icon-tabler icon-tabler-check"
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                fill="none"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              >
                                <path stroke="none" d="M0 0h24v24H0z"></path>
                                <path d="M5 12l5 5l10 -10"></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </td> */}

                          <td className="px-6">
                            <div className="flex items-center">
                              <IdentificationIcon className="w-6 text-gray-500" />
                              <p className="text-sm leading-none text-gray-600 ml-1">
                                {student.student_code}
                              </p>
                            </div>
                          </td>

                          <td className="px-6 focus:text-indigo-600">
                            <div className="flex items-center">
                              <p className="text-sm leading-none text-gray-700">
                                {`${student.last_name} ${student.first_name}`}
                              </p>
                            </div>
                          </td>

                          <td className="px-6">
                            <div className="flex items-center">
                              <EnvelopeIcon className="w-6 text-gray-500" />
                              <p className="text-sm leading-none text-gray-600 ml-1">
                                {student.email}
                              </p>
                            </div>
                          </td>

                          <td className="px-6">
                            <div className="flex items-center">
                              <p className="text-sm leading-none text-gray-600 ml-1">
                                {student.gender}
                              </p>
                            </div>
                          </td>

                          <td className="px-6">
                            <div className="flex items-center">
                              <DevicePhoneMobileIcon className="w-6 text-gray-500" />
                              <p className="text-sm leading-none text-gray-600 ml-2">
                                {student.phone_number ?? "..."}
                              </p>
                            </div>
                          </td>

                          <td className="px-6">
                            <div className="flex items-center">
                              <p className="text-sm leading-none text-gray-600 ml-1">
                                {student.age ?? "..."}
                              </p>
                            </div>
                          </td>

                          <td className="px-6">
                            <button className="text-sm leading-none text-gray-600 py-3 px-5 bg-green-100 rounded-lg hover:bg-green-200 focus:outline-none">
                              View
                            </button>
                          </td>

                          <td className="px-6">
                            <div className="relative px-5 pt-2">
                              <button
                                className="rounded-md focus:outline-none"
                                onClick={() => console.log("Add task")}
                                role="button"
                                aria-label="option"
                              >
                                <EllipsisHorizontalCircleIcon className="w-6 text-gray-500" />
                              </button>

                              <div className="dropdown-content bg-white shadow w-24 absolute z-30 right-0 mr-6 hidden">
                                <div
                                  tabIndex={0}
                                  className="focus:outline-none focus:text-indigo-600 text-xs w-full hover:bg-indigo-700 py-4 px-4 cursor-pointer hover:text-white"
                                >
                                  <p>Edit</p>
                                </div>
                                <div
                                  tabIndex={0}
                                  className="focus:outline-none focus:text-indigo-600 text-xs w-full hover:bg-indigo-700 py-4 px-4 cursor-pointer hover:text-white"
                                >
                                  <p>Delete</p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                      <tr className="h-3"></tr>
                    </tbody>
                  </table>
                </div>
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
    </>
  );
};

export default StudentPage;
