/**
 * 
 */
(function () {
    var NS_D3CHARTS = null;
    if (!arguments.length) {
        NS_D3CHARTS = window.d3charts = window.d3charts || {};
    } else {
        if (typeof arguments[0] === 'object') {
            NS_D3CHARTS = arguments[0]; 
        } else {
            var array = arguments[0].split('.'),
                namespace = window;
            for (var i = 0; i < array.length; i++) {
                if (!namespace[array[i]]) {
                    namespace[array[i]] = {};
                    namespace = namespace[array[i]];
                }
            }
            NS_D3CHARTS = window[array[0]];
        }
    } 
    
