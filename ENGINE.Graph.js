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
        edgeMap: {},
        nodeTypeMap: {}
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
     * @param type Node type as give by Engine HAL response.
     * @param href Node HREF as give by Engine HAL response.
     */
    addNode: function(id, label, baseType, type, href) {
        // Do not (re)add existing nodes
        if(this.getNodeType(href))
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

        // update nodeTypeMap only; nodeMap is updated on edge creation.
        this._data.nodeTypeMap[href] = type;
    },

    /**
     * Internal method to add edge between two nodes.
     * @param fromNode HREF of outbound node for edge.
     * @param toNode HREF of inbound node for edge.
     * @param name Label to put on edge.
     */
    addEdge: function(fromNode, toNode, name) {
        if(this.alreadyConnected(fromNode, toNode))
            return;

        console.log("adding edge from("+fromNode+") to ("+toNode+") as ("+name+")");

        var edgeID = vis.util.randomUUID();

        var edge = {
            id: edgeID,
            from: fromNode,
            to: toNode,
            label: name,
            color: ENGINE.Style.getEdgeColour(),
            font: ENGINE.Style.getEdgeFont()
        };

        // Add to graph
        this._data.graph.edges.add(edge);

        // Update internal edge tracking
        this.saveEdge(edgeID, [fromNode, toNode]);
        this.appendToNodeMap(fromNode, edgeID);
        this.appendToNodeMap(toNode, edgeID);
    },

    /**
     *
     * @param nodeA
     * @param nodeB
     * @returns {boolean}
     */
    alreadyConnected: function(nodeA, nodeB) {
        // Boundary check for either node not existing
        if((!_.has(this._data.nodeMap, nodeA)) || (!_.has(this._data.nodeMap, nodeB))) {
            console.log("node not in map: ");
            console.log(nodeA);
            console.log(nodeB);
            return false;
        }

        // _.union of empty and non-empty array results in contents of non-empty array
        if((this._data.nodeMap[nodeA].length === 0) || (this._data.nodeMap[nodeB].length === 0)) {
            console.log("empty entries in nodeMap for nodes:");
            console.log(this._data.nodeMap[nodeA]);
            console.log(this._data.nodeMap[nodeB]);
            return false;
        }

        var edgeIDs = _.union(this._data.nodeMap[nodeA], this._data.nodeMap[nodeB]);
        console.log("union:");
        console.log(edgeIDs);
        return !!(edgeIDs !== undefined && edgeIDs !== null && edgeIDs.length > 0);
    },

    /**
     *
     * @param href
     * @returns {*}
     */
    getNodeType: function(href) {
        return this._data.nodeTypeMap[href];
    },

    /**
     * Stores node in internal map. Used to quickly track with nodes we have already added to the graph, and to avoid trying
     * to add duplicates.
     * @param href
     * @param edgeID
     */
    appendToNodeMap: function(href, edgeID) {
        if (_.has(this._data.nodeMap, href))
            this._data.nodeMap[href].push(edgeID);
        else
            this._data.nodeMap[href] = [edgeID];
    },

    /**
     * Store edge in internal map.
     * @param edgeID
     * @param nodeList
     */
    saveEdge: function(edgeID, nodeList) {
        if(!_.has(this._data.edgeMap, edgeID))
            this._data.edgeMap[edgeID] = nodeList;
        else
            this._data.edgeMap[edgeID] = _.zip(this._data.edgeMap[edgeID], nodeList);
    },

    /**
     * Remove a node from the graph.
     * @param href
     */
    removeNode: function(href) {
        console.log("removing node: "+href);

        // Get list of all edges connected to this node
        _.map(this._data.nodeMap[href], function(edgeID) {
            this.removeOrphanNodes(href, edgeID);

            // Remove all edges connected to this node
            this._data.graph.edges.remove(edgeID);
            delete this._data.edgeMap[edgeID];

        }, this);

        // Now we can remove this node
        delete this._data.nodeMap[href];
        delete this._data.nodeTypeMap[href];
        this._data.graph.nodes.remove(href);
    },

    /**
     *
     * @param parent
     * @param edgeID
     */
    removeOrphanNodes: function(parent, edgeID) {
        // Node connected to parent by edgeID
        _.map(_.without(this._data.edgeMap[edgeID], parent), function(node) {
            // If it has no other connections it will become orphaned on removal. Remove it too.
            if(_.without(this._data.nodeMap[node], edgeID).length == 0) {
                delete this._data.nodeMap[node];
                delete this._data.nodeTypeMap[node];
                this._data.graph.nodes.remove(node);
            }
        }, this);
    }
};
