"use strict";

ENGINE.Network = {
    _defaults: {
        requestType: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        //async: true,
        cache: false
    },

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
    request: function(requestData) {
        $.ajax({
            type: requestData.requestType || this._defaults.requestType,
            contentType: requestData.contentType || this._defaults.contentType,
            dataType: requestData.dataType || this._defaults.dataType,
            cache: requestData.cache || this._defaults.cache,
            data: requestData.data,
            url: requestData.url,

            error: function(errorThrown) {
                console.log(errorThrown);
            },

            success: requestData.success
        });
    }
};