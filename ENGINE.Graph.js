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
     * Render a vis.js graph. Pass callbacks for actions on user interaction.
     * @param container Canvas for graph.
     * @param options Default overrides for vis.js graph options
     * @param callbacks Object of callback. The following hooks are valid:
     *  callbacks.click         action on left click
     *  callbacks.doubleClick   action on left double click
     *  callbacks.rightClick    action on right click
     */
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

    /**
     * Add node to graph
     * @param id ID of node; this is what will be given to callbacks passed to run().
     * @param label Node Label - this is what will be displayed on the canvas.
     * @param baseType Base type of node, as given by Engine HAL response.
     * @param href Node HREF as give by Engine HAL response.
     */
    addNode: function(id, label, baseType, href) {
        // Do not (re)add existing nodes
        if(this.lookupNode(href))
            return;

        var node = {
            id: href,
            label: label,
            color: ENGINE.Style.getNodeColour(baseType),
            font: ENGINE.Style.getNodeFont(baseType),
            shape: ENGINE.Style.getNodeShape(baseType),
            selected: false
        };

        // Add to vis.js graph
        this._data.graph.nodes.add(node);

        // Save in map for lookupNode
        this.saveNode(href, node);
    },

    /**
     * Adds an edge between two nodes on graph.
     * @param fromNode HREF of outbound node for edge.
     * @param toNode HREF of inbound node for edge.
     * @param name Label to put on edge.
     */
    addEdge: function(fromNode, toNode, name) {

        if(this.lookupNode(toNode))
            return;

        console.log("adding edge from("+fromNode+") to ("+toNode+") as ("+name+")");

        var edge = {
            from: fromNode,
            to: toNode,
            label: name,
            color: ENGINE.Style.getEdgeColour(),
            font: ENGINE.Style.getEdgeFont()
        };

        // Add to graph
        this._data.graph.edges.add(edge);

        // Save in internal map for lookupEdge
        this.saveEdge(fromNode, toNode, name);
    },

    /**
     * Finds Node in internal map. If it does not exist returns null
     * @param href - String of nodes href as given by _links.self.href from Engine
     * @returns {*}  node object if it exists, null if it does not.
     */
    lookupNode: function(href) {
        if(_.has(this._data.nodeMap, href))
            return this._data.nodeMap[href];

        return null;
    },

    /**
     * Stores node in internal map. Used to quickly track with nodes we have already added to the graph, and to avoid trying
     * to add duplicates.
     * @param href - String of nodes href as give by _links.self.href
     * @param node - Node object to add.
     */
    saveNode: function(href, node) {
        this._data.nodeMap[href] = node;
    },

    /**
     * Store edge in internal map.
     * @param fromNode HREF of outbound node for edge.
     * @param toNode HREF of inbound node for edge.
     * @param name Label of edge.
     */
    saveEdge: function(fromNode, toNode, name) {
        if(!_.has(this._data.edgeMap, fromNode))
            this._data.edgeMap[fromNode] = {};

        if(!_.has(this._data.edgeMap[fromNode], toNode))
            this._data.edgeMap[fromNode][toNode] = name;
    }
};
