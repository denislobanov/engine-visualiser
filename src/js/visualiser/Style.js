"use strict";

export default class Style {
    constructor() {
        this.network = {
            background: "#383838"
        };

        this.node = {
            colour: {
                background: "#383838",
                border: "#a1d884",
                highlight: {
                    background: "#383838",
                    border: "#a1d884"
                }
            },
            shape: "box"
        };

        this.edge = {
            colour: {
                color: "#bbbcbc",
                highlight: "#a1d884"
            }
        };
    }

    /**
     * Return node colour based on its @baseType or default colour otherwise.
     * @param baseType
     * @returns {*}
     */
    getNodeColour(baseType) {
        switch(baseType) {
            case "relation-type":
                return {
                    background: this.node.colour.background,
                    border: "#77dd77",
                    highlight: {
                        border: "#77dd77"
                    }
                };
            case "type":
                return {
                    background: this.node.colour.background,
                    border: "#5bc2e7",
                    highlight: {
                        border: "#5bc2e7"
                    }
                };
            case "resource-type":
                return {
                    background: this.node.colour.background,
                    border: "#ff7878",
                    highlight: {
                        border: "#ff7878"
                    }
                };
            default:
                return this.node.colour;
        }
    }

    /**
     * Return node shape configuration based on its @baseType or default shape otherwise.
     * @param baseType
     * @returns {string}
     */
    getNodeShape(baseType) {
        switch(baseType) {
            case "resource-type":
            case "relation-type":
            case "entity-type":
            default:
                return this.node.shape;
        }
    }

    /**
     * Return node label font configuration based on its @baseType or default font otherwise.
     * @param baseType
     * @returns {{color: (string|string|string)}}
     */
    getNodeFont(baseType) {
        return {
            color: this.getNodeColour(baseType).border
        };
    }

    /**
     * Return edge colour configuration.
     * @returns {ENGINE.Style.edge.colour|{color, highlight}}
     */
    getEdgeColour() {
        return this.edge.colour;
    }

    /**
     * Return edge label font configuration.
     * @returns {{color: string}}
     */
    getEdgeFont() {
        return {
            color: this.getEdgeColour().color
        };
    }
};
