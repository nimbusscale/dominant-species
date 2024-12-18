'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">frontend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/ActionPawnComponent.html" data-type="entity-link" >ActionPawnComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ActionPawnSpaceComponent.html" data-type="entity-link" >ActionPawnSpaceComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AdaptionActionDisplayCardComponent.html" data-type="entity-link" >AdaptionActionDisplayCardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AnimalCardComponent.html" data-type="entity-link" >AnimalCardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CreateGamePageComponent.html" data-type="entity-link" >CreateGamePageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DominantSpeciesGameComponent.html" data-type="entity-link" >DominantSpeciesGameComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DrawPoolGameComponent.html" data-type="entity-link" >DrawPoolGameComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ElementComponent.html" data-type="entity-link" >ElementComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ElementSpaceComponent.html" data-type="entity-link" >ElementSpaceComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EyeballComponent.html" data-type="entity-link" >EyeballComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LobbyPageComponent.html" data-type="entity-link" >LobbyPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoginPageComponent.html" data-type="entity-link" >LoginPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LogoutPageComponent.html" data-type="entity-link" >LogoutPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SignUpConfirmPageComponent.html" data-type="entity-link" >SignUpConfirmPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SignUpPageComponent.html" data-type="entity-link" >SignUpPageComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Animal.html" data-type="entity-link" >Animal</a>
                            </li>
                            <li class="link">
                                <a href="classes/AnimalElements.html" data-type="entity-link" >AnimalElements</a>
                            </li>
                            <li class="link">
                                <a href="classes/Area.html" data-type="entity-link" >Area</a>
                            </li>
                            <li class="link">
                                <a href="classes/Faction.html" data-type="entity-link" >Faction</a>
                            </li>
                            <li class="link">
                                <a href="classes/GameElement.html" data-type="entity-link" >GameElement</a>
                            </li>
                            <li class="link">
                                <a href="classes/GameElementStatesFactoryService.html" data-type="entity-link" >GameElementStatesFactoryService</a>
                            </li>
                            <li class="link">
                                <a href="classes/Pile.html" data-type="entity-link" >Pile</a>
                            </li>
                            <li class="link">
                                <a href="classes/PileAdapter.html" data-type="entity-link" >PileAdapter</a>
                            </li>
                            <li class="link">
                                <a href="classes/Space.html" data-type="entity-link" >Space</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ActionDisplayManagerService.html" data-type="entity-link" >ActionDisplayManagerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AdaptionActionDisplayService.html" data-type="entity-link" >AdaptionActionDisplayService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AnimalProviderService.html" data-type="entity-link" >AnimalProviderService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AreaRegistryService.html" data-type="entity-link" >AreaRegistryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AreaStateService.html" data-type="entity-link" >AreaStateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CognitoClientService.html" data-type="entity-link" >CognitoClientService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ElementDrawPoolService.html" data-type="entity-link" >ElementDrawPoolService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FactionRegistryService.html" data-type="entity-link" >FactionRegistryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FactionStateService.html" data-type="entity-link" >FactionStateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GameElementRegistryService.html" data-type="entity-link" >GameElementRegistryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GameElementStateService.html" data-type="entity-link" >GameElementStateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GameManagementClientService.html" data-type="entity-link" >GameManagementClientService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GameReadyService.html" data-type="entity-link" >GameReadyService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GameService.html" data-type="entity-link" >GameService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GameStateClientService.html" data-type="entity-link" >GameStateClientService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GameStateInitializationService.html" data-type="entity-link" >GameStateInitializationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GameStatePatchService.html" data-type="entity-link" >GameStatePatchService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GameStateService.html" data-type="entity-link" >GameStateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GameStateStoreService.html" data-type="entity-link" >GameStateStoreService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalStorageService.html" data-type="entity-link" >LocalStorageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NavigateService.html" data-type="entity-link" >NavigateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PileRegistryService.html" data-type="entity-link" >PileRegistryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PileStateService.html" data-type="entity-link" >PileStateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PlayerService.html" data-type="entity-link" >PlayerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SignUpService.html" data-type="entity-link" >SignUpService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Action.html" data-type="entity-link" >Action</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ActionDisplayService.html" data-type="entity-link" >ActionDisplayService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ActionPawnPiece.html" data-type="entity-link" >ActionPawnPiece</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AnimalConfig.html" data-type="entity-link" >AnimalConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ElementConfig.html" data-type="entity-link" >ElementConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ElementPiece.html" data-type="entity-link" >ElementPiece</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FactionAssignment.html" data-type="entity-link" >FactionAssignment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InitialGameElementStatesFactory.html" data-type="entity-link" >InitialGameElementStatesFactory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoginFormData.html" data-type="entity-link" >LoginFormData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PileConfig.html" data-type="entity-link" >PileConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PlayerAuthData.html" data-type="entity-link" >PlayerAuthData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SignUpConfirmFormData.html" data-type="entity-link" >SignUpConfirmFormData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SignUpFormData.html" data-type="entity-link" >SignUpFormData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SpeciesPiece.html" data-type="entity-link" >SpeciesPiece</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise-inverted.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});