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
exports.PlusButtonSVG = exports.SaveRulesCountButton = exports.SortableRuleWrapper = void 0;
var RuleCard_1 = require("../../components/rule/RuleCard");
var hooks_1 = require("../../app/hooks");
var ruleSlice_1 = require("../../features/rules/ruleSlice");
var react_1 = require("react");
var SideBar_1 = require("../../features/sidebar/SideBar");
var DraftRepositorySlice_1 = require("../../features/repository/DraftRepositorySlice");
var CountableCheckButton_1 = require("../../components/CountableCheckButton");
var DraftServiceSlice_1 = require("../../features/service/DraftServiceSlice");
var react_virtuoso_1 = require("react-virtuoso");
var react_2 = require("react");
var sortable_1 = require("@dnd-kit/sortable");
var core_1 = require("@dnd-kit/core");
var react_dom_1 = require("react-dom");
var dynamic_1 = require("next/dynamic");
function ListView() {
    var dispatch = hooks_1.useAppDispatch();
    return (react_2["default"].createElement("div", { className: "flex flex-1 " },
        react_2["default"].createElement("div", { className: "grid grid-flow-col auto-cols-auto space-4 w-full" },
            react_2["default"].createElement("div", { className: "flex flex-1 flex-col col-span-1 scrollbar border-r overflow-x-visible content-area  overflow-y-scroll" },
                react_2["default"].createElement("div", { className: "flex flex-1 relative p-3 basis-1/4 overflow-y-auto " },
                    react_2["default"].createElement(SideBar_1["default"], null))),
            react_2["default"].createElement("div", { className: "px-4 flex flex-col space-y-2 content-area py-2 col-span-6" },
                react_2["default"].createElement("div", { className: "container flex flex-row items-center space-x-2 bg-white container-xl transition-opacity rounded-md border-2 border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700" },
                    react_2["default"].createElement("button", { className: "outline-none h-10 ", onClick: function () {
                            dispatch(DraftServiceSlice_1.initiatePopUp());
                            dispatch(ruleSlice_1.initiateNewRule());
                        } },
                        react_2["default"].createElement(PlusButtonSVG, null)),
                    react_2["default"].createElement(SaveRulesCountButton, null)),
                react_2["default"].createElement(DynamicRuleList, null)))));
}
function RuleList() {
    var state = hooks_1.useAppSelector(ruleSlice_1.selectRule);
    var draftRepoState = hooks_1.useAppSelector(DraftRepositorySlice_1.selectDraftRepository);
    var dispatch = hooks_1.useAppDispatch();
    react_1.useEffect(function () {
        if (state.status === "empty" && draftRepoState.status == "idle") {
            var firewall = draftRepoState.repository.workSpace[0];
            dispatch(ruleSlice_1.setRules({ rules: firewall.rules, device: firewall }));
        }
    });
    var _a = react_1.useState(null), activeId = _a[0], setActiveId = _a[1];
    var sensors = core_1.useSensors(core_1.useSensor(core_1.MouseSensor, {
        activationConstraint: {
            distance: 7
        }
    }));
    function getIndex(id) {
        return state.rules.indexOf(state.rules.filter(function (rule) { return rule.id === id; })[0]);
    }
    var activeIndex = activeId ? getIndex(activeId) : -1;
    return (react_2["default"].createElement(core_1.DndContext, { sensors: sensors, collisionDetection: core_1.closestCenter, onDragStart: function (_a) {
            var active = _a.active;
            setActiveId(active.id);
        }, onDragEnd: function (_a) {
            var over = _a.over;
            if (over) {
                var overIndex_1 = getIndex(over.id.replace("destinationserviceinput", ""));
                if (activeIndex !== overIndex_1) {
                    dispatch(ruleSlice_1.updateRules(function (items) {
                        var rules = items;
                        var movedRule = rules[activeIndex];
                        rules[activeIndex] = __assign(__assign({}, movedRule), { status: movedRule.status === "new" ? "new" : "modified" });
                        return sortable_1.arrayMove(rules, activeIndex, overIndex_1);
                    }));
                }
            }
            setActiveId(null);
        }, onDragCancel: function () { return setActiveId(null); }, id: "draggable_rule_context" },
        react_2["default"].createElement(sortable_1.SortableContext, { items: state.rules, strategy: sortable_1.verticalListSortingStrategy },
            react_2["default"].createElement(react_virtuoso_1.Virtuoso, { totalCount: state.rules.length, overscan: 1200, increaseViewportBy: 400, itemContent: function (index) {
                    var rule = state.rules[index];
                    return (react_2["default"].createElement(SortableRuleWrapper, { key: rule.id, id: rule.id, index: index, rule: rule }));
                } })),
        react_dom_1.createPortal(react_2["default"].createElement(core_1.DragOverlay, { adjustScale: false, dropAnimation: null }, activeId && activeIndex !== -1 ? (react_2["default"].createElement(RuleCard_1["default"], { index: activeIndex, rule: state.rules[activeIndex], modifyCard: function (rule) { } })) : null), document.body)));
}
var RenderCard = function (_a) {
    var rule = _a.rule, index = _a.index;
    var dispatch = hooks_1.useAppDispatch();
    return (react_2["default"].createElement(RuleCard_1["default"], { key: index, index: index, rule: rule, modifyCard: function (card) {
            return dispatch(ruleSlice_1.modifyRuleWithIndex({ rule: card, index: index }));
        } }));
};
var DynamicRuleList = dynamic_1["default"](function () { return Promise.resolve(RuleList); }, {
    ssr: false
});
function SortableRuleWrapper(_a) {
    var disabled = _a.disabled, animateLayoutChanges = _a.animateLayoutChanges, getNewIndex = _a.getNewIndex, id = _a.id, index = _a.index, rule = _a.rule;
    var _b = sortable_1.useSortable({
        id: id,
        animateLayoutChanges: animateLayoutChanges,
        disabled: disabled,
        getNewIndex: getNewIndex
    }), attributes = _b.attributes, isDragging = _b.isDragging, isSorting = _b.isSorting, listeners = _b.listeners, overIndex = _b.overIndex, setNodeRef = _b.setNodeRef, transform = _b.transform, transition = _b.transition;
    return (react_2["default"].createElement("div", __assign({ ref: setNodeRef }, listeners, attributes),
        react_2["default"].createElement(RenderCard, { rule: rule, index: index })));
}
exports.SortableRuleWrapper = SortableRuleWrapper;
function SaveRulesCountButton() {
    var state = hooks_1.useAppSelector(ruleSlice_1.selectRule);
    var dispatch = hooks_1.useAppDispatch();
    var _a = react_1.useState(0), modified = _a[0], setModified = _a[1];
    react_1.useEffect(function () {
        setModified(state.rules
            .map(function (element) { return (element.status === "source" ? 0 : 1); })
            .reduce(function (prev, next) { return prev + next; }, 0));
    }, [state.rules]);
    function onClick() {
        var services = state.rules.filter(function (element) { return element.status !== "source"; });
        dispatch(DraftRepositorySlice_1.saveRulesAsync(services));
    }
    return (react_2["default"].createElement(react_2["default"].Fragment, null, modified > 0 ? (react_2["default"].createElement("div", { className: "ml-auto" },
        react_2["default"].createElement(CountableCheckButton_1["default"], { number: modified, onClick: function (event) {
                event.stopPropagation();
                onClick();
            } }))) : ("")));
}
exports.SaveRulesCountButton = SaveRulesCountButton;
function PlusButtonSVG(_a) {
    var onClick = _a.onClick;
    return (react_2["default"].createElement("svg", { onClick: onClick === undefined ? function () { } : onClick, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512", className: "h-8 pt-1 pl-4 ml-auto items-end group hover:cursor-pointer" },
        react_2["default"].createElement("path", { d: "m256 0c-141.164062 0-256 114.835938-256 256s114.835938 256 256 256 256-114.835938 256-256-114.835938-256-256-256zm0 0", className: "group-hover:fill-blue-600 fill-white group-hover:shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" }),
        react_2["default"].createElement("path", { d: "m368 277.332031h-90.667969v90.667969c0 11.777344-9.554687 21.332031-21.332031 21.332031s-21.332031-9.554687-21.332031-21.332031v-90.667969h-90.667969c-11.777344 0-21.332031-9.554687-21.332031-21.332031s9.554687-21.332031 21.332031-21.332031h90.667969v-90.667969c0-11.777344 9.554687-21.332031 21.332031-21.332031s21.332031 9.554687 21.332031 21.332031v90.667969h90.667969c11.777344 0 21.332031 9.554687 21.332031 21.332031s-9.554687 21.332031-21.332031 21.332031zm0 0", className: "fill-blue-600 group-hovver:fill-white opacity-100 group-hover:opacity-0" }),
        react_2["default"].createElement("path", { d: "m368 277.332031h-90.667969v90.667969c0 11.777344-9.554687 21.332031-21.332031 21.332031s-21.332031-9.554687-21.332031-21.332031v-90.667969h-90.667969c-11.777344 0-21.332031-9.554687-21.332031-21.332031s9.554687-21.332031 21.332031-21.332031h90.667969v-90.667969c0-11.777344 9.554687-21.332031 21.332031-21.332031s21.332031 9.554687 21.332031 21.332031v90.667969h90.667969c11.777344 0 21.332031 9.554687 21.332031 21.332031s-9.554687 21.332031-21.332031 21.332031zm0 0", className: "fill-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" })));
}
exports.PlusButtonSVG = PlusButtonSVG;
exports["default"] = ListView;
