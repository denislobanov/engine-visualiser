"use strict";

import _ from 'underscore';
import Style from './Style';

export default class Graph {
    constructor() {
        this.vis = require('vis');

        // vis.js network representation
        this.graph = {
            nodes: new this.vis.DataSet([]),
            edges: new this.vis.DataSet([])
        };
        this.network = {};

        // Internal lookup of vis.js nodes
        this.nodeMap = {};
        this.edgeMap = {};
        this.nodeTypeMap = {};

        // vis.js default config
        this.defaults = {
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
        };

        this.style = new Style();
    }

    /**
     * Render a vis.js graph. Pass callbacks for actions on user interaction.
     * @param container Canvas for graph.
     * @param options Default overrides for vis.js graph options
     * @param callbacks Object of callback. The following hooks are valid:
     *  callbacks.click         action on left click
     *  callbacks.doubleClick   action on left double click
     *  callbacks.rightClick    action on right click
     */
    run(container, options, callbacks) {
        var network = new this.vis.Network(
            container,
            this.graph,
            this.defaults.options || options
        );

        if(_.has(callbacks, "click"))
            network.on("click", callbacks.click);

        if(_.has(callbacks, "doubleClick"))
            network.on("doubleClick", callbacks.doubleClick);

        if(_.has(callbacks, "rightClick"))
            network.on("oncontext", callbacks.rightClick);

        this.network = network;
    }

    /**
     * Add node to graph
     * @param id ID of node; this is what will be given to callbacks passed to run().
     * @param label Node Label - this is what will be displayed on the canvas.
     * @param baseType Base type of node, as given by Engine HAL response.
     * @param type Node type as give by Engine HAL response.
     * @param href Node HREF as give by Engine HAL response.
     */
    addNode(id, label, baseType, type, href) {
        // Do not (re)add existing nodes
        if(this.getNodeType(href))
            return;

        var node = {
            id: href,
            label: label,
            color: this.style.getNodeColour(baseType),
            font: this.style.getNodeFont(baseType),
            shape: this.style.getNodeShape(baseType),
            selected: false
        };

        // Add to vis.js graph
        this.graph.nodes.add(node);

        // update nodeTypeMap only; nodeMap is updated on edge creation.
        this.nodeTypeMap[href] = type;
    }

    /**
     * Add edge between two nodes. Uses alreadyConnected() to avoid adding duplicate edges.
     * @param fromNode HREF of outbound node for edge.
     * @param toNode HREF of inbound node for edge.
     * @param name Label to put on edge.
     */
    addEdge(fromNode, toNode, name) {
        if(this.alreadyConnected(fromNode, toNode))
            return;

        var edgeID = this.vis.util.randomUUID();

        var edge = {
            id: edgeID,
            from: fromNode,
            to: toNode,
            label: name,
            color: this.style.getEdgeColour(),
            font: this.style.getEdgeFont()
        };

        // Add to graph
        this.graph.edges.add(edge);

        // Update internal edge tracking
        this.saveEdge(edgeID, [fromNode, toNode]);
        this.appendToNodeMap(fromNode, edgeID);
        this.appendToNodeMap(toNode, edgeID);
    }

    /**
     * Checks if two nodes are already connected by an edge.
     * @param nodeA HREF string of a node.
     * @param nodeB HREF string of a node.
     * @returns {boolean}
     */
    alreadyConnected(nodeA, nodeB) {
        // Boundary check for either node not existing
        if((!_.has(this.nodeMap, nodeA)) || (!_.has(this.nodeMap, nodeB))) {
            console.log("node not in map: ");
            console.log(nodeA);
            console.log(nodeB);
            return false;
        }

        // _.union of empty and non-empty array results in contents of non-empty array
        if((this.nodeMap[nodeA].length === 0) || (this.nodeMap[nodeB].length === 0)) {
            console.log("empty entries in nodeMap for nodes:");
            console.log(this.nodeMap[nodeA]);
            console.log(this.nodeMap[nodeB]);
            return false;
        }

        var edgeIDs = _.intersection(this.nodeMap[nodeA], this.nodeMap[nodeB]);
        console.log("intersection of("+nodeA+") and ("+nodeB+"):");
        console.log(edgeIDs);

        var result = !!(edgeIDs !== undefined && edgeIDs !== null && edgeIDs.length > 0);
        console.log("result: "+result);
        return result;
    }

    /**
     * Returns a node's `type`.
     * @param href Node HREF string.
     * @returns {*} String with node's `type`.
     */
    getNodeType(href) {
        return this.nodeTypeMap[href];
    }

    /**
     * Stores node in internal map. Used to quickly track with nodes we have already added to the graph, and to avoid trying
     * to add duplicates.
     * @param href
     * @param edgeID
     */
    appendToNodeMap(href, edgeID) {
        if (_.has(this.nodeMap, href))
            this.nodeMap[href].push(edgeID);
        else
            this.nodeMap[href] = [edgeID];
    }

    /**
     * Store edge in internal map.
     * @param edgeID
     * @param nodeList
     */
    saveEdge(edgeID, nodeList) {
        if(!_.has(this.edgeMap, edgeID))
            this.edgeMap[edgeID] = nodeList;
        else
            this.edgeMap[edgeID] = _.zip(this.edgeMap[edgeID], nodeList);
    }

    /**
     * Remove a node from the graph.
     * @param href
     */
    removeNode(href) {
        // Get list of all edges connected to this node
        _.map(this.nodeMap[href], edgeID => {
            this.removeOrphanNodes(href, edgeID);

            // Remove all edges connected to this node
            this.graph.edges.remove(edgeID);
            delete this.edgeMap[edgeID];

        }, this);

        // Now we can remove this node
        delete this.nodeMap[href];
        delete this.nodeTypeMap[href];
        this.graph.nodes.remove(href);
    }

    /**
     * Removes child node of @parent connected by @edgeID if that child node has no other edges except to its parent.
     * @param parent HREF String
     * @param edgeID Edge ID String (T4 UUID)
     */
    removeOrphanNodes(parent, edgeID) {
        // Node connected to parent by edgeID
        _.map(_.without(this.edgeMap[edgeID], parent), node => {
            // If it has no other connections it will become orphaned on removal. Remove it too.
            if(_.without(this.nodeMap[node], edgeID).length == 0) {
                delete this.nodeMap[node];
                delete this.nodeTypeMap[node];
                this.graph.nodes.remove(node);
            }
        }, this);
    }
}
