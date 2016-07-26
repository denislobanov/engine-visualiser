"use strict";

ENGINE.Network = {
    _data: {
        // vis.js network representation
        graph: {
            nodes: new vis.DataSet([]),
            edges: new vis.DataSet([])
        },
        network: {},

        // Internal lookup of vis.js nodes
        nodeMap: {}
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

    run: function (container, options) {
        this._data.network = new vis.Network(
            container,
            this._data.graph,
            this._defaults.options || options
        );
    },

    addNode: function (data) {
        var node = {
            id: data._id,
            label: data._id,
            color: ENGINE.Style.getNodeColour(data._baseType),
            font: ENGINE.Style.getNodeFont(data._baseType),
            selected: false,
            shape: ENGINE.Style.getNodeShape(data._baseType)
        };

        this._data.graph.nodes.add(node);
        this._data.nodeMap[data._links.self.href] = node;
    },

    addEdge: function (fromNode, toNode, name) {
        var edge = {
            from: this.lookupNode(fromNode).id,
            to: this.lookupNode(toNode).id,
            label: name,
            color: ENGINE.Style.getEdgeColour(),
            font: ENGINE.Style.getEdgeFont()
        };

        this._data.graph.edges.add(edge);
    },

    lookupNode: function (href) {
        return this._data.nodeMap[href];
    }
};
