I have made a neural network in `neuralNetwork.ts`.
I have been testing it in `test.ts`  with an xor solver, this worked pretty well.


Now i am designing a system that makes it easier to define AI models with specific purposes.
The idea is as follows (a start of this can be seen in `index.ts`):
An abstract class that will require a specific definition of in/outputs (io from here, when i say io, i mean either an input or output, not boths) which will remain the same after the extended class has defined them.
The definition of an io is a class that will accept so called variants for that single input.
inputs and outputs will always contain a value between 0 and 1.


Variants are simply just words that represent a range of a number between 0 and 1 for that one io.
So if for example a variant of one io holds the following string array ['off', 'on'] , `off` will represent the io value between 0 and 0.49999 and `on` represents 0.5 to 1.
There can be any number of variants.

The reason i made variants is to be able to stricly define what a value of an io means.
this works both ways for inputs and outputs.

For inputs:
Every input can be supplied with a variant instead of a number, this makes it easier for me to manually supply inputs or if it is done automatically, it will be easier to make sense of it when observed.

For outputs:
with varients applied, outputs will spit out a number, and then the class can convert that into a variant which will have a meaning to whatever it will be trying to do. So for example, we can define one output to either be true of false, (< 0.5 = false, >= 0.5 = true) which will indicate whether the ai wants to execute an action or not, and then a second output could be defined to have 10 uniqui varients which can indicate an integer to apply to that action.
This way we can make really efficient use of outputs while keeping a consistent meaning to all of it so that the AI may learn from its actions accurately.


To take this even further, the abstract class that holds all of it will have 2 abstract fields `inputs` and `outputs`, the type of these fields should be: `{[key: string]: VariantsClass}`.
This type will allow naming each io as a whole, to demonstrait this, lets make a very simple model with the following rules:
- The ai is on a 3x3 grid
- The ai may take one action at the time
- The ai may only move in straight lines
- The ai must get to the target
- When the ai moves, they move forward of their rotation
- When the rotates, they always rotate 90 deg clockwise

```ts
class GrigAI extends AbstractAI {
    private coordsX = {
        left: 'left',
        center: 'center',
        right: 'right'
    } as const
    private coordsY = {
        top: 'top',
        middle: 'middle',
        bottom: 'bottom',
    } as const
    private rotation = {
        north: 'north',
        east: 'east',
        south: 'south',
        west: 'west',
    } as const
    private actions = {
        rotate: 'rotate',
        move: 'move',
        pickup: 'pickup',
    } as const

    private XIODef = new Variants<keyof typeof this.coordsX>(this.coordsX)
    private YIODef = new Variants<keyof typeof this.coordsY>(this.coordsY)

    public inputs = {
        posX: this.XIODef,
        posY: this.YIODef,
        targetX: this.XIODef,
        targetY: this.YIODef,
        rotation: new Variants<keyof typeof this.rotation>(this.rotation),
    } as const
    public outputs = {
        action: new Variants<keyof typeof this.actions>(this.actions),
    } as const

    // Keep in mind that this is the part that i currently am designing 
    // and im still unsure as to how to correctly set the types for the parameters, so it is be sudo code.
    // * @param data.input should require all keys that are defined in this.inputs,
    // *    if key is 'posX', value should require any of the varients defined in this.coordsX
    // * @param data.target should require all keys defined in this.outputs
    // *    if key is 'posX', value should require any of the varients defined in this.coordsX
    public Train(
        data: {
            input: {[key: keyof typeof this.inputs]: keyof typeof key},
            target: {[key: keyof typeof this.outputs]: keyof typeof key}
        }
    ) {
        // Rest of functionality
    }
}

const ai = new GridAI()
ai.Train([
    { 
        input: {
            posX: 'left',
            posY: 'middle',
            targetX: 'middle',
            targetY: 'center',
            rotation: 'east',
        }, 
        target: {action: 'move'},
    },
    { 
        input: {
            posX: 'center',
            posY: 'middle',
            targetX: 'center',
            targetY: 'middle',
            rotation: 'east',
        }, 
        target: {action: 'pickup'},
    },
])
```

For this method of inputs and outputs to work properly, the functiosn need to work a specific way in terms of what they accept and what they dont.
This could easily be solved by just checking if the parameters were correct inside the method but thats is not at all intuitive as it would be more guess work while using the structure.
Instead, the types should only allow the correct inputs, and this may be a hard to define.
For example, when passing in the inputs to train the ai, the function should require all the keys defined in inputs
and then should accept the value of those keys to be one of the variants that it defines.
The same goes for outputs.

