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

