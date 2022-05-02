"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.createPortService = exports.createServiceElement = exports.createPortRangeService = exports.createServiceFromState = exports.ServiceTypeToName = exports.ServiceEditingBase = exports.convertPortToPortRangeService = exports.ServicePopup = void 0;
var react_1 = require("react");
var hooks_1 = require("../../app/hooks");
var ServiceCreationForm_1 = require("../../components/creationForm/ServiceCreationForm");
var types_1 = require("../../types/types");
var DraftServiceSlice_1 = require("./DraftServiceSlice");
var uuid_1 = require("uuid");
var ServiceInputHandler_1 = require("./ServiceInputHandler");
function ServicePopup() {
    var state = hooks_1.useAppSelector(DraftServiceSlice_1.selectService);
    switch (state.newServiceStatus) {
        case "idle":
            return react_1["default"].createElement(react_1["default"].Fragment, null);
        default:
            return react_1["default"].createElement(ServiceCreationPopup, { service: state.newService });
    }
}
exports.ServicePopup = ServicePopup;
function ServiceCreationPopup(_a) {
    var service = _a.service;
    switch (service.type) {
        case types_1.ServiceType.PORT:
            return react_1["default"].createElement(CreatePortServiceInput, { newService: service });
        case types_1.ServiceType.PORT_RANGE:
            return react_1["default"].createElement(CreatePortRangeServiceInput, { newService: service });
    }
}
function CreatePortServiceInput(_a) {
    var newService = _a.newService;
    var dispatch = hooks_1.useAppDispatch();
    function updateServiceType(type) {
        dispatch(DraftServiceSlice_1.initiateNewService(__assign(__assign(__assign({}, newService), baseFields), { type: type })));
    }
    var baseFields = ServiceEditingBase(newService, updateServiceType);
    var specialInputHandler = exports.convertPortToPortRangeService(function () {
        return dispatch(DraftServiceSlice_1.initiateNewService(__assign(__assign({}, createNewServiceFromInputs(newService, baseFields, {
            portInputHandler: portInput,
            protocolInputHandler: protocolInput
        })), { type: types_1.ServiceType.PORT_RANGE })));
    });
    var portInput = ServiceInputHandler_1.usePortInputHandler(newService.port.toString(), specialInputHandler);
    var protocolInput = ServiceInputHandler_1.useProtocolInputHandler(newService.protocol);
    var serviceProps = __assign(__assign(__assign(__assign(__assign({}, newService), baseFields), { protocolInputHandler: protocolInput, portInputHandler: portInput }), portInput), { isVisible: true, element: newService, onSubmit: function () {
            dispatch(DraftServiceSlice_1.initiatePopUp());
            dispatch(DraftServiceSlice_1.createNewService(createNewServiceFromInputs(newService, baseFields, {
                portInputHandler: portInput,
                protocolInputHandler: protocolInput
            })));
        }, onCancel: function () {
            dispatch(DraftServiceSlice_1.initiatePopUp());
            dispatch(DraftServiceSlice_1.cancelCreationPopUp());
        } });
    return react_1["default"].createElement(ServiceCreationForm_1["default"], { service: serviceProps });
}
function CreatePortRangeServiceInput(_a) {
    var newService = _a.newService;
    var dispatch = hooks_1.useAppDispatch();
    function updateServiceType(type) {
        dispatch(DraftServiceSlice_1.initiateNewService(__assign(__assign(__assign({}, newService), baseFields), { type: type })));
    }
    var baseFields = ServiceEditingBase(newService, updateServiceType);
    var portInput = ServiceInputHandler_1.usePortRangeInputHandler(newService.portStart.toString(), newService.portEnd.toString());
    var protocolInput = ServiceInputHandler_1.useProtocolInputHandler(newService.protocol);
    var serviceProps = __assign(__assign(__assign(__assign(__assign({}, newService), baseFields), { protocolInputHandler: protocolInput, portRangeInputHandler: portInput }), portInput), { isVisible: true, element: newService, onSubmit: function () {
            dispatch(DraftServiceSlice_1.initiatePopUp());
            dispatch(DraftServiceSlice_1.createNewService(createNewServiceFromInputs(newService, baseFields, {
                portRangeInputHandler: portInput,
                protocolInputHandler: protocolInput
            })));
        }, onCancel: function () {
            dispatch(DraftServiceSlice_1.initiatePopUp());
            dispatch(DraftServiceSlice_1.cancelCreationPopUp());
        } });
    return react_1["default"].createElement(ServiceCreationForm_1["default"], { service: serviceProps });
}
exports.convertPortToPortRangeService = function (execute) {
    return {
        handleSingleInput: function (input) {
            if (String(input).includes("-")) {
                execute();
            }
        }
    };
};
function createNewServiceFromInputs(service, baseElements, serviceElements) {
    var newService = {
        name: baseElements.name,
        type: service.type,
        id: service.id,
        comment: baseElements.comment,
        status: service.status === "new" ? "new" : "modified"
    };
    switch (baseElements.type) {
        case types_1.ServiceType.PORT: {
            var elements = serviceElements;
            return __assign(__assign({}, newService), { port: Number.parseInt(elements.portInputHandler.inputValue), protocol: elements.protocolInputHandler.inputValue });
        }
        case types_1.ServiceType.PORT_RANGE: {
            var elements = serviceElements;
            return __assign(__assign({}, newService), { portStart: Number.parseInt(elements.portRangeInputHandler.portFromHandler.inputValue), portEnd: Number.parseInt(elements.portRangeInputHandler.portToHandler.inputValue), protocol: elements.protocolInputHandler.inputValue });
        }
    }
}
function ServiceEditingBase(service, updateServiceType) {
    var _a = react_1.useState(service.name), name = _a[0], setName = _a[1];
    var _b = react_1.useState(service.comment), comment = _b[0], setComment = _b[1];
    var _c = react_1.useState(service.type), type = _c[0], setlocalType = _c[1];
    function setType(type) {
        updateServiceType(type);
        setlocalType(type);
    }
    return { name: name, setName: setName, comment: comment, setComment: setComment, type: type, setType: setType };
}
exports.ServiceEditingBase = ServiceEditingBase;
function ServiceTypeToName(type) {
    switch (type) {
        case types_1.ServiceType.PORT:
            return "Port";
        case types_1.ServiceType.PORT_RANGE:
            return "Port Range";
    }
}
exports.ServiceTypeToName = ServiceTypeToName;
exports["default"] = ServicePopup;
function createServiceFromState(service) {
    if (service === undefined) {
        return createPortService({});
    }
    else if (service.type !== undefined) {
        return createServiceFromType(service, service.type);
    }
    else {
        return createServiceFromType(service, types_1.ServiceType.PORT);
    }
}
exports.createServiceFromState = createServiceFromState;
function createServiceFromType(service, type) {
    switch (type) {
        case types_1.ServiceType.PORT_RANGE:
            return createPortRangeService(service);
        default:
            return createPortService(service);
    }
}
function createPortRangeService(service) {
    var newService = __assign(__assign({}, createServiceElement(service, types_1.ServiceType.PORT_RANGE)), { portStart: service.portStart ? service.portStart : 0, portEnd: service.portEnd ? service.portEnd : 0, protocol: service.protocol ? service.protocol : "TCP", type: types_1.ServiceType.PORT_RANGE });
    return newService;
}
exports.createPortRangeService = createPortRangeService;
function createServiceElement(service, type) {
    var newService = {
        name: service.name ? service.name : "",
        type: type,
        id: service.id ? service.id : uuid_1.v4(),
        comment: service.comment ? service.comment : "",
        status: service.state ? service.status : "new"
    };
    return newService;
}
exports.createServiceElement = createServiceElement;
function createPortService(service) {
    var newService = __assign(__assign({}, createServiceElement(service, types_1.ServiceType.PORT)), { protocol: service.protocol ? service.protocol : "TCP", type: types_1.ServiceType.PORT, port: service.port ? service.port : 0 });
    return newService;
}
exports.createPortService = createPortService;
