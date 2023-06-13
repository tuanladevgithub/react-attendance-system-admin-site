import Layout from "@/components/layout";
import { ATTENDANCE_API_DOMAIN } from "@/constants/axios-constant";
import { Department } from "@/types/department.type";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Teacher } from "@/types/teacher.type";
import { classNames } from "@/utils/class-name-util";
import { delay } from "@/utils/delay-util";

const TeacherDetailPage = () => {
  const router = useRouter();
  const teacherId = router.query.teacherId;

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
              <div className="teacher-image col-span-2 py-4 px-16 flex justify-center">
                <div className="relative w-full h-auto min-h-fit rounded-md">
                  <Image
                    src={
                      "https://soict.hust.edu.vn/wp-content/uploads/2019/06/DHP_5811.jpg"
                    }
                    alt="Teacher image"
                    fill
                  />
                </div>
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

                    <div className="border-b border-gray-900/10 pb-6">
                      <h2 className="text-base font-semibold leading-7 text-gray-900">
                        List of courses
                      </h2>

                      <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        ...
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
