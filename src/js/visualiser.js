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
            click: x => this.onClick(x),
            doubleClick: x => this.doubleClick(x),
            rightClick: x => this.rightClick(x)
        };

        // Start vis
        this.graph.run(container, undefined, callbacks);
    }

    sendRequest(href, success) {
        var proxyRequest = {
            url: "proxy.php?q=http://10.10.10.142:8080"+href,
            success: success.bind(this)
        };

        this.network.request(proxyRequest);
    }

    createGraph(data) {
        this.halAPI.addNodes(data);
        this.halAPI.iterateEmbeddedKeys(data);
    }

    addMetaNode(childHref, data) {
        this.halAPI.addNodes(data);
        this.graph.addEdge(childHref, this.halAPI.getNodeHref(data),  "isa");
    }

    onClick(param) {
        _.map(param.nodes, x => { this.sendRequest(x, this.createGraph)}, this);
    }

    doubleClick(param) {
        var childHref = param.nodes[0];
        var parentHref = "/concept/"+this.graph.getNodeType(childHref);

        this.sendRequest(parentHref, x => this.addMetaNode(x, childHref));
    }

    rightClick(param) {
        _.map(param.nodes, this.graph.removeNode, this.graph);
    }
}
