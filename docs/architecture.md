# System Architecture

## High-Level System Architecture

![High Level Systems Architecture](./img/high-level-system-arch.drawio.svg "High Level Systems Architecture")

The system consists of two main parts: the client and the backend. The client, which runs the game engine, handles all the game logic and enables player interaction. The backend manages the game’s lifecycle (e.g., creating and organizing players) and facilitates communication of game state updates between clients.

Each player is associated with a client. Players can create new games and invite others to join via their clients. The player who creates a game becomes the owner, and their client acts as the game host, a role that will be explained in detail later. The backend can support multiple games concurrently, ensuring that state updates made by one player are distributed to all clients participating in the same game.

The backend does not need to understand the specific game being played; its role is to track games, clients, and the current game state. The game state is a JSON-serializable object representing the entire game at any given point in time. When a player takes an action, the client generates a Game State Patch (GSP), which describes how the action modifies the game state. The flow of a GSP is shown below.

## Game State Patch Flow

![Game State Patch Flow](./img/game-state-flow.drawio.svg "Game State Patch Flow")

When a player takes an action via their client, a GSP is created and sent to the backend. The backend updates its version of the game state using the GSP, then forwards it to all other clients in the game. These clients apply the GSP to update their own game states, allowing all players to see the updated state. If a client disconnects (e.g., due to a browser refresh or crash), it can reconnect and download the latest game state from the backend.

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

First, let's describe the various objects in the diagram and then follow on with how they interact to update the game state.

- **Component** - An Angular Component is responsible for binding data to the view and allowing the player to interact with the application. In this implementation components should have minimal (ideally no) state and business logic and should be responsible for the "View" part of the application. 
- **Service** - An Angular Service is responsible for the business logic and responsible for the "Controller" part of the application. Service have business logic, but should have minimal (ideally no) state. Components interact with zero or more services as needed to get the data the need or process an input from a player.
- **Model** - A Model is a class that represents a thing within the game and models the behavior of that thing. Model objects keep a state specific to the thing they represent. More details about the model objects can be found in a later section.
- **Game State Service and Object** - While each Model keeps state specific to its operation, the Game State Service (an Angular Service) and Object are responsible for the game state as a whole. The object stores the entire game state and provides an interface to get or set any part of the state. The service orchestrates setting or getting updates state between the other Service, the Game State object and the Game State Client.
- **Game State Client Service** - An Angular service that allows the client to get or send game state data to the backend.
- **Backend** - The backend which stores and distributes state to all clients.

Both the Model and Game State Object keep track of state, but for different purposes. The Game State Object has a copy of the entire game state and is responsible for providing that data to the rest of the objects in the client and processing updates made by the player (or system). The Model needs a copy of that state relevant to the operations of that model. Let's take the state for a deck of cards as an example. What cards are still in the deck would be the state and that state would be stored in the Game State Object. All other state related to the game is also stored in the Game State Object, such as the cards in each player's hand. The deck of cards model allows a player to draw a card, so it needs to know what cards are in the deck. When the deck of cards model object is instantiated, it gets a copy of the deck of cards state that is stored in the game state object. When a player draws a card the state in the deck of cards model object is updated and then sent to the Game State Object so it can update its copy. This update in state is ultimately sent to the backend via a GSP. When the GSP is received by another client the Game State Object is updated with the latest state. The deck of cards model is then updated to get a copy of the latest state from the Game State Object.  It can generally through of the Game State Object being the authoritative copy of the state and the state stored in each model object a cache of the game state.

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
The section on updating the game state implies that a GSP is created for every update sent to the game state object, but this isn't the case. When a player takes a turn, before them taking any actions, a game state transaction is started. When the transaction starts, the game state object creates a copy of the game state. Any updates to the game state is done to the copy of the game state. Once all updates for the turn have been made, then the player commits the turn. Commiting the turn causes a GSP to be created based on the delta between the original and updated game state. That GSP is then sent to the game state client, which in turn sends it to the backend.

If the player doesn't wish to commit their turn, then the new game state, and any changes to that state, are discarded and another transaction is started based on the original unchanged game state.
