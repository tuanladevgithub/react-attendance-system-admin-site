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

const inter = Inter({ subsets: ["latin"] });

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

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
                  <div key={menuItem.id}>
                    <div
                      className="flex items-center justify-between px-4 py-3 transition cursor-pointer group hover:bg-gray-800 hover:text-gray-200"
                      role="button"
                    >
                      <div className="flex items-center">
                        <Image
                          src={menuItem.icon}
                          className="shrink-0 w-5 h-5 mr-2 text-gray-400 transition group-hover:text-gray-300"
                          alt={menuItem.title}
                        />
                        <span>{menuItem.title}</span>
                      </div>
                      <svg
                        className="shrink-0 w-4 h-4 ml-2 transition transform"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>

                    <div className="mb-4">
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
            <div className="hidden -ml-3 form-icon md:block w-96">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                className="bg-transparent border-0 form-input"
                placeholder="Search..."
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
              <Link href="#" className="ml-4 avatar avatar-sm">
                <Image src={userImg} alt="User photo" />
              </Link>
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
