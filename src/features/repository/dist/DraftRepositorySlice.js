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
exports.selectDraftRepository = exports.mergedDraftRepository = exports.updateRepositories = exports.DraftRepositorySlice = exports.saveRulesAsync = exports.commitObjectsAsync = exports.commitServicesAsync = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var EmptyRepository_1 = require("./EmptyRepository");
var repositorySlice_1 = require("./repositorySlice");
var DraftServiceSlice_1 = require("../service/DraftServiceSlice");
var DraftWorkSpaceSlice_1 = require("../workSpaceDraft/DraftWorkSpaceSlice");
var DraftNetworkObjectSlice_1 = require("../networkObject/DraftNetworkObjectSlice");
var ruleSlice_1 = require("../rules/ruleSlice");
var serviceAPI_1 = require("../service/serviceAPI");
var networkObjectAPI_1 = require("../networkObject/networkObjectAPI");
var ruleAPI_1 = require("../rules/ruleAPI");
var initialState = {
    repository: EmptyRepository_1["default"],
    status: "empty"
};
exports.commitServicesAsync = toolkit_1.createAsyncThunk("draftRepository/pushServices", function (services, thunkAPI) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                thunkAPI.dispatch(DraftServiceSlice_1.saveServicesToDraft(thunkAPI.getState().service.services));
                return [4 /*yield*/, serviceAPI_1.saveServices(services, thunkAPI.getState().draftRepository.repository.id)];
            case 1:
                response = _a.sent();
                // The value we return becomes the `fulfilled` action payload
                return [2 /*return*/, response.data];
        }
    });
}); });
exports.commitObjectsAsync = toolkit_1.createAsyncThunk("draftRepository/pushObjetcs", function (objects, thunkAPI) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                thunkAPI.dispatch(DraftNetworkObjectSlice_1.saveNetworkObjectsToDraft(thunkAPI.getState().networkObject.networkObjects));
                return [4 /*yield*/, networkObjectAPI_1.SaveNetworkObjects({ objects: objects }, thunkAPI.getState().draftRepository.repository.id)];
            case 1:
                response = _a.sent();
                // The value we return becomes the `fulfilled` action payload
                return [2 /*return*/, response.data];
        }
    });
}); });
exports.saveRulesAsync = toolkit_1.createAsyncThunk("draftRepository/saveRules", function (rules, thunkAPI) { return __awaiter(void 0, void 0, void 0, function () {
    var response, objects, services, savedRules;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                thunkAPI.dispatch(ruleSlice_1.saveRulesToDraft(thunkAPI.getState().rule.rules));
                return [4 /*yield*/, ruleAPI_1.saveRules(rules, thunkAPI.getState().draftRepository.repository.id, thunkAPI.getState().rule.device.id)];
            case 1:
                response = _a.sent();
                objects = thunkAPI.getState().draftRepository.repository.networkObjects;
                services = thunkAPI.getState().draftRepository.repository.services;
                console.log(response.data);
                savedRules = response.data.map(function (element) {
                    return __assign(__assign({}, element), { policy: element.action, status: "source", sources: element.sources.map(function (elementSource) {
                            return objects.find(function (serviceElement) { return serviceElement.id === elementSource; });
                        }), destinations: element.destinations.map(function (elemenDestinations) {
                            return objects.find(function (serviceElement) { return serviceElement.id === elemenDestinations; });
                        }), sourceServices: element.services_sources.map(function (elementService) {
                            return services.find(function (serviceElement) { return serviceElement.id === elementService; });
                        }), destinationServices: element.services_destinations.map(function (elementService) {
                            return services.find(function (serviceElement) { return serviceElement.id === elementService; });
                        }) });
                });
                return [2 /*return*/, savedRules];
        }
    });
}); });
// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
exports.DraftRepositorySlice = toolkit_1.createSlice({
    name: "draftRepository",
    initialState: initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        updateRepositories: function (state, action) { },
        mergedDraftRepository: function (state, action) { }
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    extraReducers: function (builder) {
        builder.addCase(repositorySlice_1.selectRepositoryAsync.fulfilled, function (state, action) {
            state.status = "loading";
            state.repository = mergeUpdatedRepository(state.repository, action.payload);
            state.status = "idle";
        });
        builder.addCase(DraftServiceSlice_1.saveServicesToDraft, function (state, action) {
            state.repository = __assign(__assign({}, state.repository), { services: action.payload });
        });
        builder.addCase(DraftWorkSpaceSlice_1.saveWorkSpaceToDraft, function (state, action) {
            state.repository = __assign(__assign({}, state.repository), { workSpace: action.payload });
        });
        builder.addCase(DraftNetworkObjectSlice_1.saveNetworkObjectsToDraft, function (state, action) {
            state.repository = __assign(__assign({}, state.repository), { networkObjects: action.payload });
        });
        builder.addCase(ruleSlice_1.saveRulesToDraft, function (state, action) {
            var index = state.repository.workSpace.findIndex(function (element) { return element.id == action.payload[0].device; });
            var newFireWall = __assign(__assign({}, state.repository.workSpace[index]), { rules: action.payload });
            state.repository = __assign(__assign({}, state.repository), { workSpace: __spreadArrays((state.repository.workSpace = __spreadArrays(state.repository.workSpace.slice(0, index), [
                    newFireWall
                ], state.repository.workSpace.slice(index + 1)))) });
        });
        builder.addCase(exports.commitServicesAsync.pending, function (state) {
            state.status = "loading";
        });
        builder.addCase(exports.commitServicesAsync.fulfilled, function (state, action) {
            state.status = "idle";
            var services = action.payload;
            state.repository = __assign(__assign({}, state.repository), { services: state.repository.services.filter(function (element) {
                    var service = services.find(function (service) { return service.id === element.id; });
                    return service == undefined;
                }) });
        });
        builder.addCase(exports.commitObjectsAsync.pending, function (state) {
            state.status = "loading";
        });
        builder.addCase(exports.commitObjectsAsync.fulfilled, function (state, action) {
            state.status = "idle";
            var objects = action.payload;
            state.repository = __assign(__assign({}, state.repository), { networkObjects: state.repository.networkObjects.filter(function (element) {
                    var object = objects.find(function (service) { return service.id === element.id; });
                    return object == undefined;
                }) });
        });
        builder.addCase(exports.saveRulesAsync.pending, function (state) {
            state.status = "loading";
        });
        builder.addCase(exports.saveRulesAsync.rejected, function (state) {
            state.status = "idle";
        });
        builder.addCase(exports.saveRulesAsync.fulfilled, function (state, action) {
            var index = state.repository.workSpace.findIndex(function (element) { return element.id == state.repository.workSpace[0].id; });
            var rules = action.payload;
            var newFireWall = __assign(__assign({}, state.repository.workSpace[index]), { rules: state.repository.workSpace[index].rules.filter(function (element) {
                    var rule = rules.find(function (rule) { return rule.id === element.id; });
                    return rule == undefined;
                }) });
            state.status = "idle";
            state.repository = __assign(__assign({}, state.repository), { workSpace: __spreadArrays((state.repository.workSpace = __spreadArrays(state.repository.workSpace.slice(0, index), [
                    newFireWall
                ], state.repository.workSpace.slice(index + 1)))) });
        });
    }
});
exports.updateRepositories = (_a = exports.DraftRepositorySlice.actions, _a.updateRepositories), exports.mergedDraftRepository = _a.mergedDraftRepository;
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
exports.selectDraftRepository = function (state) { return state.draftRepository; };
// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
exports["default"] = exports.DraftRepositorySlice.reducer;
function mergeUpdatedRepository(repository, payload) {
    var workSpace = mergeWorkSpace(payload.workSpace, repository.workSpace);
    var services = mergeServices(payload.services, repository.services);
    var networkObjects = mergeNetworkObjects(payload.networkObjects, repository.networkObjects);
    return __assign(__assign({}, payload), { workSpace: workSpace, services: services, networkObjects: networkObjects });
}
function mergeWorkSpace(sourceWorkSpace, draftWorkspace) {
    return mergeEditableElements(sourceWorkSpace, draftWorkspace);
}
function mergeServices(sourceServices, draftServices) {
    return mergeEditableElements(sourceServices, draftServices);
}
function mergeNetworkObjects(sourceNetworkElements, draftNetworkElements) {
    return mergeEditableElements(sourceNetworkElements, draftNetworkElements);
}
function mergeEditableElements(sourceElements, draftElements) {
    var source = __spreadArrays(sourceElements);
    var newElements = draftElements.filter(function (element) { return element.status === "modified" || element.status === "new"; });
    if (draftElements.length === 0) {
        return source;
    }
    var newArray = __spreadArrays(sourceElements);
    var _loop_1 = function (i) {
        var index = draftElements.findIndex(function (element) { return element.id === newElements[i].id; });
        newArray.splice(index, 0, newElements[i]);
    };
    for (var i = 0; i < newElements.length; i++) {
        _loop_1(i);
    }
    return newArray;
}
function mergeElement(source, newElement) {
    if (newElement.status === "source") {
        return source;
        //nestable means an object containing children element, i.e. folder or grouped object
    }
    else if (isNestable(source) && isNestable(newElement)) {
        mergeEditableElements(source.children, newElement.children);
    }
    else {
        return newElement;
    }
}
function isNestable(element) {
    return element.children !== undefined;
}
