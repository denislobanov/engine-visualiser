"use strict";

function sendRequest(href, success) {
    var testRequest = {
        url: "proxy.php?q="+href,
        success: success
    };

    ENGINE.Network.request(testRequest);
}

function createGraph(data) {
    ENGINE.API.addNodes(data);
    ENGINE.API.iterateEmbeddedKeys(data);
}

function addMetaNode(childHref, data) {
    console.log("addmetanode. childhref: "+childHref);
    console.log(data);

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
        var parentHref = "http://localhost:8080/concept/"+ENGINE.Graph.lookupNode(childHref).type;

        sendRequest(parentHref, addMetaNode.bind(undefined, childHref));
    },

    rightClick: function(param) {
        console.log(param);

        var href = param.nodes[0];

        _.map(param.edges, function(x) { ENGINE.Graph.removeEdge(x, href); }, ENGINE.Graph);
        ENGINE.Graph.removeNode(href);
    }
};
var container = document.getElementById('mm_network');
ENGINE.Graph.run(container, undefined, callbacks);
