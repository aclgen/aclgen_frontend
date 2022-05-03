"use strict";
exports.__esModule = true;
exports.InputElement = exports.SearchResults = exports.DroppableInputField = void 0;
var core_1 = require("@dnd-kit/core");
var react_1 = require("react");
var PopUpForm_1 = require("../creationForm/PopUpForm");
var If_1 = require("../If");
var PLusButton_1 = require("../PLusButton");
var RuleCard_1 = require("../rule/RuleCard");
var SideBarElement_1 = require("../SelectableElement/SideBarElement");
var hooks_1 = require("./hooks");
exports.DroppableInputField = function (_a) {
    var inputID = _a.inputID, fieldType = _a.fieldType, elements = _a.elements, searchAbleElements = _a.searchAbleElements, onCreateNewElement = _a.onCreateNewElement, onUpdateElements = _a.onUpdateElements, droppableType = _a.droppableType, _b = _a.disabled, disabled = _b === void 0 ? false : _b;
    var _c = core_1.useDroppable({
        id: inputID,
        disabled: disabled,
        data: {
            type: droppableType
        }
    }), isOver = _c.isOver, setNodeRef = _c.setNodeRef;
    var _d = hooks_1.useCloseOnLostFocus(), searchMenu = _d.searchMenu, isOpen = _d.isOpen, setOpen = _d.setOpen;
    var searchName = hooks_1.useSearchAble(searchAbleElements).searchName;
    var _e = hooks_1.useEditableElements(elements, onUpdateElements), addElement = _e.addElement, removeElement = _e.removeElement;
    hooks_1.useDroppableStateChange(inputID, droppableType, addElement, searchAbleElements);
    function isElementPresent(element) {
        return elements.includes(element);
    }
    var _f = hooks_1.useHeightSensor(), inverted = _f.inverted, height = _f.height, ref = _f.ref;
    return (react_1["default"].createElement("div", { ref: setNodeRef },
        react_1["default"].createElement("div", { ref: ref, className: "relative hover:cursor-text", onClick: function () {
                setOpen(true);
            } },
            react_1["default"].createElement(RuleCard_1.Label, { value: fieldType }),
            react_1["default"].createElement("div", null,
                react_1["default"].createElement(FlexibleInputContainer, { isHovered: isOver, isCompatible: !disabled, inputElements: elements, removeElement: removeElement, onFocus: function () {
                        setOpen(true);
                    } })),
            react_1["default"].createElement(If_1.If, { condition: isOpen },
                react_1["default"].createElement(SearchInput, { searchRef: searchMenu, isElementPresent: isElementPresent, search: searchName, addElement: addElement, setOpen: function () {
                        setOpen(false);
                    }, createNew: onCreateNewElement, inverted: inverted, height: height })))));
};
function FlexibleInputContainer(_a) {
    var isHovered = _a.isHovered, isCompatible = _a.isCompatible, inputElements = _a.inputElements, removeElement = _a.removeElement, onFocus = _a.onFocus;
    return (react_1["default"].createElement("div", { tabIndex: 0, onFocus: onFocus, className: composeStyle(isHovered, isCompatible) },
        react_1["default"].createElement("div", { className: "text-md py-1 opacity-0 w-0" }, "E"),
        inputElements.map(function (element) { return (react_1["default"].createElement(InputElement, { key: element.id, element: element, onRemove: removeElement, disableRemove: inputElements.length > 1 })); })));
}
function SearchInput(_a) {
    var searchRef = _a.searchRef, isElementPresent = _a.isElementPresent, search = _a.search, addElement = _a.addElement, setOpen = _a.setOpen, createNew = _a.createNew, inverted = _a.inverted, height = _a.height;
    var _b = react_1.useState(""), searchInput = _b[0], setSearchInput = _b[1];
    var searchInputRef = react_1.useRef(null);
    var tabPress = hooks_1.useKeyPress("Tab", searchInputRef);
    react_1.useEffect(function () {
        if (tabPress) {
            console.log("tab");
            setOpen();
        }
    }, [tabPress]);
    return (react_1["default"].createElement("div", { style: { bottom: "" + (inverted ? height - 20 + "px" : "") }, ref: searchRef, className: "w-50 " + composeStylePlus(true) + " " + (true ? "scale-100" : "scale-0") + " transform origin-top ease-in-out duration-150 transition" },
        react_1["default"].createElement(If_1.If, { condition: inverted },
            react_1["default"].createElement(SearchResults, { isAdded: isElementPresent, searchResults: search(searchInput), addElement: addElement, onCreateNew: function () {
                    setOpen();
                    createNew(searchInput);
                }, inputRef: searchInputRef, setOpen: setOpen })),
        react_1["default"].createElement("div", { className: "flex flex-row items-center px-1 " + (inverted ? "border-t" : "border-b") + " overflow-hidden" },
            react_1["default"].createElement("svg", { className: "h-4 fill-gray-700 " + (searchInput === ""
                    ? "translate-x-0 pr-1"
                    : "-translate-x-12 w-1 pl-0") + " transform origin-left ease-out duration-150 transition", fill: "currentColour", viewBox: "0 0 20 20", xmlns: "http://www.w3.org/2000/svg" },
                react_1["default"].createElement("path", { fillRule: "evenodd", d: "M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z", clipRule: "evenodd" })),
            react_1["default"].createElement("input", { ref: searchInputRef, type: "source", name: "source", id: "SOURCETEST", autoFocus: true, autoComplete: "off", value: searchInput, placeholder: "Search...", onChange: function (event) { return setSearchInput(event.target.value); }, className: "outline-none  m-0 text-md w-full py-2  h-8 inline bg-gray-50" })),
        react_1["default"].createElement(If_1.If, { condition: !inverted },
            react_1["default"].createElement(SearchResults, { isAdded: isElementPresent, searchResults: search(searchInput), addElement: addElement, onCreateNew: function () {
                    setOpen();
                    createNew(searchInput);
                }, inputRef: searchInputRef, setOpen: setOpen }))));
}
var useDidMountEffect = function (func, deps) {
    var didMount = react_1.useRef(false);
    react_1.useEffect(function () {
        if (didMount.current)
            func();
        else
            didMount.current = true;
    }, deps);
};
function SearchResults(_a) {
    var searchResults = _a.searchResults, addElement = _a.addElement, isAdded = _a.isAdded, onCreateNew = _a.onCreateNew, inputRef = _a.inputRef, setOpen = _a.setOpen;
    var _b = react_1.useState(undefined), selected = _b[0], setSelected = _b[1];
    var downPress = hooks_1.useKeyPress("ArrowDown", inputRef);
    var upPress = hooks_1.useKeyPress("ArrowUp", inputRef);
    var enterPress = hooks_1.useKeyPress("Enter", inputRef);
    var escapePress = hooks_1.useKeyPress("Escape", inputRef);
    var _c = react_1.useState(0), cursor = _c[0], setCursor = _c[1];
    var _d = react_1.useState(undefined), hovered = _d[0], setHovered = _d[1];
    react_1.useEffect(function () {
        if (searchResults.length && downPress) {
            if (cursor === searchResults.length - 1) {
                setCursor(0);
            }
            else {
                setCursor(function (prevState) {
                    return prevState < searchResults.length - 1 ? prevState + 1 : prevState;
                });
            }
        }
    }, [downPress]);
    react_1.useEffect(function () {
        if (searchResults.length && upPress) {
            if (cursor === 0) {
                setCursor(searchResults.length - 1);
            }
            else {
                setCursor(function (prevState) { return (prevState > 0 ? prevState - 1 : prevState); });
            }
        }
    }, [upPress]);
    react_1.useEffect(function () {
        if ((searchResults.length && enterPress) ||
            (searchResults.length && hovered)) {
            setSelected(searchResults[cursor]);
        }
    }, [cursor]);
    react_1.useEffect(function () {
        if (searchResults.length && hovered) {
            setCursor(searchResults.indexOf(hovered));
        }
    }, [hovered]);
    useDidMountEffect(function () {
        if (searchResults[cursor] && enterPress) {
            addElement(searchResults[cursor], true);
        }
        if (searchResults.length === 0) {
            setOpen();
            onCreateNew();
        }
    }, [enterPress]);
    useDidMountEffect(function () {
        if (escapePress) {
            setOpen();
        }
    }, [escapePress]);
    return (react_1["default"].createElement("ul", { className: "flex flex-col w-fullspace-y-1 max-h-[calc(calc(100vh/2)-100px)] overflow-y-auto" },
        searchResults.map(function (element, i) {
            return (react_1["default"].createElement("li", { key: element.id, onMouseEnter: function () { return setHovered(element); }, onMouseLeave: function () { return setHovered(undefined); }, onClick: function () {
                    addElement(element, true);
                }, className: (cursor === i ? "bg-blue-500 text-white" : "") + " hover:bg-blue-500 group p-2 hover:text-white text-gray-700 w-full hover:cursor-pointer" },
                react_1["default"].createElement("div", { className: "flex flex-row" },
                    react_1["default"].createElement("p", null, element.name),
                    isAdded(element) ? (react_1["default"].createElement("div", { className: "ml-auto pr-1" },
                        react_1["default"].createElement(SideBarElement_1.CheckIconSVG, { size: "sm", isHovering: cursor === i }))) : (""))));
        }),
        searchResults.length === 0 ? (react_1["default"].createElement("li", { key: "new", onMouseEnter: function () { return setHovered(undefined); }, onMouseLeave: function () { return setHovered(undefined); }, onClick: function () {
                onCreateNew();
            }, className: (cursor === 0 ? "bg-blue-500 text-white" : "") + " hover:bg-blue-500 group p-2 hover:text-white text-gray-700 w-full hover:cursor-pointer" },
            react_1["default"].createElement("div", { className: "flex flex-row font-light text-md items-center" },
                react_1["default"].createElement("p", null, "Create new"),
                react_1["default"].createElement("div", { className: "ml-auto" },
                    react_1["default"].createElement(PLusButton_1.PlusButtonSVG, { inverted: true, isHovering: cursor === 0 }))))) : (react_1["default"].createElement(react_1["default"].Fragment, null))));
}
exports.SearchResults = SearchResults;
function InputElement(_a) {
    var element = _a.element, onRemove = _a.onRemove, disableRemove = _a.disableRemove;
    return (react_1["default"].createElement("div", { key: element.id, onMouseDown: function (e) {
            e.preventDefault();
            e.stopPropagation();
        }, onClick: function (e) {
            e.stopPropagation();
        }, className: "flex flex-row bg-white space-x-2 hover:cursor-pointer hover:shadow-lg transition-shadow  " + SideBarElement_1.statusStyle("source") + " outline-none shadow-md items-center px-2 py-1 rounded-md" },
        react_1["default"].createElement("p", { className: "text-md select-none text-gray-700 " }, element.name),
        react_1["default"].createElement("div", { className: "ml-auto" }, disableRemove ? (react_1["default"].createElement(PopUpForm_1.XIcon, { onClick: function (e) {
                e.stopPropagation();
                onRemove(element);
            }, size: "sm" })) : (""))));
}
exports.InputElement = InputElement;
function composeStyle(isHovering, isComatible) {
    if (isComatible === void 0) { isComatible = true; }
    var baseStyle = "bg-gray-50 flex flex-row flex-wrap outline-none hover:cursor-text h-auto block p-1 w-32 rounded-lg overflow-wrap";
    var text = "text-gray-900 text-sm";
    var border = "border-2 " + (isHovering ? "border-blue-500" : "border-gray-300") + " hover:border-blue-500 active:border-blue-500 focus:border-blue-500";
    if (!isComatible) {
        border = "opacity-50 border-2 ease-in-out transition duration-150";
    }
    return baseStyle + " " + text + " " + border + " ";
}
function composeStylePlus(isHovering) {
    var baseStyle = "bg-gray-50 absolute flex flex-col flew-wrap mt-1 min-h-20 w-56 h-fit z-50 flex flex-row outline-none rounded-lg";
    var text = "text-gray-900 text-sm";
    var border = "border-2 " + (isHovering ? "border-blue-500" : "border-gray-300") + " hover:border-blue-500 active:border-blue-500";
    return baseStyle + " " + text + " " + border + " ";
}
