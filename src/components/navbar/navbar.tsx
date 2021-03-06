import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import Avatar from "../Avatar";
import SearchBar from "../search/SearchBar";

function NavBar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  return (
    <nav className="bg-white px-2 sm:px-4  border-b dark:border-cyan-700 h-16   dark:bg-gray-600">
      <div className="container flex flex-wrap justify-between items-center h-16 m-auto">
        <a href="https://sikt.no" className="flex items-center">
          <img
            src={
              theme === "light"
                ? "/sikt_small_indigo.svg"
                : "/sikt_small_indigo_light.svg"
            }
            className="mr-3 sm:h-9"
            alt="Sikt logo"
          />
          <h1 className="block text-gray-700 font-bold text-xl py-2 pr-4 pl-3 md:bg-transparent md:p-0 dark:text-white">
            ACLGen
          </h1>
        </a>

        <div className="flex md:order-2">
          <SearchBar />
          <button
            data-collapse-toggle="mobile-menu-3"
            type="button"
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="mobile-menu-3"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            <svg
              className="hidden w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <div
          className="hidden justify-between items-center w-full md:flex md:w-auto md:order-1"
          id="mobile-menu-3"
        >
          <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm lg:text-lg md:font-medium">
            <li>
              <Link href={"/"} passHref>
                <div
                  className={`blockpy-2 pr-4 pl-3 ${
                    router.asPath === "/"
                      ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
                      : "text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  }   hover:cursor-pointer `}
                  aria-current="page"
                >
                  Repositories
                </div>
              </Link>
            </li>
            <li>
              <Link href={"/rules"} passHref>
                <div
                  className={`blockpy-2 pr-4 pl-3 ${
                    router.asPath === "/rules"
                      ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
                      : "text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  }   hover:cursor-pointer `}
                  aria-current="page"
                >
                  Rules
                </div>
              </Link>
            </li>
            <li>
              <Link href={"/export"} passHref>
                <div
                  className={`blockpy-2 pr-4 pl-3 ${
                    router.asPath === "/export"
                      ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
                      : "text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  }   hover:cursor-pointer `}
                  aria-current="page"
                >
                  Export
                </div>
              </Link>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                About
              </a>
            </li>
          </ul>
        </div>
        <div
          className="hidden justify-between items-center w-full md:flex md:w-auto md:order-3"
          id="mobile-menu-3"
        >
          <div className="flex flex-wrap space-x-4 items-center">
            <DarkMode />
            <Avatar />
          </div>
        </div>
      </div>
    </nav>
  );
}

function DarkMode() {
  const { theme, setTheme } = useTheme();

  if (theme == "light") {
    return (
      <img
        className="mr-3 sm:h-8"
        alt="Dark mode"
        src="/night-mode.svg"
        onClick={() => setTheme("dark")}
      />
    );
  } else {
    return (
      <img
        className="mr-3 h-8"
        alt="Light mode"
        src="/brightness.svg"
        onClick={() => setTheme("light")}
      />
    );
  }
}

export default NavBar;
