import Script from "next/script";
import { Inter } from "next/font/google";
import Image from "next/image";
import logoImg from "../../public/logo.svg";
import userImg from "../../public/user.png";
import homeIcon from "../../public/home-icon.svg";
import teacherIcon from "../../public/teacher-icon.svg";
import studentIcon from "../../public/student-icon.svg";
import courseIcon from "../../public/classroom-icon.svg";
import settingIcon from "../../public/setting-icon.svg";
import Link from "next/link";
import { useRouter } from "next/router";
import useUser from "@/lib/use-user";
import { Fragment, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Menu, Transition } from "@headlessui/react";
import Cookies from "js-cookie";

const inter = Inter({ subsets: ["latin"] });

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const alpineString = `<div>
  <svg :class="{ 'rotate-90': open }" className="hrink-0 w-4 h-4 ml-2 transition transform" style=" width: 1rem; height: 1rem;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
</div>`;

const AlpineWidget = () => (
  <>
    <div dangerouslySetInnerHTML={{ __html: alpineString }} />
  </>
);

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { admin, error } = useUser();

  useEffect(() => {
    if (!admin && error) {
      router.replace("/sign-in");
    }
  }, [router, admin, error]);

  const menu = [
    {
      id: 1,
      type: "single",
      title: "Home",
      path: "",
      icon: homeIcon,
      isActive: router.pathname === "/",
    },
    {
      id: 2,
      type: "single",
      title: "Manage teacher",
      path: "teacher",
      icon: teacherIcon,
      isActive: router.pathname.startsWith("/teacher"),
    },
    {
      id: 3,
      type: "single",
      title: "Manage student",
      path: "student",
      icon: studentIcon,
      isActive: router.pathname.startsWith("/student"),
    },
    {
      id: 4,
      type: "single",
      title: "Subjects & courses",
      path: "subject-course",
      icon: courseIcon,
      isActive: router.pathname.startsWith("/subject-course"),
    },
    {
      id: 5,
      type: "multi",
      title: "Multi items",
      path: "multi-item",
      icon: settingIcon,
      items: [
        {
          id: 1,
          title: "Item 1",
          path: "item1",
          isActive: false,
        },
        {
          id: 2,
          title: "Item 2",
          path: "item2",
          isActive: false,
        },
        {
          id: 3,
          title: "Item 3",
          path: "item3",
          isActive: false,
        },
      ],
    },
    {
      id: 6,
      type: "single",
      title: "Settings",
      path: "setting",
      icon: settingIcon,
      isActive: router.pathname.startsWith("/setting"),
    },
  ];

  return (
    <>
      <section className="min-h-screen bg-gray-50">
        <nav className="fixed top-0 left-0 z-20 h-full pb-10 overflow-x-hidden overflow-y-auto transition origin-left transform bg-gray-900 w-60 md:translate-x-0">
          <Link href="/" className="flex items-center justify-center px-4 py-5">
            <Image src={logoImg} alt="HUST Logo" className="w-16" />
          </Link>
          <nav
            className="text-sm font-medium text-gray-500"
            aria-label="Main Navigation"
          >
            {menu.map((menuItem) => {
              if (menuItem.type === "single") {
                return (
                  <Link
                    key={menuItem.id}
                    className={classNames(
                      "flex items-center px-4 py-3 transition cursor-pointer group hover:bg-gray-800 hover:text-gray-200",
                      menuItem.isActive ? "text-gray-200 bg-gray-800" : ""
                    )}
                    href={`/${menuItem.path}`}
                  >
                    <Image
                      src={menuItem.icon}
                      className="shrink-0 w-5 h-5 mr-2 text-gray-400 transition group-hover:text-gray-300"
                      alt={menuItem.title}
                    />
                    <span>{menuItem.title}</span>
                  </Link>
                );
              }

              if (menuItem.type === "multi") {
                return (
                  <div key={menuItem.id} x-data="collapse()">
                    <div
                      className="flex items-center justify-between px-4 py-3 transition cursor-pointer group hover:bg-gray-800 hover:text-gray-200"
                      role="button"
                      aria-controls={`collapseItem${menuItem.id}`}
                      aria-expanded="false"
                      x-spread="trigger"
                    >
                      <div className="flex items-center">
                        <Image
                          src={menuItem.icon}
                          className="shrink-0 w-5 h-5 mr-2 text-gray-400 transition group-hover:text-gray-300"
                          alt={menuItem.title}
                        />
                        <span>{menuItem.title}</span>
                      </div>
                      <AlpineWidget />
                    </div>

                    <div
                      className="mb-4"
                      id={`collapseItem${menuItem.id}`}
                      x-spread="collapse"
                      x-cloak="true"
                    >
                      {menuItem.items?.map((subMenuItem) => (
                        <Link
                          key={subMenuItem.id}
                          className={classNames(
                            "flex items-center py-2 pl-12 pr-4 transition cursor-pointer hover:bg-gray-800 hover:text-gray-200",
                            subMenuItem.isActive
                              ? "text-gray-200 bg-gray-800"
                              : ""
                          )}
                          href={`/${menuItem.path}/${subMenuItem.path}`}
                        >
                          {subMenuItem.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
            })}
          </nav>
        </nav>

        <div className="ml-0 transition md:ml-60">
          <header className="flex items-center justify-between w-full px-4 h-14 bg-white shadow-md">
            <button className="block btn btn-light-secondary md:hidden">
              <span className="sr-only">Menu</span>
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div className="relative mx-2 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-1">
                <MagnifyingGlassIcon className="text-gray-500 h-5 w-5" />
              </div>
              <input
                type="text"
                className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
                placeholder="Search ..."
              />
            </div>
            <div className="flex items-center">
              <Link href="#" className="flex text-gray-500">
                <svg
                  className="shrink-0 w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </Link>

              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="flex rounded-full bg-gray-800 text-sm outline-none">
                    <span className="sr-only">Open user menu</span>
                    <Image
                      className="h-8 w-8 rounded-full"
                      src={userImg}
                      alt="User avatar"
                    />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <div
                          // href="/sign-in"
                          onClick={(e) => {
                            e.preventDefault();
                            Cookies.remove("access_token");
                            router.reload();
                          }}
                          className={classNames(
                            active ? " cursor-pointer bg-gray-100" : "",
                            " cursor-pointer block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          Sign out
                        </div>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </header>

          <div className="mt-4 p-4">
            {/* <!-- Add content here, remove div below -->  */}
            <div className="-mt-2 h-fit">{children}</div>
          </div>
        </div>

        {/* <!-- Sidebar Backdrop -->  */}
        <div className="fixed inset-0 z-10 w-screen h-screen bg-black bg-opacity-25 md:hidden"></div>
      </section>

      <Script src="https://cdn.jsdelivr.net/npm/kutty@latest/dist/kutty.min.js" />
    </>
  );
}
