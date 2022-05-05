"use strict";
exports.__esModule = true;
exports.Label = exports.Comment = exports.Protocol = exports.inputStyle = exports.Port = exports.Name = exports.Type = exports.CheckIcon = exports.ServiceTypeInput = exports.TrashIcon = exports.Index = exports.errorClass = exports.defaultClass = exports.PortInputs = exports.PortRangeInputs = exports.ServiceTypeInputs = exports.ServicePopupForm = void 0;
var types_1 = require("../../types/types");
var If_1 = require("../If");
var PopUpForm_1 = require("./PopUpForm");
var repository_1 = require("../../types/repository");
function ServicePopupForm(_a) {
    var service = _a.service;
    return (React.createElement(PopUpForm_1.PopUpForm, { popUp: service },
        React.createElement("form", { className: "space-y-3 py-1  px-6 flex flex-row justify-between space-x-4", action: "#", autoComplete: "off", onSubmit: function (e) {
                e.preventDefault();
            } },
            React.createElement("div", { className: "flex justify-self-start items-center flex-row justify-between space-x-4 " },
                React.createElement("img", { className: "h-8 mt-5", src: "/computer-networks.svg", alt: "Service" }),
                React.createElement(exports.ServiceTypeInput, { value: service.type, onChange: service.setType }),
                React.createElement(exports.Name, { value: service.name, isFocus: isFocused(service) == INPUT_ELEMENTS.NAME, onChange: function (name) { return service.setName(name); } }),
                React.createElement(ServiceTypeInputs, { service: service }),
                React.createElement(exports.Comment, { value: service.comment, onChange: function (comment) { return service.setComment(comment); }, isFocus: false })),
            React.createElement("div", { className: "flex justify-self-end items-center flex-row justify-between space-x-4" },
                React.createElement(exports.CheckIcon, { onClick: function () { return service.onSubmit(); }, disabled: isInputError(service) }),
                React.createElement(If_1.If, { condition: service.onDelete !== undefined },
                    React.createElement(exports.TrashIcon, { onClick: service.onDelete }))))));
}
exports.ServicePopupForm = ServicePopupForm;
var INPUT_ELEMENTS;
(function (INPUT_ELEMENTS) {
    INPUT_ELEMENTS[INPUT_ELEMENTS["NAME"] = 0] = "NAME";
    INPUT_ELEMENTS[INPUT_ELEMENTS["PORT"] = 1] = "PORT";
    INPUT_ELEMENTS[INPUT_ELEMENTS["PROTOCOL"] = 2] = "PROTOCOL";
})(INPUT_ELEMENTS || (INPUT_ELEMENTS = {}));
function isFocused(service) {
    if (service.name == "") {
        return INPUT_ELEMENTS.NAME;
    }
    return INPUT_ELEMENTS.PORT;
}
function ServiceTypeInputs(_a) {
    var service = _a.service;
    if (service.type == types_1.ServiceType.PORT_RANGE) {
        return React.createElement(PortRangeInputs, { service: service });
    }
    else if (service.type == types_1.ServiceType.PORT) {
        return React.createElement(PortInputs, { service: service });
    }
}
exports.ServiceTypeInputs = ServiceTypeInputs;
function PortRangeInputs(_a) {
    var service = _a.service;
    return (React.createElement(React.Fragment, null,
        React.createElement(exports.Port, { isFocus: isFocused(service) == INPUT_ELEMENTS.PORT, name: "Port Start", inputHandler: service.portRangeInputHandler.portFromHandler }),
        React.createElement(exports.Port, { isFocus: false, name: "Port End", inputHandler: service.portRangeInputHandler.portToHandler }),
        React.createElement(exports.Protocol, { isFocus: false, inputHandler: service.protocolInputHandler })));
}
exports.PortRangeInputs = PortRangeInputs;
function PortInputs(_a) {
    var service = _a.service;
    return (React.createElement(React.Fragment, null,
        React.createElement(exports.Port, { isFocus: isFocused(service) == INPUT_ELEMENTS.PORT, name: "Port", inputHandler: service.portInputHandler }),
        React.createElement(exports.Protocol, { isFocus: false, inputHandler: service.protocolInputHandler })));
}
exports.PortInputs = PortInputs;
exports.defaultClass = "bg-gray-50 border-2 border-gray-300 w-32 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white outline-none";
exports.errorClass = "bg-gray-50 border-2 border-red-600 w-32 text-gray-900 text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block p-2.5 dark:bg-gray-600 dark:border-red-500 dark:placeholder-gray-400 dark:text-white outline-none";
exports.Index = function (_a) {
    var value = _a.value;
    return (React.createElement("p", { className: "block pt-11 mb-2 text-sm font-light text-gray-400 dark:text-white" }, "#" + value));
};
exports.TrashIcon = function (_a) {
    var onClick = _a.onClick;
    return (React.createElement("svg", { version: "1.1", id: "Layer_1", "data-name": "Layer 1", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512", className: "h-10 group hover:cursor-pointer", onClick: onClick },
        React.createElement("path", { d: "m337.185 149.911h-35.509v-18.911a10 10 0 0 0 -10-10h-71.352a10 10 0 0 0 -10 10v18.911h-35.509a26.881 26.881 0 0 0 -26.85 26.85v16.849a10 10 0 0 0 10 10h4.3v149.31a38.123 38.123 0 0 0 38.08 38.08h111.31a38.122 38.122 0 0 0 38.083-38.079v-149.312h4.3a10 10 0 0 0 10-10v-16.849a26.881 26.881 0 0 0 -26.849-26.849zm-106.861-8.911h51.352v8.913h-51.352zm-62.359 35.76a6.94 6.94 0 0 1 6.85-6.848h162.37a6.941 6.941 0 0 1 6.849 6.85v6.85h-176.069zm161.773 176.159a18.1 18.1 0 0 1 -18.083 18.081h-111.31a18.1 18.1 0 0 1 -18.083-18.08v-149.311h147.476zm-83.738-9.959v-111.311a10 10 0 0 1 20 0v111.311a10 10 0 1 1 -20 0zm-41.869 0v-111.311a10 10 0 0 1 20 0v111.311a10 10 0 0 1 -20 0zm83.738 0v-111.311a10 10 0 0 1 20 0v111.311a10 10 0 0 1 -20 0z", className: "fill-gray-800  group-hover:hidden" }),
        React.createElement("circle", { className: "opacity-0 group-hover:fill-red-600 group-hover:opacity-100 transition-opacity duration-150", cx: "256", cy: "256", r: "256", transform: "matrix(.707 -.707 .707 .707 -106.039 256)" }),
        React.createElement("path", { d: "m337.185 149.911h-35.509v-18.911a10 10 0 0 0 -10-10h-71.352a10 10 0 0 0 -10 10v18.911h-35.509a26.881 26.881 0 0 0 -26.85 26.85v16.849a10 10 0 0 0 10 10h4.3v149.31a38.123 38.123 0 0 0 38.08 38.08h111.31a38.122 38.122 0 0 0 38.083-38.079v-149.312h4.3a10 10 0 0 0 10-10v-16.849a26.881 26.881 0 0 0 -26.849-26.849zm-106.861-8.911h51.352v8.913h-51.352zm-62.359 35.76a6.94 6.94 0 0 1 6.85-6.848h162.37a6.941 6.941 0 0 1 6.849 6.85v6.85h-176.069zm161.773 176.159a18.1 18.1 0 0 1 -18.083 18.081h-111.31a18.1 18.1 0 0 1 -18.083-18.08v-149.311h147.476zm-83.738-9.959v-111.311a10 10 0 0 1 20 0v111.311a10 10 0 1 1 -20 0zm-41.869 0v-111.311a10 10 0 0 1 20 0v111.311a10 10 0 0 1 -20 0zm83.738 0v-111.311a10 10 0 0 1 20 0v111.311a10 10 0 0 1 -20 0z", fillRule: "evenodd", className: "opacity-0 fill-white group-hover:opacity-100 transition-opacity duration-150" })));
};
exports.ServiceTypeInput = function (_a) {
    var value = _a.value, onChange = _a.onChange;
    return (React.createElement("div", null,
        React.createElement("label", { className: "block mb-2 text-sm font-light text-gray-500 dark:text-gray-300" }, "Type"),
        React.createElement("select", { name: "port", id: "port", placeholder: "Port", className: "bg-gray-50 border max-w-sm  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white", required: true, value: value, onChange: function (event) { return onChange(types_1.ServiceType[event.target.value]); } }, Object.values(types_1.ServiceType).map(function (value) { return (React.createElement("option", { "aria-selected": "true", key: value, value: value }, types_1.ServiceType[value])); }))));
};
exports.CheckIcon = function (_a) {
    var onClick = _a.onClick, disabled = _a.disabled;
    return (React.createElement("button", { onClick: onClick, disabled: disabled, onKeyPress: function (e) {
            e.key === "Enter" ? onClick(e) : {};
        }, className: "border-2 border-gray-100 rounded-md " + (disabled
            ? " hover:cursor-not-allowed "
            : "hover:cursor-pointer hover:border-blue-400") + "  h-10 w-10 hover:shadow-lg" },
        React.createElement("svg", { version: "1.1", id: "Layer_1", xmlns: "http://www.w3.org/2000/svg", x: "0px", y: "0px", viewBox: "0 0 512 512", className: "h-8 pt-1 pl-1" },
            React.createElement("path", { d: "M504.502,75.496c-9.997-9.998-26.205-9.998-36.204,0L161.594,382.203L43.702,264.311c-9.997-9.998-26.205-9.997-36.204,0\n\t\t\tc-9.998,9.997-9.998,26.205,0,36.203l135.994,135.992c9.994,9.997,26.214,9.99,36.204,0L504.502,111.7\n\t\t\tC514.5,101.703,514.499,85.494,504.502,75.496z", className: "" + (disabled ? " fill-gray-300 " : "fill-blue-700") }))));
};
exports.Type = function (_a) {
    var name = _a.name;
    return (React.createElement("div", null,
        React.createElement(exports.Label, { value: "TYPE" }),
        React.createElement("h2", { className: "bg-gray-50 border border-gray-300 w-32 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white outline-none" }, name)));
};
exports.Name = function (_a) {
    var value = _a.value, onChange = _a.onChange, _b = _a.isFocus, isFocus = _b === void 0 ? false : _b;
    return (React.createElement("div", null,
        React.createElement(exports.Label, { value: "Name" }),
        React.createElement("input", { type: "name", name: "Name", id: "name", value: value, autoFocus: isFocus, onChange: function (event) { return onChange(event.target.value); }, className: exports.defaultClass, placeholder: "Service name...", required: true })));
};
exports.Port = function (_a) {
    var inputHandler = _a.inputHandler, name = _a.name, _b = _a.isFocus, isFocus = _b === void 0 ? false : _b;
    return (React.createElement("div", null,
        React.createElement(exports.Label, { value: name }),
        React.createElement("input", { type: "text", name: "port", id: "port", autoFocus: isFocus, onChange: function (event) { return inputHandler.setInputValue(event.target.value); }, value: inputHandler.inputValue, placeholder: "80", className: exports.inputStyle(inputHandler.isError), required: true }),
        React.createElement(If_1.If, { condition: inputHandler.isError },
            React.createElement("p", null, inputHandler.error))));
};
exports.inputStyle = function (isError) {
    if (isError) {
        return exports.errorClass;
    }
    else {
        return exports.defaultClass;
    }
};
exports.Protocol = function (_a) {
    var _b = _a.isFocus, isFocus = _b === void 0 ? false : _b, inputHandler = _a.inputHandler;
    return (React.createElement("div", null,
        React.createElement(exports.Label, { value: "PROTOCOL" }),
        React.createElement("input", { type: "protocol", name: "protocol", id: "protocol", autoFocus: isFocus, value: inputHandler.inputValue, onChange: function (event) { return inputHandler.setInputValue(event.target.value); }, placeholder: "TCP", className: exports.inputStyle(inputHandler.isError), required: true }),
        React.createElement(If_1.If, { condition: inputHandler.isError },
            React.createElement("p", null, inputHandler.error))));
};
exports.Comment = function (_a) {
    var value = _a.value, onChange = _a.onChange, _b = _a.isFocus, isFocus = _b === void 0 ? false : _b;
    return (React.createElement("div", { className: "max-w-fit" },
        React.createElement("label", { className: "block mb-2 text-sm font-light text-gray-500 dark:text-gray-300" }, "Comment"),
        React.createElement("textarea", { name: "comment", id: "comment", placeholder: "", value: value, autoFocus: isFocus, onChange: function (event) { return onChange(event.target.value); }, className: "bg-gray-50 border border-gray-300 resize-x text-gray-900 text-sm rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white", required: true })));
};
exports.Label = function (_a) {
    var value = _a.value;
    return (React.createElement("label", { className: "block mb-2 text-sm font-light text-gray-500 dark:text-gray-300" }, value));
};
exports["default"] = ServicePopupForm;
function isInputError(service) {
    if (service.lock === repository_1.LockStatus.LOCKED ||
        service.lock === repository_1.LockStatus.IMMUTABLE) {
        return true;
    }
    switch (service.type) {
        case types_1.ServiceType.PORT:
            return isPortInputError(service);
        case types_1.ServiceType.PORT_RANGE:
            return isPortRangeInputError(service);
    }
}
function isPortInputError(service) {
    if (service.portInputHandler.isError) {
        return true;
    }
    else if (service.protocolInputHandler.isError) {
        return true;
    }
}
function isPortRangeInputError(service) {
    if (service.portRangeInputHandler.portFromHandler.isError) {
        return true;
    }
    else if (service.portRangeInputHandler.portToHandler.isError) {
        return true;
    }
    else if (service.protocolInputHandler.isError) {
        return true;
    }
}
