"use strict";

function createGraph(data) {
    ENGINE.API.addNodes(data);
}

function sendRequest(href, success) {
    var testRequest = {
        url: "proxy.php?q="+href,
        success: success
    };

    ENGINE.Network.request(testRequest);
}

function onClick(param) {
    console.log(param);
    _.map(param.nodes, function(n) { sendRequest(n ,ENGINE.API.addEmbeddedNodes) })
}


sendRequest("http://localhost:8080/concept/ccaabb7f-668f-4f05-9b8f-974f2a3972c0", createGraph);

var callbacks = {
    click: onClick
};
var container = document.getElementById('mm_network');
ENGINE.Graph.run(container, undefined, callbacks);
