"use strict";

ENGINE.API = {
    getNodeHref: function (node) {
        return node._links.self.href;
    },

    addNodes: function (data) {
        // Add this node to graph
        var name = data._value || data._id;
        ENGINE.Graph.addNode(data._id, name, data._baseType, this.getNodeHref(data));

        this.addEmbeddedNodes(data);
    },

    addEmbeddedNodes: function (data) {
        // Add any related nodes (and thus edges)
        if(_.has(data, "_embedded")) {
            console.log("adding from embedded: ");
            console.log(data);
            console.log("---");

            _.map(_.keys(data._embedded),
                function(k) {
                    this.addEdges(k, this.getNodeHref(data), data._embedded[k]);
                },
                ENGINE.API);
        }
    },

    addEdges: function (name, fromNode, nodeList) {
        _.map(nodeList,
            function (toNode) {
                this.addNodes(toNode);
                ENGINE.Graph.addEdge(fromNode, this.getNodeHref(toNode), name);
            },
            ENGINE.API);
    }
};