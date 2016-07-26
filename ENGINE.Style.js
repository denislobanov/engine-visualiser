"use strict";

ENGINE.Style = {

    _defaults: {
        network: {
            background: "#383838"
        },

        node: {
            colour: {
                background: "#383838",
                border: "#a1d884",
                highlight: {
                    background: "#383838",
                    border: "#a1d884"
                }
            },
            shape: "box"
        },

        edge: {
            colour: {
                color: "#bbbcbc",
                highlight: "#a1d884"
            }
        }
    },

    getNodeColour: function(baseType) {
        return this._defaults.node.colour;
    },

    getNodeShape: function(baseType) {
        return this._defaults.node.shape;
    },

    getNodeFont: function(baseType) {
        return {
            color: this.getNodeColour(baseType).border
        };
    },

    getEdgeColour: function() {
        return this._defaults.edge.colour;
    },

    getEdgeFont: function() {
        return {
            color: this.getEdgeColour().color
        };
    }
};