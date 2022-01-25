(function($) {
    'use strict';
    getData()
function getData()
{
    isLoading();
    $.ajax({
        type: 'GET',
        url: `../api/import-supplier/add`,
        headers: {
            token: ACCESS_TOKEN,
        },
        data: null,
        cache: false,
        success: function (data) {
            isLoading(false);
            
        },
        error: function (data) {
            errAjax(data) 
        }
    })
}


})(jQuery);