"use strict";
exports.__esModule = true;
exports.statusStyle = exports.RenderFirewall = exports.RenderNetworkElement = exports.RenderNetworkObjects = exports.RenderService = exports.CheckIcon = exports.RenderSideBarElement = void 0;
var PopUpForm_1 = require("../creationForm/PopUpForm");
function RenderSideBarElement(_a) {
    var name = _a.name, icon = _a.icon, alt = _a.alt, status = _a.status, onClick = _a.onClick, onClickCheck = _a.onClickCheck;
    return (React.createElement("div", { key: name, onClick: onClick, className: "flex flex-row hover:shadow-lg hover:cursor-pointer hover:bg-slate-100 transition-shadow  " + exports.statusStyle(status) + "  h-10 shadow-md items-center px-4 rounded-md" },
        React.createElement("img", { className: "h-5", src: icon, alt: alt }),
        React.createElement("p", { className: "text-md select-none text-gray-700  pl-2" }, name),
        React.createElement("div", { className: "ml-auto" }, status !== "source" ? (React.createElement(exports.CheckIcon, { onClick: function (e) {
                e.stopPropagation();
                onClickCheck;
            }, size: "md" })) : (React.createElement(React.Fragment, null)))));
}
exports.RenderSideBarElement = RenderSideBarElement;
exports.CheckIcon = function (_a) {
    var onClick = _a.onClick, _b = _a.size, size = _b === void 0 ? "md" : _b;
    var height = PopUpForm_1.getHeight(size);
    return (React.createElement("div", { onClick: onClick },
        React.createElement("svg", { version: "1.1", id: "Layer_1", xmlns: "http://www.w3.org/2000/svg", x: "0px", y: "0px", viewBox: "0 0 512 512", className: "h-" + height + " pt-1 pl-1 " },
            React.createElement("path", { d: "M504.502,75.496c-9.997-9.998-26.205-9.998-36.204,0L161.594,382.203L43.702,264.311c-9.997-9.998-26.205-9.997-36.204,0\n\t\t\tc-9.998,9.997-9.998,26.205,0,36.203l135.994,135.992c9.994,9.997,26.214,9.99,36.204,0L504.502,111.7\n\t\t\tC514.5,101.703,514.499,85.494,504.502,75.496z", className: "fill-blue-700" }))));
};
function RenderService(service, onClick) {
    if (service.status !== "deleted") {
        return (React.createElement(RenderSideBarElement, { key: service.id, name: service.name, status: service.status, icon: "/computer-networks.svg", alt: "service", onClick: function () { return onClick(); } }));
    }
}
exports.RenderService = RenderService;
function RenderNetworkObjects(element, onClick) {
    if (element.status !== "deleted") {
        return (React.createElement(RenderSideBarElement, { key: element.id, status: element.status, name: element.name, icon: "/server.svg", alt: "Host", onClick: onClick }));
    }
}
exports.RenderNetworkObjects = RenderNetworkObjects;
function RenderNetworkElement(element, onClick) {
    switch (element.type) {
        case "firewall": {
            return (React.createElement(RenderFirewall, { fireWall: element, onClick: onClick }));
        }
        default: {
            return React.createElement(React.Fragment, null);
        }
    }
}
exports.RenderNetworkElement = RenderNetworkElement;
function RenderFirewall(_a) {
    var fireWall = _a.fireWall, onClick = _a.onClick;
    return (React.createElement(RenderSideBarElement, { status: fireWall.status, key: fireWall.id, name: fireWall.name, icon: "/firewall.svg", alt: "firewall", onClick: onClick }));
}
exports.RenderFirewall = RenderFirewall;
exports.statusStyle = function (status) {
    switch (status) {
        case "modified":
            return "border-blue-500 border-2";
        case "new":
            return "border-green-500 border-2";
        case "deleted":
            return "display-none";
        case "source":
            return "border-gray-200 border-2";
    }
};
