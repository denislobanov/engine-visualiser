"use strict";

ENGINE.Graph = {
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

    run: function (container, options, callbacks) {
        var network = new vis.Network(
            container,
            this._data.graph,
            this._defaults.options || options
        );

        if(_.has(callbacks, "click"))
            network.on("click", callbacks.click);

        if(_.has(callbacks, "doubleClick"))
            network.on("doubleClick", callbacks.doubleClick);

        if(_.has(callbacks, "rightClick"))
            network.on("oncontext", callbacks.rightClick);

        this._data.network = network;
    },

    addNode: function (id, label, baseType, href) {
        var node = {
            id: id,
            label: label,
            color: ENGINE.Style.getNodeColour(baseType),
            font: ENGINE.Style.getNodeFont(baseType),
            selected: false,
            shape: ENGINE.Style.getNodeShape(baseType)
        };

        this._data.graph.nodes.add(node);
        this._data.nodeMap[href] = node;
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
