"use strict";

function createGraph(data) {
    ENGINE.API.addNodes(data);
}

function sendRequest(uuid, success) {
    var testRequest = {
        url: "proxy.php?q=http://localhost:4567/concept/"+uuid,
        success: success
    };

    ENGINE.Network.request(testRequest);
}

function onClick(param) {
    _.map(param.nodes, function(n) { sendRequest(n ,ENGINE.API.addEmbeddedNodes) })
}


sendRequest("ccaabb7f-668f-4f05-9b8f-974f2a3972c0", createGraph);

var callbacks = {
    click: onClick
};
var container = document.getElementById('mm_network');
ENGINE.Graph.run(container, undefined, callbacks);
