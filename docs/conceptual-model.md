# Conceptual Model
This page describes the things that are part of a game and the flow of how a game is played. This is done in a implementation agnostic way and provides a conceptual model of how a game should work.

The first section of this page described the conceptual mode for a generic game and the second section describes how the conceptual model applies to Dominant Species (DS).

## Generic Game
This section describes the conceptual model generically. Examples how the model related to DS and other games are provided to help illustrate the concepts.

### Game Objects
The "things" in a game.

#### Player and Faction
A player is a person that makes decisions and takes actions in the game. Players control a faction and actions taken by a player are done under the guise of a faction. Generally, there is a one-to-one relationship between a player and a faction, and that is the case in DS where each player controls a faction that is an animal (Mammal, Bird, Insect, Etc). Factions interact with the game and players control factions.

In many games, the faction is only identified by a player's color, so a player may control the blue or red faction. Most games a player controls the same faction for the entire game, but that is not the case for all games. For example, in Imperial, the control of each player can change over the course of the game and a single player can control multiple factions.

#### Area and Space
An area represents a board or part of a board on a table, and each area contains one or more spaces. A space is a place where an action can interact with an area. These interactions are typically putting or removing a piece (see below for more details on pieces). An area can be shared, such as the game board, or owned by a faction, such as a player's tableau.

Typically, all spaces in an area share the same behavior. As an example, DS would have the following area and spaces:

- Earth which is what DS calls the hex gird area of the board. The Earth area contains spaces where the hex tiles are places.
- Terrain tile area which contains three spaces each with a deck of terrain tiles and one space containing the tundra tiles. These are the tiles that are used by a faction when performing Wanderlust. The terrain tiles are removed from the deck in one of the terrain tile area's spaces and placed in one of the Earth area's spaces.
- Action display area contains the spaces that a faction's action pawn (a type of piece) is placed on and then removed when the faction takes the corresponding action.
- Dominance card deck area and dominance card display areas. Where the dominance card deck area has a single space containing the dominance card deck and the dominance card display area containing five spaces, each containing a face up dominance card. The dominance card deck area and the dominance card display area are separated into two different areas because their spaces work differently. One holding a deck and the other holding face up cards.
- Animal faction areas where each animal faction in the game has an area owned by and related to that animal faction. This area has spaces used to store the elements which can be added or removed from an animal.

#### Piece, Pile and Deck
A piece is an object typically placed or removed from a space as the result of an action. Pieces can be owned by a faction, such as an action pawn, or can be unowned like a terrain tile.

In most cases, pieces are stored in either a:

- Deck which is an ordered sequence of pieces. When a piece is removed from a deck, typically the piece at the top of (i.e. first in the sequence) is removed. Decks are always finite and new pieces can be added to the top or bottom of a deck. Decks can also be shuffled to randomly rearrange the order of the pieces in the deck. Examples of decks in DS would be the terrain tile deck or dominance card deck.
- Pile which is an unordered pool of pieces. When a piece is removed from a pile, a random piece is removed. Piles can either be finite or infinite. Examples of piles in DS would be the element draw pool which represents the draw bag in the physical game, and each animal has one pile of species (i.e. the cubes) and one pile of action pawns.

Note that there does not need to be a one-to-one mapping of pieces in a physical game. A DS example would be how dominance of a hext is marked. In the physical game, this is done using a cone, but in the digital implementation this is just a bit of metadata associated with a space.

### Play Flow
The process of how a game is played.

#### Game
When considering the concept of "a game" there are two different specific concepts that one could be referring to.

- A game title is the "kind" of game being played, such as Dominant Species or Terraforming Mars. A game title defines how the game works, the rules, winning conditions, etc.
- A game instance is a specific "play through" of a game title. One or more players participate in a game instance, and the game instance has a definitive start and end. Multiple games instances of the same game title can exist at the same time.

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
An action is something a that can be done to change the state of the game. In DS this almost always involves adding or removing a piece from a space. Actions are comprised on one or more action steps. Many actions in DS would be a single step; a turn in the Adaption phase would include the action of taking an available element and placing it on an animal's space. But some actions have multiple steps, such as a turn in the Competition phase where the player would have potentially three steps eliminating an opposing species on a tile of each terrain type associated with the action space their pawn occupies.





