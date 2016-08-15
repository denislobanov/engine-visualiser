<template>
    <div id="mm_network" oncontextmenu="return false;"></div>
    <form id="search-form">
        Search
        <input type="text" id="search"/>
    </form>
</template>

<style type="text/css">
    #mm_network {
        width: 100%;
        height: 95%;
    }
</style>

<script>
    "use strict";

    import Graph from '../js/visualiser/Graph'
    import HalAPI from '../js/visualiser/HalAPI'
    import Network from '../js/visualiser/Network'

    var graph = new Graph();
    var halAPI = new HalAPI(graph);
    var network = new Network();

    function sendRequest(href, success) {
        var proxyRequest = {
            url: "proxy.php?q="+href,
            success: success
        };

        network.request(proxyRequest);
    }

    function createGraph(data) {
        halAPI.addNodes(data);
        halAPI.iterateEmbeddedKeys(data);
    }

    function addMetaNode(childHref, data) {
        halAPI.addNodes(data);
        graph.addEdge(childHref, halAPI.getNodeHref(data),  "isa");
    }

    var callbacks = {
        click: function(param) {
            _.map(param.nodes, function(x) { sendRequest(x, createGraph) });
        },

        doubleClick: function(param) {
            var childHref = param.nodes[0];
            var parentHref = "http://localhost:8080/concept/"+graph.getNodeType(childHref);

            sendRequest(parentHref, addMetaNode.bind(undefined, childHref));
        },

        rightClick: function(param) {
            console.log(param);

            _.map(param.nodes, graph.removeNode, graph);
        }
    };
    var container = document.getElementById('mm_network');
    graph.run(container, undefined, callbacks);

    $("#search-form").submit(function() {
        var value = $("#search").val();
        sendRequest("http://localhost:8080/concept/"+value, createGraph);

        return false;
    });
</script>
