"use strict";

function addEdges(name, fromNode, nodeList) {
    console.log("adding edges: ");
    console.log(nodeList);

    _.map(nodeList, function(toNode) {
        addNodes(toNode);
        ENGINE.Graph.addEdge(fromNode, ENGINE.Graph.getNodeHref(toNode), name);
    });
}

function addNodes(data) {
    console.log("adding node: ");
    console.log(data);

    ENGINE.Graph.addNode(data);

    if(_.has(data, "_embedded")) {
        _.map(_.keys(data._embedded), function(k) {
            addEdges(k, ENGINE.Graph.getNodeHref(data), data._embedded[k]);
        });
    }
}




var testRequest = {
    url: "proxy.php?q=http://localhost:8080/concept/ccaabb7f-668f-4f05-9b8f-974f2a3972c0",
    success: addNodes
};

ENGINE.Network.request(testRequest);

var container = document.getElementById('mm_network');
ENGINE.Graph.run(container);
