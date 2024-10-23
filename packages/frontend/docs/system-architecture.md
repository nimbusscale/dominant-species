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
