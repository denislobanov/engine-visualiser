<template>
    <h3>Visualiser</h3>
    <div class="graph">
        <div v-el:graph></div>
        <input v-model="searchValue" v-on:click="clearValue" class="searchInput">
        <button v-on:click="notify">Search</button>
    </div>
</template>

<style>
.graph {
    width: 100%;
    height: 82%;
}
.searchInput {
    width: 40%;
}
</style>

<script>
import Visualiser from '../js/visualiser/Visualiser.js'

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
