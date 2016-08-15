var Vue = require('vue')
var VueRouter = require('vue-router')

// Main application
var App = Vue.extend({})

// Components
var visualiser = require('./components/visualiser.vue')
var status =  require('./components/status.vue')

Vue.use(VueRouter)

var router = new VueRouter()
router.map({
    '/visualiser': {
        component: visualiser
    },
    '/status': {
        component: status
    }
})
router.start(App, '#app')
