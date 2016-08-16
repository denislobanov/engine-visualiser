<template>
    <h3>Visualiser</h3>
    <div v-el:graph class="graph"></div>
    <input v-model="searchValue" v-on:click="clearValue">
    <button v-on:click="notify">Search</button>
</template>

<style>
.graph {
    width: 100%;
    height: 75%;
}
</style>

<script>
import Visualiser from '../js/visualiser.js'

export default {
    data() {
        return {
            searchValue: "Enter search string; e.g. 'type'.",
            visualiser: {}
        }
    },

    attached() {
        visualiser = new Visualiser(this.$els.graph);
        console.log("attached graph")
    },

    methods: {
        notify() {
            visualiser.sendRequest("/concept/"+this.searchValue, visualiser.createGraph);
            console.log("go graph: "+this.searchValue)
            this.searchValue = ''
        },

        clearValue() {
            this.searchValue=''
        }
    }
}
</script>
