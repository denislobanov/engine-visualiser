"use strict";

ENGINE.API = {
    _defaults: {
        requestType: 'GET',
        dataType: 'jsonp',
        //async: true,
        cache: false
    },

    // can use queue of pending requests here..

    request: function(requestData) {
        $.ajax({
            type: requestData.requestType || this._defaults.requestType,
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