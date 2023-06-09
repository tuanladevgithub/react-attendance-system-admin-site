import Layout from "@/components/layout";
import {
  ChevronDownIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  IdentificationIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import {
  ArrowUpTrayIcon,
  EllipsisHorizontalCircleIcon,
} from "@heroicons/react/24/outline";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { classNames } from "@/utils/class-name-util";
import { Department } from "@/types/department.type";
import axios from "axios";
import { ATTENDANCE_API_DOMAIN } from "@/constants/axios-constant";

const TeacherPage = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  useEffect(() => {
    const fetchListOfDepartments = async () => {
      const { data } = await axios.get(`${ATTENDANCE_API_DOMAIN}/department`);
      setDepartments(data);
    };

    fetchListOfDepartments();
  }, []);

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-xl">
        <div className="header-group w-full px-10 py-5">
          <h1 className="text-xl font-semibold text-gray-900">
            Teacher management
          </h1>
          <span className="text-sm text-gray-600">
            *List of teachers bellow.
          </span>
        </div>

        <div className="table-teacher-group h-full overflow-hidden flex items-center justify-center">
          <div className="sm:px-6 w-full">
            <div className="py-4 md:py-7 px-4 md:px-8 xl:px-10">
              <div className="sm:flex items-center justify-between">
                <div className="flex items-center">
                  <Listbox
                    value={selectedDepartment}
                    onChange={setSelectedDepartment}
                  >
                    {({ open }) => (
                      <div className="w-fit">
                        <Listbox.Button className="relative w-64 cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                          <span className="flex items-center">
                            <span className="block truncate">
                              {!selectedDepartment
                                ? "All departments"
                                : selectedDepartment.department_name}
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
                            <Listbox.Option
                              className={({ active }) =>
                                classNames(
                                  active
                                    ? "bg-indigo-600 text-white"
                                    : "text-gray-900",
                                  "relative cursor-default select-none py-2 pl-3 pr-9"
                                )
                              }
                              value={null}
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
                                    All departments
                                  </span>
                                </div>
                              )}
                            </Listbox.Option>
                            {departments.map((department) => (
                              <Listbox.Option
                                key={department.id}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? "bg-indigo-600 text-white"
                                      : "text-gray-900",
                                    "relative cursor-default select-none py-2 pl-3 pr-9"
                                  )
                                }
                                value={department}
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
                                      {department.department_name}
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
                      className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      placeholder="Search text..."
                    />
                  </div>

                  <button className="mx-2 inline-flex items-start justify-start px-6 py-3 bg-green-600 hover:bg-green-500 focus:outline-none rounded">
                    <p className="text-sm font-medium leading-none text-white">
                      Search
                    </p>
                  </button>
                </div>

                <div className="flex items-center">
                  <button className="mx-2 flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 focus:outline-none rounded">
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

                      <th className="px-6 py-3"></th>

                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
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
                            123456
                          </p>
                        </div>
                      </td>

                      <td className="px-6 focus:text-indigo-600">
                        <div className="flex items-center">
                          <p className="text-sm leading-none text-gray-700">
                            Lê Bá Vui
                          </p>
                        </div>
                      </td>

                      <td className="px-6">
                        <div className="flex items-center">
                          <EnvelopeIcon className="w-6 text-gray-500" />

                          <p className="text-sm leading-none text-gray-600 ml-1">
                            le.ba.vui@soict.hust.edu.vn
                          </p>
                        </div>
                      </td>

                      <td className="px-6">
                        <div className="flex items-center">
                          <p className="text-sm leading-none text-gray-600 ml-1">
                            Male
                          </p>
                        </div>
                      </td>

                      <td className="px-6">
                        <div className="flex items-center">
                          <DevicePhoneMobileIcon className="w-6 text-gray-500" />

                          <p className="text-sm leading-none text-gray-600 ml-2">
                            0325293636
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
                    <tr className="h-3"></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherPage;
