"use strict";

function sendRequest(href, success) {
    var proxyRequest = {
        url: "proxy.php?q="+href,
        success: success
    };

    ENGINE.Network.request(proxyRequest);
}

function createGraph(data) {
    ENGINE.API.addNodes(data);
    ENGINE.API.iterateEmbeddedKeys(data);
}

function addMetaNode(childHref, data) {
    ENGINE.API.addNodes(data);
    ENGINE.Graph._addEdge(childHref, ENGINE.API.getNodeHref(data),  "isa");
}

sendRequest("http://localhost:8080/concept/ccaabb7f-668f-4f05-9b8f-974f2a3972c0", createGraph);

var callbacks = {
    click: function(param) {
        _.map(param.nodes, function(x) { sendRequest(x, createGraph) });
    },

    doubleClick: function(param) {
        var childHref = param.nodes[0];
        var parentHref = "http://localhost:8080/concept/"+ENGINE.Graph.getNodeType(childHref);

        sendRequest(parentHref, addMetaNode.bind(undefined, childHref));
    },

    rightClick: function(param) {
        console.log(param);

        _.map(param.nodes, ENGINE.Graph.removeNode, ENGINE.Graph);
    }
};
var container = document.getElementById('mm_network');
ENGINE.Graph.run(container, undefined, callbacks);
