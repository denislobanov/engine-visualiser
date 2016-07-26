"use strict";

ENGINE.Network = {
    _data: {
        // vis.js network representation
        graph: {
            nodes: vis.DataSet([]),
            edges: vis.DataSet([])
        },
        network: {},

        // Internal lookup of vis.js nodes
        nodeMap: {},
        edgeMap: {}
    },

    // vis.js default config
    _defaults: {
        options: {
            edges: {
                arrows: {
                    to: true
                }
            },
            physics: {
                solver: "forceAtlas2Based"
            }
        }
    },

    /**
     * Initialise a network visualisation.
     * @param container
     * @param options
     */
    init: function(container, options) {
        this._data.network = new vis.Network(
            container,
            this._defaults.graph,
            this._defaults.options || options
        );
    },

    addNode: function(data) {
        var node = {
            id: data._id,
            color: ENGINE.Style.getColour(data._baseType),
            selected: false,
            shape: ENGINE.Style.getShape(data._baseType)
        };

        this._data.graph.nodes.add(node);
        this._data.nodeMap[data._links.self.href] = node;
    },

    addEdge: function(data) {
        var edge = {

        }
    }
};