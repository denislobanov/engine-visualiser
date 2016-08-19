import _ from 'underscore';
import Graph from './Graph';
import * as APITerms from './APITerms';

export default class HalAPI {
    constructor(graph) {
        this.graph = graph;

        // node href to [edge ids]
        this.nodeMap = {};

        // edge id to [node href]
        this.edgeMap = {};
    }

    /**
     * Returns href of current node.
     * @param node Object
     * @returns {string|string|*|o}
     */
    getNodeHref(node) {
        return node._links.self.href;
    }

    /**
     * Adds just the current node in data to graph via ENGINE.Graph
     * @param data
     */
    addConcept(data) {
        this.addNode(data);

        // Add assertions from _embedded
        if(APITerms.KEY_EMBEDDED in data) {
            _.map(Object.keys(data[APITerms.KEY_EMBEDDED]), key => {
                this.parseEmbedded(data[APITerms.KEY_EMBEDDED][key], data, key)
            });
        }
    }

    parseEmbedded(objs, parent, roleName) {
        _.map(objs, obj => {
            // Embedded objects can be either assertions or concepts
            if(obj.type === APITerms.RELATION_TYPE) {
                this.addNode(obj);

                // Add edge from assertion
                this.addEdge(obj, parent, roleName);

            } else {
                this.addConcept(obj);
                this.addEdge(parent, obj, roleName);
            }
        });
    }

    addNode(data) {
        var href = this.getNodeHref(data);
        if(href in this.nodeMap)
            return;

        console.log("adding brand new node: "+href);
        var name = data._value || data._id;
        this.graph.addNode(data._id, name, data._baseType, data._type, href);

        // Update internal map
        this.nodeMap[href] = [];
    }

    // node1 and nod2 have to be objects for 'type' field
    addEdge(fromNode, toNode, label) {
        if(this.alreadyConnected(fromNode, toNode))
            return;

        var edgeID = this.graph.addEdge(fromNode, toNode, label);

        // Update internal map
        var fromHref = this.getNodeHref(fromNode);
        var toHref = this.getNodeHref(toNode);

        this.edgeMap[edgeID] = _.uniq(_.zip(this.edgeMap[edgeID], [fromHref, toHref]));

        this.nodeMap[fromHref] = _.zip(this.nodeMap[fromHref], edgeID);
        this.nodeMap[toHref] = _.zip(this.nodeMap[toHref], edgeID);
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

        // _.intersection of empty and non-empty array results in contents of non-empty array
        if((this.nodeMap[nodeA].length === 0) || (this.nodeMap[nodeB].length === 0)) {
            console.log("empty entries in nodeMap for nodes:");
            console.log(this.nodeMap[nodeA]);
            console.log(this.nodeMap[nodeB]);
            return false;
        }

        var edgeIDs = _.intersection(this.nodeMap[nodeA], this.nodeMap[nodeB]);
        console.log("intersection of("+nodeA.id+") and ("+nodeB.id+"):");
        console.log(edgeIDs);

        var result = !!(edgeIDs !== undefined && edgeIDs !== null && edgeIDs.length > 0);
        console.log("result: "+result);
        return result;
    }
}
