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
    ENGINE.Graph.addEdge(childHref, ENGINE.API.getNodeHref(data),  "isa");
}

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

$("#search-form").submit(function() {
    var value = $("#search").val();
    sendRequest("http://localhost:8080/concept/"+value, createGraph);

    return false;
});
