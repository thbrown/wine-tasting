"use strict";
(self["webpackChunkwine_tasting"] = self["webpackChunkwine_tasting"] || []).push([["blueprint-icons-all-paths-loader"],{

/***/ "./node_modules/@blueprintjs/icons/lib/esm/paths-loaders/allPathsLoader.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@blueprintjs/icons/lib/esm/paths-loaders/allPathsLoader.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   allPathsLoader: () => (/* binding */ allPathsLoader)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.mjs");
/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A simple module loader which concatenates all icon paths into a single chunk.
 */
var allPathsLoader = function (name, size) { return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(void 0, void 0, void 0, function () {
    var getIconPaths;
    return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(/*! import() | blueprint-icons-all-paths */[__webpack_require__.e("blueprint-icons-20px-paths"), __webpack_require__.e("blueprint-icons-16px-paths"), __webpack_require__.e("blueprint-icons-all-paths")]).then(__webpack_require__.bind(__webpack_require__, /*! ../allPaths */ "./node_modules/@blueprintjs/icons/lib/esm/allPaths.js"))];
            case 1:
                getIconPaths = (_a.sent()).getIconPaths;
                return [2 /*return*/, getIconPaths(name, size)];
        }
    });
}); };
//# sourceMappingURL=allPathsLoader.js.map

/***/ })

}]);
//# sourceMappingURL=blueprint-icons-all-paths-loader.bundle.js.map