# Conceptual Model

This page outlines the key parts of a game and how gameplay flows. It presents a high-level conceptual model of game mechanics, independent of any specific implementation.

The first section describes a generic conceptual model, while the second explains how this model applies to Dominant Species (DS).

## Generic Game Model

This section details the core concepts of a game model, using examples from Dominant Species and other games for clarity.

### Game Objects

Game objects represent the various "things" in a game.

#### Player and Faction

A player makes decisions and takes actions in a game. Each player controls a faction, and actions are carried out through this faction. Typically, a player controls one faction throughout the game (e.g., in Dominant Species, each player controls an animal faction like Mammal, Bird, or Insect).

Some games, such as Imperial, allow players to control multiple factions or shift control over the course of the game. In many other games, players are distinguished by colors, such as the red or blue factions.

#### Area and Space

An area represents a section of the game board or a player's tableau, while spaces are smaller subdivisions within areas where actions occur (e.g., placing or removing pieces). Typically, all spaces in an area share the same behavior.

In Dominant Species, several areas and spaces exist:

- **Earth**: The hexagonal grid area where terrain tiles are placed.
- **Terrain Tile Area**: Contains spaces for terrain tiles used in the Wanderlust phase.
- **Action Display**: Where action pawns are placed by factions, marking available actions.
- **Dominance Card Deck and Dominance Card Display Areas**: Where the dominance card deck area has a single space containing the dominance card deck and the dominance card display area containing five spaces, each containing a face up dominance card. The dominance card deck area and the dominance card display area are separated into two different areas because their spaces work differently. One holding a deck and the other holding face up cards.
- **Faction Areas**: Each animal faction has its own area for storing elements and other game-specific pieces.

#### Piece, Pile and Deck

Pieces are objects used during gameplay, often placed or removed from spaces as part of actions. Pieces can be faction-owned (e.g., action pawns) or unowned (e.g., terrain tiles).

Pieces are typically organized into:

- **Decks**: Ordered sequences of pieces (e.g., terrain tiles in DS).
- **Piles**: Unordered pools of pieces, where removal may be random (e.g., species cubes in DS).

In some games, there may not be a direct mapping between physical components and digital ones (e.g., dominance in DS is marked by a cone in the physical game but represented by metadata in the digital version).

### Play Flow

The process of how a game is played.

#### Game

When considering the concept of "a game" there are two different specific concepts that one could be referring to.

- **Game Title**: The "kind" of game being played, such as Dominant Species or Terraforming Mars. A game title defines how the game works, the rules, winning conditions, etc.
- **Game Instance**: A specific "play through" of a game title. One or more players participate in a game instance, and the game instance has a definitive start and end. Multiple games instances of the same game title can exist at the same time.

A reference to "game" will be used to mean game instance. Any reference to a game title will specifically use that term.

#### Phase

Each game has one or more phases which determine how the rounds operate and what kind of actions are available to a faction. There is not a hard and fast rule of what a phase is in withing a game, but generally it encapsulates a part of the game where all the factions are doing the same thing. This does not necessarily map one-to-one with the phases specified in a game's rule book.

In the rulebook DS identifies three phases: Planning, Execution and Reset. The planning phase would remain mostly the same as each faction is doing the same thing, putting their action pawns onto one of the action spaces. The execution phase would be very different. Each kind of action in the action display works very differently from the other actions. In this case, each kind of action would be its own phase, and we would see phases such as execution-adaption, execution-glaciation and execution-domination.

#### Round

A round is part of a phase and contains a sequence of turns. The most basic round would include a turn for each faction in whatever turn order is used within the game. Once a round is complete, a new round is created or the phase ends. Some games have rounds of play that continue until all players have passed. In this case, when the end of the round is reached a new round is created including only those that have not passed and can still perform an action.

While a round is an ordered sequence of turns, the remaining turns in the round can be altered. For example, if oen factions action causes another faction to lose a turn.

Rounds can be nested where one position is the round is occupied by another round which it itself is an ordered sequence of turns. These nested rounds can be created due to actions taken by one faction. An example of this in DS would during the Wanderlust phase. In this case, there is a round comprising the factions who have action pawns on the Wanderlust spaces. When a faction chooses where to place the new terrain tile as part of the Wanderlust action, then a new round is created and inserted to be next in the sequence. This new round would include a turn for any faction that had adjacent species to the newly placed terrain tile allowing them to move to the new tile. Once the round added to accommodate the moving is completed, then the next turn in the Wanderlust action track would be taken.

#### Turn

A turn is owned/controlled by a faction and allows that faction to take one or more actions.

The system may also take turns and perform actions. An example would be during the Wasteland phase, a system turn would be added to the end of the round. When the system's turn is reached, it would perform the action of removing all appropriate elements from tundra tiles.

#### Action and Action Step

An action is something a that can be done to change the state of the game. In DS this almost always involves adding or removing a piece from a space. Actions are comprised on one or more action steps. Many actions in DS would be a single step; a turn in the Adaption phase would include the action of taking an available element and placing it on an animal's space. Some actions have multiple steps, such as a turn in the Competition phase. A turn in the Competition phase, the faction would have potentially three steps each eliminating an opposing species on a tile of each terrain type associated with the action space their pawn occupies.

Addition steps can be added to an action in progress. A DS example of this would be speciation where the first action step would be choosing the element to speciate on. A new step would be created for each tile around that element allowing the player to choose how many new species they wish to place on each tile.

## Dominant Species Model

This section will walk through and describe how each phase of DS works.

### Planning

The planning phase is straight forward. A round is created including turns (in initiative order) for each animal that has available action pawns. Each turn an animal can take an action to place an action pawn on an available space in the action display area.

### Execution Initiative

This round consists of a single turn with two steps:

1. Update the Initiative order
2. Move their action pawn to another available space in the action display area.

### Execution Adaption

Each turn takes an action with two steps:

1. Choosing an element and putting on their animal.
2. Checking every tile that which the animal has species to determine dominance

### Execution Regression

Each animal has a regression protection counter. Each action pawn placed on a regression space would increase the animal regression protection counter by one.

The round in the regression phase includes system turns, along with any animals that have an action pawn in the regression spaces. The turns in the round look like this:

1. A system turn that has two action steps. The first action step sets the regression protection of each animal by the number of regression action pawns. The second action step sets the regression threat of each animal with the type of elements in the regression box.
2. Each animal that has an action pawn in the regression space has a turn where they can take one action with a single step choosing to remove one type of element from their regression threat.
3. A system turn that removes any non-default elements from each animal that has remaining elements types in the regression threat.

### Execution Abundance

Each turn takes an action with two steps:

1. Place the element on a vacant corner of any terrain tile.
2. Determine dominance for any tiles that touch the new element.

### Execution Wasteland

The round consists of a turn of an animal with their action pawn in the space, plus a system turn at the end of the round.

The animal's turn has a single action with one step to remove an element from the wasteland box.

The system turn at the end of the round would create and add another turn for each element touching tundra tiles that match a kind of element in the wasteland box. These newly created system turns would do the following:

1. remove the specified element touching tundra tiles that match a kind of element in the wasteland box.
2. Determine dominance for any tiles that lost an element.

### Execution Depletion

A single turn with two actions:

1. Remove an element from the board matching an element in the depletion box.
2. Determine dominance for any tiles that lost an element.

### Execution Glaciation

A single turn with multiple actions:

1. Place a tundra tile and score
2. Return all but one species to each animal
3. Remove all elements from earth that are surrounded by exactly three tundra tiles.
4. Determine dominance for any tiles that lost an element.

### Execution Speciation

Each turn would have a valuable number of steps with the first step choosing an element to speciate on. A new step would be created for each tile around that element allowing the player to choose how many new species they wish to place on each tile. The last action step would be checking for dominance.

### Execution Wanderlust

When a faction chooses where to place the new terrain tile as part of the Wanderlust action, then a new round is created and inserted to be next in the sequence. This new round would include a turn for any faction that had adjacent species to the newly placed terrain tile allowing them to move to the new tile. Once the round added to accommodate the moving is completed, then the next turn in the Wanderlust action track would be taken.

### Execution Migration

### Execution Competition

### Execution Domination

## Reset

Three system turns
