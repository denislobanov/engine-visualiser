"use strict";

function createGraph(data) {
    ENGINE.API.addNodes(data);
}

var testRequest = {
    url: "proxy.php?q=http://localhost:8080/concept/ccaabb7f-668f-4f05-9b8f-974f2a3972c0",
    success: createGraph
};
ENGINE.Network.request(testRequest);

function onClick(param) {
    console.log(param);
}

var callbacks = {
    click: onClick
};
var container = document.getElementById('mm_network');


ENGINE.Graph.run(container, undefined, callbacks);
