"use strict";
exports.__esModule = true;
exports.Type = exports.IPV4RangeInputs = exports.IPV4Input = exports.ObjectTypesInputs = exports.ObjectTypeInput = exports.NetworkObjectPopup = void 0;
var PopUpForm_1 = require("./PopUpForm");
var ServiceCreationForm_1 = require("./ServiceCreationForm");
var types_1 = require("../../types/types");
var If_1 = require("../If");
var repository_1 = require("../../types/repository");
function NetworkObjectPopup(_a) {
    var object = _a.object;
    return (React.createElement(PopUpForm_1.PopUpForm, { popUp: object },
        React.createElement("form", { className: "space-y-3 py-1  px-6 flex flex-row justify-between space-x-4", action: "#" },
            React.createElement("div", { className: "flex justify-self-start items-center flex-row justify-between space-x-4 " },
                React.createElement("img", { className: "h-8 mt-5", src: "/computer-networks.svg", alt: "Network Object" }),
                React.createElement(exports.ObjectTypeInput, { value: object.type, onChange: object.setType }),
                React.createElement(ServiceCreationForm_1.Name, { value: object.name, onChange: function (name) { return object.setName(name); }, isFocus: isFocused(object) === INPUT_ELEMENTS.NAME }),
                React.createElement(ObjectTypesInputs, { object: object }),
                React.createElement(ServiceCreationForm_1.Comment, { value: object.comment, onChange: function (comment) { return object.setComment(comment); }, isFocus: false })),
            React.createElement("div", { className: "flex justify-self-end items-center flex-row justify-between space-x-4" },
                React.createElement(ServiceCreationForm_1.CheckIcon, { onClick: object.onSubmit, disabled: isInputError(object) }),
                React.createElement(If_1.If, { condition: object.onDelete !== undefined },
                    React.createElement(ServiceCreationForm_1.TrashIcon, { onClick: object.onDelete }))))));
}
exports.NetworkObjectPopup = NetworkObjectPopup;
var INPUT_ELEMENTS;
(function (INPUT_ELEMENTS) {
    INPUT_ELEMENTS[INPUT_ELEMENTS["NAME"] = 0] = "NAME";
    INPUT_ELEMENTS[INPUT_ELEMENTS["IP"] = 1] = "IP";
})(INPUT_ELEMENTS || (INPUT_ELEMENTS = {}));
exports.ObjectTypeInput = function (_a) {
    var value = _a.value, onChange = _a.onChange;
    return (React.createElement("div", null,
        React.createElement("label", { className: "block mb-2 text-sm font-light text-gray-500 dark:text-gray-300" }, "Type"),
        React.createElement("select", { name: "port", id: "port", placeholder: "Port", className: "bg-gray-50 border max-w-sm  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white", required: true, value: value, onChange: function (event) { return onChange(types_1.NetworkObjectType[event.target.value]); } }, Object.values(types_1.NetworkObjectType).map(function (value) { return (React.createElement("option", { "aria-selected": "true", key: value, value: value }, types_1.NetworkObjectType[value])); }))));
};
function ObjectTypesInputs(_a) {
    var object = _a.object;
    if (object.type == types_1.NetworkObjectType.IPV4) {
        return (React.createElement(exports.IPV4Input, { name: "Ip address", isFocus: isFocused(object) == INPUT_ELEMENTS.IP, inputHandler: object.InputHandler }));
    }
    else if (object.type == types_1.NetworkObjectType.IPV4_RANGE) {
        return React.createElement(IPV4RangeInputs, { object: object });
    }
}
exports.ObjectTypesInputs = ObjectTypesInputs;
exports.IPV4Input = function (_a) {
    var inputHandler = _a.inputHandler, name = _a.name, _b = _a.isFocus, isFocus = _b === void 0 ? false : _b;
    return (React.createElement("div", null,
        React.createElement(ServiceCreationForm_1.Label, { value: name }),
        React.createElement("input", { type: "text", name: "IP", id: "IP", autoFocus: isFocus, onChange: function (event) { return inputHandler.setInputValue(event.target.value); }, value: inputHandler.inputValue, placeholder: "80", className: ServiceCreationForm_1.inputStyle(inputHandler.isError), required: true }),
        React.createElement(If_1.If, { condition: inputHandler.isError },
            React.createElement("p", null, inputHandler.error))));
};
function IPV4RangeInputs(_a) {
    var object = _a.object;
    return (React.createElement(React.Fragment, null,
        React.createElement(exports.IPV4Input, { isFocus: isFocused(object) == INPUT_ELEMENTS.IP, name: "From", inputHandler: object.RangeInputHandler.ipFromInputHandler }),
        React.createElement(exports.IPV4Input, { isFocus: false, name: "To", inputHandler: object.RangeInputHandler.ipToInputHandler })));
}
exports.IPV4RangeInputs = IPV4RangeInputs;
function isFocused(object) {
    if (object.name == "") {
        return INPUT_ELEMENTS.NAME;
    }
    return INPUT_ELEMENTS.IP;
}
exports.Type = function () { return (React.createElement("div", null,
    React.createElement(ServiceCreationForm_1.Label, { value: "TYPE" }),
    React.createElement("h2", { className: "bg-gray-50 border border-gray-300 w-32 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white outline-none" }, "Object"))); };
function isInputError(object) {
    if (object.lock === repository_1.LockStatus.LOCKED ||
        object.lock === repository_1.LockStatus.IMMUTABLE) {
        return true;
    }
    switch (object.type) {
        case types_1.NetworkObjectType.IPV4:
            return isPortInputError(object);
        case types_1.NetworkObjectType.IPV4_RANGE:
            return isPortRangeInputError(object);
    }
}
function isPortInputError(object) {
    if (object.InputHandler.isError) {
        return true;
    }
    else if (object.InputHandler.isError) {
        return true;
    }
}
function isPortRangeInputError(object) {
    if (object.RangeInputHandler.ipFromInputHandler.isError) {
        return true;
    }
    else if (object.RangeInputHandler.ipToInputHandler.isError) {
        return true;
    }
}
exports["default"] = NetworkObjectPopup;
