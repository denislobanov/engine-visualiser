export default class HalAPI {
    constructor(graph) {
        this.graph = graph;
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
    addNodes(data) {
        // Add this node to graph
        var name = data._value || data._id;

        this.graph.addNode(data._id, name, data._baseType, data._type, this.getNodeHref(data));
    }

    /**
     * Iterate current nodes `_embedded` object to add nodes and relationships via iterateEmbeddedKeys()
     * @param data
     */
    iterateEmbeddedKeys(data) {
        if (_.has(data, "_embedded")) {
            _.map(_.keys(data._embedded), k => {
                this.addEmbedded(this.getNodeHref(data), data._embedded[k], k);
            }, this);
        }
    }

    /**
     * Add edges and nodes from "_embedded"
     * @param parentHref
     * @param nodeList
     * @param edgeName
     */
    addEmbedded(parentHref, nodeList, edgeName) {
        _.map(nodeList, x => {
            var href = this.getNodeHref(x);

            // Add edge from x to parent
            if(x._baseType === "relation-type")
                this.graph.addEdge(href, parentHref, edgeName);
            else
                this.graph.addEdge(parentHref, href, edgeName);

            // Add node from nodeList
            this.addNodes(x);

        }, this);
    }
}
