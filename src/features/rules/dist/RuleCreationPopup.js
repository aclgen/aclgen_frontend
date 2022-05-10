"use strict";
exports.__esModule = true;
var react_1 = require("react");
var hooks_1 = require("../../app/hooks");
var types_1 = require("../../types/types");
var ruleSlice_1 = require("./ruleSlice");
var uuid_1 = require("uuid");
var RulePopupForm_1 = require("../../components/creationForm/RulePopupForm");
var DraftNetworkObjectSlice_1 = require("../networkObject/DraftNetworkObjectSlice");
var DraftServiceSlice_1 = require("../service/DraftServiceSlice");
var repository_1 = require("../../types/repository");
function RuleCreationPopUp() {
    var dispatch = hooks_1.useAppDispatch();
    var rulestate = hooks_1.useAppSelector(ruleSlice_1.selectRule);
    var serviceState = hooks_1.useAppSelector(DraftServiceSlice_1.selectService);
    var networkObjectState = hooks_1.useAppSelector(DraftNetworkObjectSlice_1.selectNetworkObjects);
    var _a = react_1.useState(""), name = _a[0], setName = _a[1];
    var _b = react_1.useState(""), comment = _b[0], setComment = _b[1];
    var _c = react_1.useState([]), sourceServices = _c[0], setSourceServices = _c[1];
    var _d = react_1.useState([]), destinationServices = _d[0], setDestinationServices = _d[1];
    var _e = react_1.useState([]), source = _e[0], setSource = _e[1];
    var _f = react_1.useState([]), destination = _f[0], setDestination = _f[1];
    var _g = react_1.useState(types_1.DIRECTION.INBOUND), direction = _g[0], setDirection = _g[1];
    var _h = react_1.useState(types_1.POLICY.ACCEPT), policy = _h[0], setPolicy = _h[1];
    var id = uuid_1.v4();
    var newRule = {
        sources: source,
        destinations: destination,
        destinationServices: destinationServices,
        sourceServices: sourceServices,
        direction: direction,
        policy: policy,
        name: name,
        comment: comment,
        device: rulestate.device.id,
        status: "new",
        id: id,
        lock: repository_1.LockStatus.UNLOCKED,
        folder: rulestate.defaultFolder
    };
    var ruleProps = {
        isVisible: rulestate.newRuleStatus === "creating",
        name: name,
        element: newRule,
        setName: function (name) {
            setName(name);
        },
        comment: comment,
        setComment: function (comment) {
            setComment(comment);
        },
        source: source,
        destination: destination,
        sourceService: sourceServices,
        destinationService: destinationServices,
        setSource: function (element) {
            setSource(element);
        },
        setDestination: function (element) {
            setDestination(element);
        },
        setSourceService: function (element) {
            setSourceServices(element);
        },
        setDestinationService: function (element) {
            setDestinationServices(element);
        },
        onCreateNewObject: function (name) {
            dispatch(DraftServiceSlice_1.initiatePopUp());
            dispatch(DraftNetworkObjectSlice_1.initiateNewObject(name));
        },
        onCreateNewService: function (name) {
            dispatch(DraftServiceSlice_1.initiatePopUp());
            dispatch(DraftServiceSlice_1.initiateNewService({ name: name }));
        },
        searchAbleElements: serviceState.services,
        searchAbleObjects: networkObjectState.networkObjects,
        onSubmit: function () {
            dispatch(DraftServiceSlice_1.initiatePopUp());
            dispatch(ruleSlice_1.createNewRule(newRule));
        },
        onCancel: function () {
            dispatch(DraftServiceSlice_1.initiatePopUp());
            dispatch(DraftServiceSlice_1.cancelCreationPopUp());
        }
    };
    return react_1["default"].createElement(RulePopupForm_1.RulePopUpForm, { rule: ruleProps });
}
var TrashIcon = function () {
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement("img", { src: "/square.svg", className: " mr-3 h-6" })));
};
var CheckIcon = function (_a) {
    var onClick = _a.onClick;
    return (react_1["default"].createElement("div", { onClick: onClick, className: "border-2 border-gray-100 rounded-md hover:cursor-pointer hover:border-blue-400 h-10 w-10 hover:shadow-lg" },
        react_1["default"].createElement("svg", { version: "1.1", id: "Layer_1", xmlns: "http://www.w3.org/2000/svg", x: "0px", y: "0px", viewBox: "0 0 512 512", className: "h-8 pt-1 pl-1" },
            react_1["default"].createElement("path", { d: "M504.502,75.496c-9.997-9.998-26.205-9.998-36.204,0L161.594,382.203L43.702,264.311c-9.997-9.998-26.205-9.997-36.204,0\n\t\t\tc-9.998,9.997-9.998,26.205,0,36.203l135.994,135.992c9.994,9.997,26.214,9.99,36.204,0L504.502,111.7\n\t\t\tC514.5,101.703,514.499,85.494,504.502,75.496z", className: "fill-blue-700" }))));
};
exports["default"] = RuleCreationPopUp;
