# ![diazo](logo.svg)

[GitHub](https://github.com/astronautlabs/diazo)
| [NPM](https://npmjs.com/package/diazo)
| [Angular Documentation](https://astronautlabs.github.io/diazo/) 
| [Model Documentation](https://astronautlabs.github.io/diazo-model)
| [Try it out](https://astronautlabs.github.io/diazo-example/)

An MIT-licensed slot-driven directed-acyclical-graph (DAG) editor for Angular. This 
component was built for use in [Astronaut Labs](https://astronautlabs.com)' Livefire product suite because 
there was no good existing open-source editor. We wanted to fix that, so we 
hope you find lots of great ways to use this editor in your projects!

Diazo is inspired by Blueprint, the visual programming language of 
Unreal Engine. Diazo itself is just the editor that would power such
an experience, and the library itself is completely domain-agnostic. 
You can use Diazo in your apps to introduce visual node-graph functionality 
in any domain where it makes sense to apply it, and we encourage you to do so!

## Where can I find docs for DiazoGraph?

The types for the actual graph data that Diazo edits can be found 
in the [@diazo/model](https://github.com/) module. 
[Click here](https://astronautlabs.github.io/diazo-model) to jump to its
documentation.

## Concepts

Diazo operates on a simple directed-acyclical-graph (DAG) data structure 
which is transparently available to you as the consumer of the library. The 
DAG is specified as a set of nodes with distinct IDs which each specify a set of
input and output slots. The DAG also tracks a set of edges which
link one slot on a particular node to another slot on a different node. 

## Usage

```html
    <dz-editor
        [graph]="myGraph"
        [availableNodes]="availableNodes"
        ></dz-editor>
```

There are many more bindable properties and events that {@linkcode EditorComponent | &lt;dz-editor&gt;} makes 
available, but the above is good enough to get started.

### `[graph]="myGraph"`

The most important input to Diazo is the graph object itself. The graph 
object specifies the nodes and edges that make up the graph you can see in 
the editor.

One might satisfy this binding by declaring `myGraph` as seen below.
```typescript
import { Diazo } from 'diazo';

export class MyComponent {
    myGraph : Diazo = { nodes: [], edges: [] };
}
```

### `[availableNodes]="availableNodes"`

In order for a user to create new nodes, you will need to define a set of 
template nodes that will populate into the New Node menu (accessible by 
right clicking). `availableNodes` is an array of NodeSets.

Each NodeSet defines a labelled group of template nodes. Let's add a 
node set with a few simple template nodes:
```typescript
import { Diazo } from 'diazo';

export class MyComponent {
    myGraph : Diazo = { nodes: [], edges: [] };
    availableNodes : DiazoNodeSet[] = [
        {
            id: 'general',
            label: 'General',
            nodes: [
                {
                    data: {
                        unit: 'my-input'
                    },
                    label: 'My Input',
                    slots: [
                        { id: 'output', type: 'output', label: 'Output' }
                    ]
                },
                {
                    data: {
                        unit: 'my-output'
                    },
                    label: 'My Output',
                    slots: [
                        { id: 'input', type: 'input', label: 'Input' }
                    ]
                }
            ]
        }
    ];
}
```

## Defining Properties

Template nodes can specify a set of _properties_ which will be shown on the Properties
sidebar. Similar to the available node set, properties are grouped into labelled sets.

```js
let node : DiazoNode = {
    data: {
        unit: 'my-output',
        someProperty: 'abc'
    },
    label: 'My Output',
    slots: [
        { id: 'input', type: 'input', label: 'Input' }
    ],
    properties: [
        {
            id: 'output-options',
            label: 'Output Options',
            properties: [
                {
                    type: 'text',
                    path: '$.data.someProperty',
                    label: 'Some Property'
                }
            ]
        }
    ]
}
```

## Property Types

There are a number of property editor types built in, and you can register
custom property editors as well.

Builtin types:
 - **text** - Single-line text editor
 - **textarea** - Multi-line text editor
 - **number** - Number editor
 - **boolean** - Checkbox
 - **position** - Special property which exposes two fields connected to `$.x` and `$.y`.
   `path` is ignored.
 - **bitmask** - Edit the bits of a number with checkboxes by defining an array of labels.
   Labels are associated with bit indices by their position in the labels array, and thus
   all labels must be contiguous. Place labels in `bitmask.labels`
 - **json** - Edit JSON using Monaco
 - **markdown** - Edit Markdown using Monaco
 - **typescript** - Edit TypeScript using Monaco
 - **matrix** - Edit many properties in a grid with short labels. Can be used to
   implement fixed-size matrices.
 - **select** - Choose the value from a set of predefined options
 - **flags** - Edit an array of string flags using a multiple select box.

## Learn More

- {@linkcode EditorComponent | &lt;dz-editor&gt;} - Read about the editor component
- {@linkcode DiazoGraph} - Read about the model layer
- {@linkcode DiazoContext} - Read about the context layer, which tracks
  editor state
