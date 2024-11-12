# Game State Management Documentation

This document provides an overview of how the game state is managed in the Angular-based web board game application. It covers the following topics:

- [How a new game is created and its game state initialized](#game-creation-and-initialization)
- [How the state can be updated via a transaction and the generation of a `GameStatePatch`](#state-updates-via-transactions-and-generation-of-gamestatepatch)
- [How `GameStatePatch` objects are received and applied](#receiving-and-applying-gamestatepatches)
- [Managing Game Elements and Their State](#managing-game-elements-and-their-state)

## Introduction

The game state management system is designed to handle the creation, updating, and synchronization of the game state in a multiplayer environment. It ensures that all players have a consistent view of the game by:

- Initializing the game state when a new game is created.
- Managing state changes through transactions to maintain consistency.
- Synchronizing state across clients via `GameStatePatch` objects sent over WebSocket connections.
- Managing individual game elements and their synchronization with the central game state.

## Game Creation and Initialization

### Overview

When a player creates a new game, the system initializes a new game state and registers all necessary game elements. This process involves several services working together to set up the game for all participating players.

### Key Components

- **`GameService`**:
  - Manages the overall game lifecycle.
  - Handles game creation and initialization.
- **`GameStateInitializationService`**:
  - Builds the initial game state with game-specific elements.
- **`GameManagementClientService`**:
  - Communicates with the backend to create game records and set initial game state.
- **Registry Services**:
  - **`AreaRegistryService`**
  - **`FactionRegistryService`**
  - **`PileRegistryService`**
  - Manage the registration and synchronization of game elements.

### Process Flow

1. **Game Creation Request**: A player initiates the creation of a new game by calling `GameService.createGame()`.

2. **Generating Game ID and Player List**:
   - A unique game ID is generated using `humanId()`.
   - A list of player IDs is compiled, including the host and any invited players.

3. **Creating Game Record on Server**:
   - `GameManagementClientService.createGame()` is called to create a new game record on the server with the game ID, host, and player IDs.

4. **Initializing Game State**:
   - `GameStateInitializationService.build()` is used to create an initial `GameState` object.
   - An empty game state is obtained via `getEmptyInitialGameState()`.
   - Game-specific elements are added using a factory class (e.g., `GameElementStatesFactoryService`).

5. **Setting Initial Game State on Server**:
   - The initial game state is sent to the server using `GameManagementClientService.setInitialGameState()`.

6. **Registering Game Elements Locally**:
   - The `GameService` registers game elements (areas, factions, piles) with their respective registry services:
     - `AreaRegistryService.register()`
     - `FactionRegistryService.register()`
     - `PileRegistryService.register()`
   - Each registry service keeps track of game elements and synchronizes their state with the `GameStateService`.

7. **Initializing Game State Locally**:
   - `GameStateService.initializeGameState()` is called to set up the local game state.
   - The `GameStateStoreService` is initialized with the game state.
   - A WebSocket connection is established via `GameStateClientService.connect()`.

## State Updates via Transactions and Generation of `GameStatePatch`

### Overview

State updates are performed within transactions to ensure atomicity and consistency. Changes are captured as `GameStatePatch` objects, which are then sent to other clients to synchronize their game states.

### Key Components

- **`GameStateService`**:
  - Manages transactions and coordinates state updates.
- **`GameStateStoreService`**:
  - Maintains both the main game state and the transaction state.
  - Provides methods to set individual game elements during a transaction.
- **`GameStatePatchService`**:
  - Creates `GameStatePatch` objects by comparing two game states.
- **`GameStateClientService`**:
  - Handles sending `GameStatePatch` objects to the backend over WebSocket.

### Process Flow

1. **Starting a Transaction**:
   - Before making any state changes, `GameStateService.startTransaction()` is called.
   - The `GameStateStoreService` creates a deep clone of the current game state as the transaction state.
   - The `patchId` is incremented to reflect a new version.

2. **Updating State**:
   - Game elements are updated using setter methods provided by the `GameStateService`:
     - `setArea(newState: AreaState)`
     - `setFaction(newState: FactionState)`
     - `setPile(newState: PileState)`
   - These methods internally call corresponding methods in `GameStateStoreService`, which update the transaction state.

3. **Committing the Transaction**:
   - After all updates, `GameStateService.commitTransaction()` is called.
   - A `GameStatePatch` is generated by `GameStatePatchService.create()`, which computes the difference between the old state and the new transaction state.
   - The `GameStateStoreService` updates the main game state with the transaction state.
   - The `GameStatePatch` is sent to the backend via `GameStateClientService.sendGspToBackend()`.

4. **Rolling Back a Transaction (Optional)**:
   - If changes need to be discarded, `GameStateService.rollbackTransaction()` can be called.
   - The transaction state is cleared, and the game state reverts to its previous state.

### Example Usage

```typescript
// Start a new transaction
gameStateService.startTransaction();

// Update game elements
const updatedAreaState: AreaState = { /* updated properties */ };
gameStateService.setArea(updatedAreaState);

// Commit the transaction and generate a GameStatePatch
gameStateService.commitTransaction();
```

### Notes

- All state changes must occur within a transaction.
- Attempting to update the state without an active transaction will result in an error.
- Transactions ensure that state changes are atomic and can be synchronized across all clients.

## Receiving and Applying `GameStatePatch` Objects

### Overview

To keep all clients synchronized, `GameStatePatch` objects are received from the server whenever other clients make state changes. These patches are applied to the local game state to reflect the latest updates.

### Key Components

- **`GameStateClientService`**:
  - Manages the WebSocket connection for receiving patches.
  - Emits received patches via an observable.
- **`GameStateService`**:
  - Applies received `GameStatePatch` objects to the local game state.
- **`GameStatePatchService`**:
  - Provides methods to apply patches to the game state.
- **`GameStateStoreService`**:
  - Updates the game state and notifies observers when changes occur.
- **Game Element State Services**:
  - **`AreaStateService`**
  - **`FactionStateService`**
  - **`PileStateService`**
  - Synchronize individual game elements with the updated game state.

### Process Flow

1. **Establishing WebSocket Connection**:
   - Upon initializing the game state, `GameStateClientService.connect()` establishes a WebSocket connection to the backend.
   - The connection listens for incoming `GameStatePatch` messages.

2. **Receiving `GameStatePatch`**:
   - When a `GameStatePatch` is received, `GameStateClientService` emits it through the `gsp$` observable.

3. **Applying the Patch**:
   - `GameStateService` subscribes to `GameStateClientService.gsp$`.
   - Upon receiving a patch, `GameStateService.applyGsp()` is called.
   - The `GameStatePatchService.apply()` method applies the patch to the current game state, resulting in a new state.
   - `GameStateStoreService.setGameState()` updates the main game state and notifies all observers.

4. **Updating Game Elements**:
   - Registered game elements are updated through their respective state services (e.g., `AreaStateService`).
   - These services observe changes in the game state and update the corresponding game elements accordingly.

### Example Flow

```typescript
// GameStateClientService receives a GameStatePatch from the backend
gameStateClientService.gsp$.subscribe((gsp) => {
  // GameStateService applies the patch
  gameStateService.applyGsp(gsp);
});

// Inside GameStateService.applyGsp()
applyGsp(gsp: GameStatePatch): void {
  // Apply the patch to the current game state
  const updatedGameState = gameStatePatchService.apply(currentGameState, gsp);
  // Update the game state in the store
  gameStateStoreService.setGameState(updatedGameState);
}
```

### Notes

- The application ensures that all game state updates are consistent across clients.
- Observables provided by `GameStateStoreService` emit new values whenever the game state changes.
- Individual game elements automatically update their state when the game state changes.


## Managing Game Elements and Their State

### Overview

The management of game elements and their state is crucial for maintaining a consistent and responsive gaming experience. The application uses a combination of `GameElementRegistryService` and `GameElementStateService` classes to:

- Register game elements and keep track of them.
- Provide access to registered game elements for other services and components.
- Synchronize state updates between individual game elements and the central game state.
- Update game elements when the central game state changes due to received `GameStatePatch` objects.

### Key Components

- **`GameElementRegistryService`**:
  - Abstract base class for registering and retrieving game elements.
  - Manages a collection of game elements and provides observables for changes.
- **`GameElementStateService`**:
  - Abstract base class for synchronizing the state of game elements with the central `GameStateService`.
  - Handles updates from both the game elements and the central game state.

### Registration of Game Elements

#### Process Flow

1. **Creating Game Elements**:
   - Game elements (e.g., `Area`, `Faction`, `Pile`) are instantiated, each wrapping a specific `GameElementState`.

2. **Registering with Registry Service**:
   - Game elements are registered using their respective registry services:
     - `AreaRegistryService.register(area)`
     - `FactionRegistryService.register(faction)`
     - `PileRegistryService.register(pile)`
   - The registry service adds the game element to its internal collection and notifies observers.

3. **Synchronizing with State Service**:
   - The registry service calls `GameElementStateService.register()` to synchronize the game element's state.
   - The state service registers the game element's state with the central `GameStateService`.

#### Example

```typescript
// Create a new Area instance
const newArea = new Area({ id: 'area1', /* other properties */ });

// Register the area with the AreaRegistryService
areaRegistryService.register(newArea);
```

#### Key Points

- Registration ensures that game elements are known to the system and can be managed collectively.
- Registry services keep track of all registered game elements of a specific type.

### Retrieving Game Elements

#### Process Flow

1. **Accessing Registry Service**:
   - Other services or components inject the appropriate registry service (e.g., `AreaRegistryService`).

2. **Retrieving by ID**:
   - Use the `get(id: string)` method to retrieve a specific game element.
   - Example: `const area = areaRegistryService.get('area1');`

3. **Observing Registered IDs**:
   - Subscribe to `registeredIds$` to get updates when new elements are registered.

#### Example

```typescript
// Inject AreaRegistryService in a component
constructor(private areaRegistryService: AreaRegistryService) {}

// Retrieve an area by ID
const area = this.areaRegistryService.get('area1');

// Subscribe to changes in registered IDs
this.areaRegistryService.registeredIds$.subscribe((ids) => {
  console.log('Registered Area IDs:', ids);
});
```

#### Key Points

- The registry services provide a centralized way to access game elements.
- Retrieving game elements allows components to interact with their properties and state.

### Synchronizing State Updates Between Game Elements and Central GameState

#### Process Flow

1. **Game Element State Changes**:
   - Game elements manage their own state and expose an observable `state$`.

2. **Notifying State Service**:
   - When a game element's state changes, it emits a new value on its `state$` observable.
   - The `GameElementStateService` subscribes to these observables.

3. **Updating Central GameState**:
   - Upon receiving a state change, the `GameElementStateService` calls `setEntityState()` to update the state in the `GameStateService`.
   - The `GameStateService` then updates the transaction state via `GameStateStoreService`.

4. **Transaction Management**:
   - The updates occur within a transaction started by `GameStateService.startTransaction()`.
   - After all updates, `GameStateService.commitTransaction()` is called to finalize the changes.

#### Example

```typescript
// Game element updates its state internally
area.updateProperties({ /* new properties */ });

// GameElementStateService listens to area.state$ and updates central GameState
area.state$.pipe(skip(1)).subscribe((state) => {
  areaStateService.setEntityState(state);
});
```

#### Key Points

- Game elements are responsible for managing their own state changes.
- State services bridge the gap between individual game elements and the central game state.
- Synchronization ensures that all state changes are reflected in the central game state.

### Flow of State Updates from Central GameState to Game Elements When a GSP is Received

#### Process Flow

1. **Receiving `GameStatePatch`**:
   - `GameStateClientService` receives a `GameStatePatch` from the backend.
   - The patch is applied to the central game state via `GameStateService.applyGsp()`.

2. **Updating Central GameState**:
   - `GameStatePatchService.apply()` updates the game state's `gameElements` property.
   - `GameStateStoreService.setGameState()` updates the main game state and emits new values.

3. **State Services Receive Updates**:
   - `GameElementStateService` subclasses (e.g., `AreaStateService`) subscribe to the observables provided by `GameStateStoreService`.
   - Upon receiving new `GameElementState` arrays, they iterate over them.

4. **Updating Registered Game Elements**:
   - For each `GameElementState` received, the state service checks if the element is registered.
   - If registered, it calls `element.setState(newState)` to update the game element's state.

5. **Game Elements Reflect New State**:
   - Game elements update their internal state and notify any observers or components relying on them.

#### Example

```typescript
// In GameElementStateService.initialize()
this.elementState$.subscribe((entities) => {
  entities.forEach((elementState) => {
    if (this.registeredIds.has(elementState.id)) {
      const element: TgameElement = this.getEntity(elementState.id);
      element.setState(elementState);
    }
  });
});
```

#### Key Points

- Updates to the central game state are propagated to individual game elements.
- Game elements remain in sync with the latest game state, including changes made by other players.
- Observers of game elements receive updates and can react accordingly.

### Detailed Explanation of Classes

#### `GameElementRegistryService`

- **Purpose**: Manages the registration and retrieval of game elements.
- **Type Parameters**:
  - `TgameElementState`: Specific `GameElementState` type (e.g., `AreaState`).
  - `TgameElement`: Specific `GameElement` type (e.g., `Area`).
  - `TgameElementStateSvc`: Corresponding `GameElementStateService` type.
- **Key Methods**:
  - `register(elements: TgameElement | TgameElement[])`: Registers game elements and notifies observers.
  - `get(id: string): TgameElement`: Retrieves a registered game element by ID.
- **Observables**:
  - `registeredIds$`: Emits the set of registered IDs whenever it changes.

#### `GameElementStateService`

- **Purpose**: Synchronizes game elements with the central game state.
- **Type Parameters**:
  - `TgameElementState`: Specific `GameElementState` type.
  - `TgameElement`: Specific `GameElement` type.
- **Key Methods**:
  - `register(entities: TgameElement[])`: Registers game elements and subscribes to their state changes.
  - `initialize()`: Subscribes to changes in the central game state and updates game elements.
  - `setEntityState(state: GameElementState)`: Updates the state in the `GameStateService`.
- **Abstract Methods**:
  - `elementState$`: Observable of `GameElementState` arrays from `GameStateService`.
  - `registerEntityState(element: TgameElement)`: Registers the element's state with `GameStateService`.

### Example: Area Management

#### AreaRegistryService

- **Extends**: `GameElementRegistryService<AreaState, Area, AreaStateService>`
- **Purpose**: Manages registration and retrieval of `Area` game elements.
- **Usage**:

```typescript
// Register a new area
areaRegistryService.register(newArea);

// Retrieve an area
const area = areaRegistryService.get('area1');
```

#### AreaStateService

- **Extends**: `GameElementStateService<AreaState, Area>`
- **Purpose**: Synchronizes `Area` game elements with the central game state.
- **Implements**:
  - `elementState$`: Returns `gameStateService.area$`.
  - `registerEntityState(area: Area)`: Calls `gameStateService.registerArea(area.state)`.
  - `setEntityState(state: AreaState)`: Calls `gameStateService.setArea(state)`.

### Sequence Diagram

Below is a simplified sequence diagram illustrating the flow of state updates from the central game state to game elements when a `GameStatePatch` is received:

```
GameStateClientService --> GameStateService: Receives GameStatePatch
GameStateService --> GameStateStoreService: Applies patch, updates game state
GameStateStoreService --> AreaStateService: Emits new AreaState[]
AreaStateService --> Area: Calls setState(newState)
Area --> Components: Notifies observers of state change
```
