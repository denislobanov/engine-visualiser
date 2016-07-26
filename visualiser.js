"use strict";

// Create a dummy network
ENGINE.Network.addNode({
    _id: "1",
    _links: {
        self: {
            href: "href-1"
        }
    }
});
ENGINE.Network.addNode({
    _id: "2",
    _links: {
        self: {
            href: "href-2"
        }
    }
});
ENGINE.Network.addEdge("href-1", "href-2", "edge-1");

var container = document.getElementById('mm_network');
ENGINE.Network.run(container);

