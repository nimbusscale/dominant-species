# The Adaption Game

The Adaption (said in an Ari voice) Game is intended to show many aspects of the code working. At the completion of this milestone each player will be able to perform the Adaption action in Food Chain order. Adaption was the selected as the first action as it has a relationship between the animals, elements and action spaces. There is not interaction with the Earth (i.e. hex grid) and the action of choosing an element and placing it on your animal is pretty straight forward.

The code should support these capabilities at the completion of this milestone:

- Create and invite other playerIds to a game
- Initialize the game by randomly assigning an animal to each player. Each animal is initialized with the number of action pawns and species cubes for the number of playerIds.
- Initialize the Element Draw Pool (i.e. the "bag" of element tokens)
- Display an Adaption action area with four spaces for elements and three action pawn spaces
- Initialize the Adaption action with four elements from the Element Draw Pool
- Animals take turns placing an action pawn into one of the Adaption action spaces in reverse food chain order (i.e., Intuitive order)
- When an animal places a pawn and ends their turn, a GSP is sent to the backend and to all other clients
- Each client updates their Game State from received GSP and display the result of actions taken by other animals.
- When all spaces are full, the round ends and playerIds take an element from one of the boxes for each. GSPs are sent and processed based on element choices.
- Once all pawns have gone, then the round ends and four new elements are put into the Adaption spaces
- The Game ends when all animals have six elements
- Players can leave and rejoin the game
