'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
customElements.define('compodoc-menu', /*#__PURE__*/function (_HTMLElement) {
  function _class() {
    var _this;
    _classCallCheck(this, _class);
    _this = _callSuper(this, _class);
    _this.isNormalMode = _this.getAttribute('mode') === 'normal';
    return _this;
  }
  _inherits(_class, _HTMLElement);
  return _createClass(_class, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this.render(this.isNormalMode);
    }
  }, {
    key: "render",
    value: function render(isNormalMode) {
      var tp = lithtml.html("\n        <nav>\n            <ul class=\"list\">\n                <li class=\"title\">\n                    <a href=\"index.html\" data-type=\"index-link\">frontend documentation</a>\n                </li>\n\n                <li class=\"divider\"></li>\n                ".concat(isNormalMode ? "<div id=\"book-search-input\" role=\"search\"><input type=\"text\" placeholder=\"Type to search\"></div>" : '', "\n                <li class=\"chapter\">\n                    <a data-type=\"chapter-link\" href=\"index.html\"><span class=\"icon ion-ios-home\"></span>Getting started</a>\n                    <ul class=\"links\">\n                        <li class=\"link\">\n                            <a href=\"index.html\" data-type=\"chapter-link\">\n                                <span class=\"icon ion-ios-keypad\"></span>Overview\n                            </a>\n                        </li>\n                                <li class=\"link\">\n                                    <a href=\"dependencies.html\" data-type=\"chapter-link\">\n                                        <span class=\"icon ion-ios-list\"></span>Dependencies\n                                    </a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"properties.html\" data-type=\"chapter-link\">\n                                        <span class=\"icon ion-ios-apps\"></span>Properties\n                                    </a>\n                                </li>\n                    </ul>\n                </li>\n                    <li class=\"chapter\">\n                        <div class=\"simple menu-toggler\" data-bs-toggle=\"collapse\" ").concat(isNormalMode ? 'data-bs-target="#components-links"' : 'data-bs-target="#xs-components-links"', ">\n                            <span class=\"icon ion-md-cog\"></span>\n                            <span>Components</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="components-links"' : 'id="xs-components-links"', ">\n                            <li class=\"link\">\n                                <a href=\"components/ActionPawnComponent.html\" data-type=\"entity-link\" >ActionPawnComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/ActionPawnSpaceComponent.html\" data-type=\"entity-link\" >ActionPawnSpaceComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/AdaptionActionDisplayCardComponent.html\" data-type=\"entity-link\" >AdaptionActionDisplayCardComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/AnimalCardComponent.html\" data-type=\"entity-link\" >AnimalCardComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/AppComponent.html\" data-type=\"entity-link\" >AppComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/DrawPoolGameComponent.html\" data-type=\"entity-link\" >DrawPoolGameComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/ElementComponent.html\" data-type=\"entity-link\" >ElementComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/ElementSpaceComponent.html\" data-type=\"entity-link\" >ElementSpaceComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/EyeballComponent.html\" data-type=\"entity-link\" >EyeballComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/LoginPageComponent.html\" data-type=\"entity-link\" >LoginPageComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/LogoutPageComponent.html\" data-type=\"entity-link\" >LogoutPageComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/SignUpConfirmPageComponent.html\" data-type=\"entity-link\" >SignUpConfirmPageComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/SignUpPageComponent.html\" data-type=\"entity-link\" >SignUpPageComponent</a>\n                            </li>\n                        </ul>\n                    </li>\n                    <li class=\"chapter\">\n                        <div class=\"simple menu-toggler\" data-bs-toggle=\"collapse\" ").concat(isNormalMode ? 'data-bs-target="#classes-links"' : 'data-bs-target="#xs-classes-links"', ">\n                            <span class=\"icon ion-ios-paper\"></span>\n                            <span>Classes</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"', ">\n                            <li class=\"link\">\n                                <a href=\"classes/ActionDisplaySetupManager.html\" data-type=\"entity-link\" >ActionDisplaySetupManager</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/Animal.html\" data-type=\"entity-link\" >Animal</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/AnimalElements.html\" data-type=\"entity-link\" >AnimalElements</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/Area.html\" data-type=\"entity-link\" >Area</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/Faction.html\" data-type=\"entity-link\" >Faction</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/GameElement.html\" data-type=\"entity-link\" >GameElement</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/Pile.html\" data-type=\"entity-link\" >Pile</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/PileAdapter.html\" data-type=\"entity-link\" >PileAdapter</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/Player.html\" data-type=\"entity-link\" >Player</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/Space.html\" data-type=\"entity-link\" >Space</a>\n                            </li>\n                        </ul>\n                    </li>\n                        <li class=\"chapter\">\n                            <div class=\"simple menu-toggler\" data-bs-toggle=\"collapse\" ").concat(isNormalMode ? 'data-bs-target="#injectables-links"' : 'data-bs-target="#xs-injectables-links"', ">\n                                <span class=\"icon ion-md-arrow-round-down\"></span>\n                                <span>Injectables</span>\n                                <span class=\"icon ion-ios-arrow-down\"></span>\n                            </div>\n                            <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"', ">\n                                <li class=\"link\">\n                                    <a href=\"injectables/ActionDisplayManagerService.html\" data-type=\"entity-link\" >ActionDisplayManagerService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/AdaptionActionDisplayService.html\" data-type=\"entity-link\" >AdaptionActionDisplayService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/AnimalProviderService.html\" data-type=\"entity-link\" >AnimalProviderService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/AreaRegistryService.html\" data-type=\"entity-link\" >AreaRegistryService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/AreaStateService.html\" data-type=\"entity-link\" >AreaStateService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/AuthService.html\" data-type=\"entity-link\" >AuthService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/CognitoClientService.html\" data-type=\"entity-link\" >CognitoClientService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/ElementDrawPoolService.html\" data-type=\"entity-link\" >ElementDrawPoolService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/FactionRegistryService.html\" data-type=\"entity-link\" >FactionRegistryService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/FactionStateService.html\" data-type=\"entity-link\" >FactionStateService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/GameElementRegistryService.html\" data-type=\"entity-link\" >GameElementRegistryService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/GameElementStateService.html\" data-type=\"entity-link\" >GameElementStateService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/GameManagementService.html\" data-type=\"entity-link\" >GameManagementService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/GameStateClientService.html\" data-type=\"entity-link\" >GameStateClientService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/GameStatePatchService.html\" data-type=\"entity-link\" >GameStatePatchService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/GameStateService.html\" data-type=\"entity-link\" >GameStateService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/GameStateStoreService.html\" data-type=\"entity-link\" >GameStateStoreService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/LocalStorageService.html\" data-type=\"entity-link\" >LocalStorageService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/PileRegistryService.html\" data-type=\"entity-link\" >PileRegistryService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/PileStateService.html\" data-type=\"entity-link\" >PileStateService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/PlayerService.html\" data-type=\"entity-link\" >PlayerService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/SignUpService.html\" data-type=\"entity-link\" >SignUpService</a>\n                                </li>\n                            </ul>\n                        </li>\n                    <li class=\"chapter\">\n                        <div class=\"simple menu-toggler\" data-bs-toggle=\"collapse\" ").concat(isNormalMode ? 'data-bs-target="#interfaces-links"' : 'data-bs-target="#xs-interfaces-links"', ">\n                            <span class=\"icon ion-md-information-circle-outline\"></span>\n                            <span>Interfaces</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"', ">\n                            <li class=\"link\">\n                                <a href=\"interfaces/Action.html\" data-type=\"entity-link\" >Action</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/ActionDisplayServiceWithSetup.html\" data-type=\"entity-link\" >ActionDisplayServiceWithSetup</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/ActionPawnPiece.html\" data-type=\"entity-link\" >ActionPawnPiece</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/AnimalConfig.html\" data-type=\"entity-link\" >AnimalConfig</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/AreaState.html\" data-type=\"entity-link\" >AreaState</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/CognitoJwtPayload.html\" data-type=\"entity-link\" >CognitoJwtPayload</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/ElementConfig.html\" data-type=\"entity-link\" >ElementConfig</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/ElementPiece.html\" data-type=\"entity-link\" >ElementPiece</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/FactionAssignment.html\" data-type=\"entity-link\" >FactionAssignment</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/FactionState.html\" data-type=\"entity-link\" >FactionState</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/GameElementState.html\" data-type=\"entity-link\" >GameElementState</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/GameState.html\" data-type=\"entity-link\" >GameState</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/GameStatePatch.html\" data-type=\"entity-link\" >GameStatePatch</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/LoginFormData.html\" data-type=\"entity-link\" >LoginFormData</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/Piece.html\" data-type=\"entity-link\" >Piece</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/PileConfig.html\" data-type=\"entity-link\" >PileConfig</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/PileState.html\" data-type=\"entity-link\" >PileState</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/PlayerAuthData.html\" data-type=\"entity-link\" >PlayerAuthData</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/PlayerState.html\" data-type=\"entity-link\" >PlayerState</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/SignUpConfirmFormData.html\" data-type=\"entity-link\" >SignUpConfirmFormData</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/SignUpFormData.html\" data-type=\"entity-link\" >SignUpFormData</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/SpaceState.html\" data-type=\"entity-link\" >SpaceState</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/SpeciesPiece.html\" data-type=\"entity-link\" >SpeciesPiece</a>\n                            </li>\n                        </ul>\n                    </li>\n                    <li class=\"chapter\">\n                        <div class=\"simple menu-toggler\" data-bs-toggle=\"collapse\" ").concat(isNormalMode ? 'data-bs-target="#miscellaneous-links"' : 'data-bs-target="#xs-miscellaneous-links"', ">\n                            <span class=\"icon ion-ios-cube\"></span>\n                            <span>Miscellaneous</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"', ">\n                            <li class=\"link\">\n                                <a href=\"miscellaneous/enumerations.html\" data-type=\"entity-link\">Enums</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"miscellaneous/functions.html\" data-type=\"entity-link\">Functions</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"miscellaneous/typealiases.html\" data-type=\"entity-link\">Type aliases</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"miscellaneous/variables.html\" data-type=\"entity-link\">Variables</a>\n                            </li>\n                        </ul>\n                    </li>\n                    <li class=\"chapter\">\n                        <a data-type=\"chapter-link\" href=\"coverage.html\"><span class=\"icon ion-ios-stats\"></span>Documentation coverage</a>\n                    </li>\n                    <li class=\"divider\"></li>\n                    <li class=\"copyright\">\n                        Documentation generated using <a href=\"https://compodoc.app/\" target=\"_blank\" rel=\"noopener noreferrer\">\n                            <img data-src=\"images/compodoc-vectorise-inverted.png\" class=\"img-responsive\" data-type=\"compodoc-logo\">\n                        </a>\n                    </li>\n            </ul>\n        </nav>\n        "));
      this.innerHTML = tp.strings;
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(HTMLElement)));