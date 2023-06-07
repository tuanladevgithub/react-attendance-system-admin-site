/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/

import Image from "next/image";
import logoImg from "../../../public/logo.svg";
import Link from "next/link";
import useUser from "@/lib/use-user";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import spinnerImg from "../../../public/oval.svg";
import { ATTENDANCE_API_DOMAIN } from "@/constants/axios-constant";

const delay = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

const SignIn = () => {
  const router = useRouter();
  const { teacher, mutate, error } = useUser();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorOccur, setErrorOccur] = useState(null);

  useEffect(() => {
    if (teacher && !error) {
      router.replace("/");
    }
  }, [router, teacher, error]);

  const loginTeacher = async (email: string, pass: string) => {
    setLoading(true);
    await delay(2000);
    try {
      const { data } = await axios.post(
        `${ATTENDANCE_API_DOMAIN}/auth/login-teacher`,
        {
          email,
          pass,
        }
      );

      Cookies.set("access_token", data.accessToken);
    } catch (error: any) {
      setErrorOccur(error.response.data.message);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            className="mx-auto h-20 w-auto"
            src={logoImg}
            alt="Logo HUST"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {errorOccur && (
            <span className="text-sm text-red-500 italic">* {errorOccur}</span>
          )}
          <form className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="sample@example.com"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <Link
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="*********"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setPass(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="button"
                className={classNames(
                  loading
                    ? "bg-slate-500 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500",
                  "flex w-full justify-center items-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                )}
                onClick={() => {
                  loginTeacher(email, pass);
                  mutate();
                }}
              >
                {loading && (
                  <div className="mr-2">
                    <Image
                      className="h-5 w-auto"
                      src={spinnerImg}
                      alt="Spinner"
                    />
                  </div>
                )}
                <span>Sign in</span>
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?
            <Link
              href="#"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              {" Please contact your admin!"}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignIn;
