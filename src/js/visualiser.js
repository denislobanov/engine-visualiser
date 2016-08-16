"use strict";

import _ from 'underscore';
import Graph from '../js/visualiser/Graph';
import HalAPI from '../js/visualiser/HalAPI';
import Network from '../js/visualiser/Network';

export default class Visualiser {
    constructor(container) {
        this.graph = new Graph();
        this.halAPI = new HalAPI(this.graph);
        this.network = new Network();

        var callbacks = {
            click: function(param) {
                _.map(param.nodes, x => { sendRequest(x, createGraph), this });
            },

            doubleClick: param => {
                var childHref = param.nodes[0];
                var parentHref = "http://localhost:8080/concept/"+graph.getNodeType(childHref);

                sendRequest(parentHref, addMetaNode.bind(undefined, childHref));
            },

            rightClick: param => { _.map(param.nodes, graph.removeNode, this.graph) }
        };

        // Start vis
        this.graph.run(container, undefined, callbacks);
    }

    sendRequest(href, success) {
        var proxyRequest = {
            url: "proxy.php?q="+href,
            success: success
        };

        this.network.request(proxyRequest);
    }

    createGraph(data) {
        this.halAPI.addNodes(data);
        this.halAPI.iterateEmbeddedKeys(data);
    }

    addMetaNode(childHref, data) {
        this.halAPI.addNodes(data);
        this.graph.addEdge(childHref, halAPI.getNodeHref(data),  "isa");
    }

}
