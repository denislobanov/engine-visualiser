import _ from 'underscore';
import Graph from './Graph';
import * as APITerms from './APITerms';
import * as EdgeUtils from './TypeWeight';

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
            if(this.alreadyConnected(obj, parent))
                return;

            // Add node and iterate its _embedded field
            this.addNode(obj);

            var edgeLabel = this.edgeLabel(obj, parent);

            if(EdgeUtils.leftSignificant(obj, parent))
                this.addEdge(parent, obj, edgeLabel);

            else
                this.addEdge(obj, parent, edgeLabel);

            this.addConcept(obj);

        });
    }

    edgeLabel(nodeA, nodeB) {
        if(nodeA[APITerms.KEY_BASE_TYPE] === APITerms.TYPE_TYPE)
            return APITerms.EDGE_LABEL_ISA;

        if(nodeB[APITerms.KEY_BASE_TYPE] === APITerms.TYPE_TYPE)
            return APITerms.EDGE_LABEL_ISA;

        if(EdgeUtils.leftSignificant(nodeA, nodeB))
            return nodeB[APITerms.KEY_TYPE];

        else
            return nodeA[APITerms.KEY_TYPE];
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
        var fromHref = this.getNodeHref(fromNode);
        var toHref = this.getNodeHref(toNode);

        var edgeID = this.graph.addEdge(fromHref, toHref, label);

        // Update internal map
        this.edgeMap[edgeID] = _.uniq(_.flatten(_.zip(this.edgeMap[edgeID], [fromHref, toHref])));
        this.nodeMap[fromHref].push(edgeID);
        this.nodeMap[toHref].push(edgeID);
    }


    /**
     * Checks if two nodes are already connected by an edge.
     * @param nodeA
     * @param nodeB
     * @returns {boolean}
     */
    alreadyConnected(nodeA, nodeB) {
        var hrefA = this.getNodeHref(nodeA);
        var hrefB = this.getNodeHref(nodeB);

        // Boundary check for either node not existing
        if((!_.has(this.nodeMap, hrefA)) || (!_.has(this.nodeMap, hrefB)))
            return false;

        // _.intersection of empty and non-empty array results in contents of non-empty array
        if((this.nodeMap[hrefA].length === 0) || (this.nodeMap[hrefB].length === 0))
            return false;

        var edgeIDs = _.intersection(this.nodeMap[hrefA], this.nodeMap[hrefB]);
        console.log("intersection of("+hrefA+") and ("+hrefB+"):");
        console.log(edgeIDs);
        console.log("where arrays are:");
        console.log(this.nodeMap[hrefA]);
        console.log(this.nodeMap[hrefB]);

        var result = !!(edgeIDs !== undefined && edgeIDs !== null && edgeIDs.length > 0);
        console.log("result: "+result);
        return result;
    }
}
