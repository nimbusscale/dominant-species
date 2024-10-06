This implementation of Dominant Species (DS) is done with two goals in mind:

1. Improve my frontend coding skills and enable me to be more comfortable with the idea of being a "Full Stack Developer".
2. Have an implementation of DS that my game group can play online. This implementation will cater to how my game group plays, which is synchronous game play using discord as an audio chat.

To that end some design decisions may only make sense keeping these goals in mind. For example most gaming implementations would assume each player is an untrusted actor and need to include methods to prevent cheating. Since this implementation is intended to be played with people I know and trust then each player is treated as a trusted actor and controls against cheating aren't considered necessary.

Another example is that I am utilizing Angular as the framework, which may not make the most sense for a personal project. But given I generally work in the enterprise space where Angular is more common, it makes sense to increase my experience with that framework.

# Design

- [Conceptual-Model](./conceptual-model) - Describes an implementation agnostic model of boardgames and how that model is used in DS.
- [Architecture](./architecture) - Describes the high level design and outlines major design decisions for the project.
- [Milestone](./milestone) - Describes the development milestones and which capabilities are to be added in each milestone.

# Code
- [Code Docs](./code/index.html)
- [Service and Component UML](./service-component-uml.svg)
