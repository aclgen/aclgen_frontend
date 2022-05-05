"use strict";
exports.__esModule = true;
var next_themes_1 = require("next-themes");
var link_1 = require("next/link");
var router_1 = require("next/router");
var Avatar_1 = require("../Avatar");
var SearchBar_1 = require("../search/SearchBar");
function NavBar() {
    var _a = next_themes_1.useTheme(), theme = _a.theme, setTheme = _a.setTheme;
    var router = router_1.useRouter();
    return (React.createElement("nav", { className: "bg-white px-2 sm:px-4  border-b dark:border-cyan-700 h-16   dark:bg-gray-600" },
        React.createElement("div", { className: "container flex flex-wrap justify-between items-center h-16 m-auto" },
            React.createElement("a", { href: "https://sikt.no", className: "flex items-center" },
                React.createElement("img", { src: theme === "light"
                        ? "/sikt_small_indigo.svg"
                        : "/sikt_small_indigo_light.svg", className: "mr-3 sm:h-9", alt: "Sikt logo" }),
                React.createElement("h1", { className: "block text-gray-700 font-bold text-xl py-2 pr-4 pl-3 md:bg-transparent md:p-0 dark:text-white" }, "ACLGen")),
            React.createElement("div", { className: "flex md:order-2" },
                React.createElement(SearchBar_1["default"], null),
                React.createElement("button", { "data-collapse-toggle": "mobile-menu-3", type: "button", className: "inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600", "aria-controls": "mobile-menu-3", "aria-expanded": "false" },
                    React.createElement("span", { className: "sr-only" }, "Open main menu"),
                    React.createElement("svg", { className: "w-6 h-6", fill: "currentColor", viewBox: "0 0 20 20", xmlns: "http://www.w3.org/2000/svg" },
                        React.createElement("path", { fillRule: "evenodd", d: "M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z", clipRule: "evenodd" })),
                    React.createElement("svg", { className: "hidden w-6 h-6", fill: "currentColor", viewBox: "0 0 20 20", xmlns: "http://www.w3.org/2000/svg" },
                        React.createElement("path", { fillRule: "evenodd", d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z", clipRule: "evenodd" })))),
            React.createElement("div", { className: "hidden justify-between items-center w-full md:flex md:w-auto md:order-1", id: "mobile-menu-3" },
                React.createElement("ul", { className: "flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm lg:text-lg md:font-medium" },
                    React.createElement("li", null,
                        React.createElement(link_1["default"], { href: "/", passHref: true },
                            React.createElement("div", { className: "blockpy-2 pr-4 pl-3 " + (router.asPath === "/"
                                    ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
                                    : "text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700") + "   hover:cursor-pointer ", "aria-current": "page" }, "Repositories"))),
                    React.createElement("li", null,
                        React.createElement(link_1["default"], { href: "/rules", passHref: true },
                            React.createElement("div", { className: "blockpy-2 pr-4 pl-3 " + (router.asPath === "/rules"
                                    ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
                                    : "text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700") + "   hover:cursor-pointer ", "aria-current": "page" }, "Rules"))),
                    React.createElement("li", null,
                        React.createElement(link_1["default"], { href: "/export", passHref: true },
                            React.createElement("div", { className: "blockpy-2 pr-4 pl-3 " + (router.asPath === "/export"
                                    ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
                                    : "text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700") + "   hover:cursor-pointer ", "aria-current": "page" }, "Export"))),
                    React.createElement("li", null,
                        React.createElement("a", { href: "#", className: "block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" }, "About")))),
            React.createElement("div", { className: "hidden justify-between items-center w-full md:flex md:w-auto md:order-3", id: "mobile-menu-3" },
                React.createElement("div", { className: "flex flex-wrap space-x-4 items-center" },
                    React.createElement(DarkMode, null),
                    React.createElement(Avatar_1["default"], null))))));
}
function DarkMode() {
    var _a = next_themes_1.useTheme(), theme = _a.theme, setTheme = _a.setTheme;
    if (theme == "light") {
        return (React.createElement("img", { className: "mr-3 sm:h-8", alt: "Dark mode", src: "/night-mode.svg", onClick: function () { return setTheme("dark"); } }));
    }
    else {
        return (React.createElement("img", { className: "mr-3 h-8", alt: "Light mode", src: "/brightness.svg", onClick: function () { return setTheme("light"); } }));
    }
}
exports["default"] = NavBar;
