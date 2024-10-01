# System Architecture

## High-Level System Architecture

![High Level Systems Architecture](./img/high-level-system-arch.drawio.svg "High Level Systems Architecture")

The system has two main components: the client and the backend.

- **Client**: This is where the game engine runs. It handles game logic and allows players to interact with the game.
- **Backend**: This manages the game lifecycle (e.g., creating and managing players) and handles communication between clients, ensuring game state updates are synchronized.

Each player is associated with a client. Players can create new games and invite others through their clients. The player who creates a game becomes the game host, a role explained later. The backend supports multiple games running at the same time, ensuring that when one player makes a state change, all other clients in the same game receive the update.

The backend doesn't need to know the specifics of the game being played. It only tracks the games, clients, and game states. The game state is a JSON-serializable object representing the game's current status. When a player takes an action, the client creates a **Game State Patch (GSP)** that describes how the action changes the game.

## Game State Patch Flow

![Game State Patch Flow](./img/game-state-flow.drawio.svg "Game State Patch Flow")

When a player takes an action on their client, a GSP is created and sent to the backend. The backend updates its version of the game state using the GSP and then forwards it to all other clients in the game. These clients apply the GSP to update their game states, ensuring all players see the latest state.

If a client disconnects (e.g., due to a browser refresh or crash), it can reconnect and retrieve the current game state from the backend.

## Game State Immutability and Updates

![Game State Update](./img/game-state-update.drawio.svg "Game State Update")

Game states are immutable—once created, they cannot be altered. When a player takes an action, a GSP is generated and combined with the current game state to produce a new game state.

Immutability simplifies rollback actions. If a player performs an action, the GSP is applied to their local game state. If the player confirms the action, the GSP is sent to the backend, which updates its own state and forwards the GSP to other clients. If the player chooses not to confirm, the game can be rolled back by discarding the new state and reverting to the previous one.

## Host Role

A client of the player who owns the game has the host role. The host is responsible for actions that are not preformed by any one player. In the context of DS these would be things like actions taken in the Reset phase, such as performing Extinction and removing all endangered species.

# Software Architecture

## Game State
The Game State is a distributed eventually consistent data structure synchronized between all the clients in a game and the backend. There are varios 

### Game State Overview
The following diagram shows a more detailed view of how the game state is updated/read, and its relationship to other objects in the system.

![Game State Interactions](./img/game-state-detailed-flow.drawio.svg "Game State Interactions")

Before exploring the interactions, let's define the key objects involved:

- **Component**: 
  An Angular Component is responsible for binding data to the view and enabling the player to interact with the application. In this implementation, Components should hold minimal (ideally no) state or business logic. Their primary role is to handle the "View" aspect of the application. Components interact with one or more Services as needed to retrieve data or process player input.

- **Service**: 
  An Angular Service manages the business logic, representing the "Controller" part of the application. Services contain business logic but should maintain minimal (ideally no) state. 

- **Model**: 
  A Model represents a specific entity within the game and models the behavior of that entity. Models maintain state relevant to the entity they represent.

- **Game State Service and Object**: 
  While each Model maintains its own state, the **Game State Service** (an Angular Service) and **Game State Object** manage the entire game state. The Game State Object stores the complete state and provides an interface to access or modify any part of it. The Game State Service orchestrates interactions between other Services, the Game State Object, and the Game State Client.

- **Game State Client Service**: 
  An Angular Service that enables the client to send or retrieve game state data from the backend.

- **Backend**: 
  The server that stores and distributes the game state to all connected clients.

Both the Model and Game State Object track state but serve different purposes. The Game State Object holds a complete copy of the game state and provides it to other client-side objects, processing player or system-triggered updates. On the other hand, each Model retains a subset of the game state relevant to its function.

### Example: Managing a Deck of Cards 
Consider the state of a deck of cards in the game. The Game State Object stores the current state of the deck—specifically, which cards remain in the deck. 

The Deck of Cards Model needs to know the current state of the deck to allow players to draw cards. When the model is instantiated, it retrieves the state of the deck from the Game State Object. As a player draws a card, the Deck of Cards Model updates its internal state and sends this updated state back to the Game State Object. 

The Game State Object then updates its full copy of the state and sends the change to the backend via a Game State Patch (GSP). When another client receives the GSP, the Game State Object on that client is updated. The Deck of Cards Model on that client subsequently fetches the latest state from the Game State Object.

In essence, the Game State Object serves as the authoritative source of truth, while each Model holds a cached subset of the game state specific to its operations.

### Updating the Game State
The following diagram shows the flow of a state change by a play through the client to the backend. Each step is labeled with a corresponding row in the table beneath the diagram.

![Game State Update Interactions](./img/game-state-detailed-flow-update.drawio.svg "Game State Update Interactions")

| Label | Description                                                                                                  |
|-------|--------------------------------------------------------------------------------------------------------------|
| 1     | A player interacts with a component by clicking a button to draw a card                                      |
| 2     | The component calls a draw method of the service                                                             |
| 3     | The service calls a draw method of the model object                                                          |
| 4     | The model object returns a card object and updates it's state to reflect what cards remain in the deck       |
| 5     | The card object is returned to the component                                                                 |
| 6     | The component displays the card drawn from the deck to the player                                            |
| 7     | The service retrieves the updated state from the model object and sends the update to the game state service |
| 8     | The game state service sends the update to the game state object                                             |
| 9     | The game state object generate a GSP based on the changes made to the state                                  |
| 10    | The game state service sends the GSP to the game state client service                                        |
| 11    | The game state client service sends the GSP to the backend                                                   |

### Receiving Game State Updates
And this diagram shows the flow when a GSP is received from the backend

![Game State Received Interactions](./img/game-state-detailed-flow-receive.drawio.svg "Game State Received Interactions")

| Label | Description                                                                                         |
|-------|-----------------------------------------------------------------------------------------------------|
| 1     | A GSP is received by the game state client service                                                  |
| 2     | The GSP is sent to the game state service                                                           |
| 3     | The GSP is sent to the game state object                                                            |
| 4     | The game state object uses the GSP to update it's copy of the game state                            |
| 5     | The update state of the deck of cards is sent to the game state service                             |
| 6     | The update state is sent to the deck of cards service                                               |
| 7     | The updated state is sent to the deck of cards model object                                         |
| 8     | The component shows a representation of the updated state (i.e. which card was drawn) to the player |

### Game State Transactions and GSP Creation
The previous section may suggest that a Game State Patch (GSP) is created for every update sent to the Game State Object. However, this is not the case.

When a player starts their turn, a game state transaction is initiated before any actions are taken. At this point, the Game State Object creates a copy of the current game state. Any changes made during the player's turn are applied to this copy.

Once all updates for the turn are complete, the player commits the turn. Committing generates a GSP, which reflects the difference (delta) between the original and the updated game state. This GSP is then sent to the Game State Client, which forwards it to the backend.

If the player decides not to commit their turn, the updated game state and all associated changes are discarded. A new transaction is then initiated, using the original, unchanged game state.
