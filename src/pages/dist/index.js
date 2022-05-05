"use strict";
exports.__esModule = true;
var head_1 = require("next/head");
var navbar_1 = require("../components/navbar");
var image_1 = require("next/image");
var Home_module_css_1 = require("../styles/Home.module.css");
var hooks_1 = require("../app/hooks");
var repositorySlice_1 = require("../features/repository/repositorySlice");
var react_1 = require("react");
var link_1 = require("next/link");
var IndexPage = function () {
    var dispatch = hooks_1.useAppDispatch();
    var state = hooks_1.useAppSelector(repositorySlice_1.selectRepository);
    react_1.useEffect(function () {
        if (state.repositories.length == 0 && state.status == "empty") {
            dispatch(repositorySlice_1.updateRepositoriesAsync());
        }
    }, [state.status, state.selectedRepository]);
    return (React.createElement("div", { className: Home_module_css_1["default"].container },
        React.createElement(head_1["default"], null,
            React.createElement("title", null, "ACLGen"),
            React.createElement("link", { rel: "icon", href: "/sikt_small.svg" })),
        React.createElement(navbar_1["default"], null),
        React.createElement("header", { className: Home_module_css_1["default"].header },
            React.createElement("div", { className: "h-64 w-32" },
                React.createElement(image_1["default"], { src: "/sikt_small.svg", className: Home_module_css_1["default"].logo, alt: "logo", width: 100, height: 100, layout: "intrinsic" })),
            React.createElement("div", { className: "flex flex-col space-y-6 w-96 items-center" },
                React.createElement("h2", { className: "text-gray-800 pb-8" }, "Repositories"),
                state.repositories.map(function (element, i) {
                    return (React.createElement(link_1["default"], { key: i, href: "/rules", passHref: true },
                        React.createElement("div", { className: "rounded-md shadow-md w-full hover:cursor-pointer hover:bg-blue-500 hover:text-white border-2  border-blue-500 text-gray-800 p-4" }, element.name)));
                })))));
};
exports["default"] = IndexPage;
