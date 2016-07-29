"use strict";

ENGINE.API = {
    _baseUrl: "http://localhost:8080/",

    /**
     * Returns href of current node.
     * @param node Object
     * @returns {string|string|*|o}
     */
    getNodeHref: function(node) {
        return node._links.self.href;
    },

    /**
     * Adds just the current node in data to graph via ENGINE.Graph
     * @param data
     */
    addNodes: function(data) {
        // Add this node to graph
        var name = data._value || data._id;
        ENGINE.Graph.addNode(data._id, name, data._baseType, data._type, this.getNodeHref(data));
    },

    /**
     * Iterate current nodes `_embedded` object to add nodes and relationships via iterateEmbeddedKeys()
     * @param data
     */
    iterateEmbeddedKeys: function(data) {
        if (_.has(data, "_embedded")) {
            _.map(_.keys(data._embedded), function (k) {
                this.addEmbedded(this.getNodeHref(data), data._embedded[k], k);
            }, ENGINE.API);
        }
    },

    /**
     * Add edges and nodes from "_embedded"
     * @param parentHref
     * @param nodeList
     * @param edgeName
     */
    addEmbedded: function(parentHref, nodeList, edgeName) {
        _.map(nodeList, function(x) {
            var href = this.getNodeHref(x);

            // Add edge from x to parent
            if(x._baseType === "relation-type")
                ENGINE.Graph.addInboundEdge(parentHref, href, edgeName);
            else
                ENGINE.Graph.addOutboundEdge(parentHref, href, edgeName);

            // Add node from nodeList
            this.addNodes(x);

        }, ENGINE.API);
    }

};