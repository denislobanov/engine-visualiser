"use strict";

export default class Network {
    constructor() {
        this.requestType = 'GET';
        this.contentType = 'application/json; charset=utf-8';
        this.dataType = 'json';
        this.cache = false;
    }

    // can use queue of pending requests here..

    /**
     * Make an AJAX request with @requestData parameters.
     * Required attributes of @requestData are:
     *  - url
     *  - success
     * Optional attributes:
     *  - data
     * Optional attributes with defaults:
     *  - type
     *  - contentType
     *  - dataType
     *  - cache
     * @param requestData
     */
    request(requestData) {
        $.ajax({
            type: requestData.requestType || this.requestType,
            contentType: requestData.contentType || this.contentType,
            dataType: requestData.dataType || this.dataType,
            cache: requestData.cache || this.cache,
            data: requestData.data,
            url: requestData.url,

            error: function(errorThrown) {
                console.log(errorThrown);
            },

            success: requestData.success
        });
    }
};
