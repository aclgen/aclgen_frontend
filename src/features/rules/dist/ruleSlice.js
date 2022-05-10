"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var _a;
exports.__esModule = true;
exports.selectRule = exports.saveRulesToDraft = exports.modifyRuleWithIndex = exports.setRules = exports.createNewRule = exports.initiateNewRule = exports.modifyRule = exports.updateRules = exports.DraftRuleSlice = exports.updateAsync = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var repositorySlice_1 = require("../repository/repositorySlice");
var DraftServiceSlice_1 = require("../service/DraftServiceSlice");
var ruleAPI_1 = require("./ruleAPI");
var initialState = {
    rules: [],
    status: "empty",
    newRule: undefined,
    defaultFolder: undefined,
    device: undefined,
    newRuleStatus: "idle"
};
// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
exports.updateAsync = toolkit_1.createAsyncThunk("rules/fetchRules", function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ruleAPI_1.fetchRules()];
            case 1:
                response = _a.sent();
                // The value we return becomes the `fulfilled` action payload
                return [2 /*return*/, response.data];
        }
    });
}); });
exports.DraftRuleSlice = toolkit_1.createSlice({
    name: "draftRule",
    initialState: initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        updateRules: function (state, action) {
            state.rules = action.payload(state.rules);
        },
        setRules: function (state, action) {
            state.rules = action.payload.rules;
            state.defaultFolder = state.rules[0].folder;
            state.device = action.payload.device;
            state.status = "idle";
        },
        modifyRule: function (state, action) {
            var index = state.rules.findIndex(function (element) { return element.id === action.payload.id; });
            state.rules = __spreadArrays(state.rules.slice(0, index), [
                action.payload
            ], state.rules.slice(index + 1));
        },
        modifyRuleWithIndex: function (state, action) {
            state.rules = __spreadArrays(state.rules.slice(0, action.payload.index), [
                action.payload.rule
            ], state.rules.slice(action.payload.index + 1));
        },
        createNewRule: function (state, action) {
            state.newRule = undefined;
            state.rules = __spreadArrays(state.rules, [action.payload]);
            state.newRuleStatus = "idle";
        },
        saveRulesToDraft: function (state, action) { },
        initiateNewRule: function (state) {
            state.newRule = undefined;
            state.newRuleStatus = "creating";
        }
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    extraReducers: function (builder) {
        builder.addCase(DraftServiceSlice_1.cancelCreationPopUp, function (state) {
            state.newRule = undefined;
            state.newRuleStatus = "idle";
        });
        builder.addCase(DraftServiceSlice_1.initiatePopUp, function (state) {
            state.newRule = undefined;
            state.newRuleStatus = "idle";
        });
        builder.addCase(repositorySlice_1.selectRepositoryAsync.fulfilled, function (state, payload) {
            state.rules = [];
            state.status = "empty";
        });
    }
});
exports.updateRules = (_a = exports.DraftRuleSlice.actions, _a.updateRules), exports.modifyRule = _a.modifyRule, exports.initiateNewRule = _a.initiateNewRule, exports.createNewRule = _a.createNewRule, exports.setRules = _a.setRules, exports.modifyRuleWithIndex = _a.modifyRuleWithIndex, exports.saveRulesToDraft = _a.saveRulesToDraft;
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
exports.selectRule = function (state) { return state.rule; };
// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
exports["default"] = exports.DraftRuleSlice.reducer;
