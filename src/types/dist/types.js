"use strict";
exports.__esModule = true;
exports.DIRECTION = exports.POLICY = exports.NetworkObjectType = exports.ServiceType = void 0;
var ServiceType;
(function (ServiceType) {
    ServiceType["PORT"] = "PORT";
    ServiceType["PORT_RANGE"] = "PORT_RANGE";
})(ServiceType = exports.ServiceType || (exports.ServiceType = {}));
var NetworkObjectType;
(function (NetworkObjectType) {
    NetworkObjectType["IPV4"] = "IPV4";
    NetworkObjectType["IPV4_RANGE"] = "IPV4_RANGE";
})(NetworkObjectType = exports.NetworkObjectType || (exports.NetworkObjectType = {}));
var POLICY;
(function (POLICY) {
    POLICY["ACCEPT"] = "ACCEPT";
    POLICY["DENY"] = "DENY";
})(POLICY = exports.POLICY || (exports.POLICY = {}));
var DIRECTION;
(function (DIRECTION) {
    DIRECTION["INBOUND"] = "INBOUND";
    DIRECTION["OUTBOUND"] = "OUTBOUND";
})(DIRECTION = exports.DIRECTION || (exports.DIRECTION = {}));
