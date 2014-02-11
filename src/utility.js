
/**
 * Check if specified value is number.
 * 
 * @param v
 * @returns {Boolean}
 */
function d3c_isNumber(v) {
    return typeof v === 'number';
}

/**
 * Check if specified value is string.
 * 
 * @param v
 * @returns {Boolean}
 */
function d3c_isString(v) {
    return typeof v === 'stirng';
}

/**
 * Check if specified value is function.
 * 
 * @param v
 * @returns {Boolean}
 */
function d3c_isFunction(v) {
    return typeof v === 'funciton';
}

/**
 * Check if specified value is object.
 * 
 * @param v
 * @returns {Boolean}
 */
function d3c_isObject(v) {
    return typeof v === 'object';
}

/**
 * Convert degree to radian.
 * 
 * @param deg
 * @returns {Number}
 */
function d3c_radian(deg) {
    return deg * Math.PI / 180;
}

/**
 * Visit each element of specified object and process with specified function.
 * 
 * @param obj
 * @param functor
 * @returns
 */
function d3c_each(obj, functor) {
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
            obj[k] = functor.call(obj, obj[k]);
        }
    }
    return obj;
}

/**
 * Clone an object and its properties.
 * 
 * @param obj
 *            the object will be cloned.
 * @returns an new instance of specified object.
 */
function d3c_clone(obj) {
    if (obj === null || (typeof obj) !== 'object') {
        return obj;
    }
    var temp = new obj.constructor();
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            temp[key] = d3c_clone(obj[key]);
        }
    }
    return temp;
}

/**
 * Simple copy object.
 * 
 * @param obj
 * @returns
 */
function d3c_copy(obj) {
    if (obj === null || (typeof obj) !== 'object') {
        return obj;
    }
    var temp = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            temp[key] = d3c_copy(obj[key]);
        }
    }
    return temp;
}

/**
 * Return bounding box of specified svg node.
 * 
 * @param node
 * @param refresh
 * @returns
 */
function d3c_bbox(node, refresh) {
    if (!refresh && node._bbox) {
        return node._bbox;
    }
    
    var b = (node.nodeName === 'g' || node.nodeName === 'text') ? node.getBBox() : {'x': 0, 'y': 0, 'width': 0, 'height': 0};
    node._bbox = {'x': b.x, 'y': b.y, 'width': b.width, 'height': b.height};
    return node._bbox;
}


/**
 * Merge properties of source object into target object and override.
 * 
 * @param a
 *            the target object.
 * @param b
 *            the source object.
 * @returns target object
 */
function d3c_merge(a, b) {
    if (!b) {
        return a;
    }
    if (!a) {
        return d3c_clone(b);
    }
    
    for (var prop in b) {
        if (b.hasOwnProperty(prop)) {
            if (b[prop] === null || (typeof b[prop]) !== 'object') {
                a[prop] = b[prop];
            } else {
                a[prop] = d3c_merge(a[prop], b[prop]);
            }
        }
    }
    
    return a;
}

/**
 * Merge property of source object into target object.
 * 
 * @param a
 * @param b
 * @returns {___anonymous2300_2301}
 */
function d3c_extend(a, b) {
    var k = null;
    if (!a) {
        a = {};
    }
    for (k in b) {
        if (b.hasOwnProperty(k)) {
            a[k] = b[k];
        }
    }
    return a;
}

/**
 * Define and extend class.
 * 
 * @param _Class
 * @param _pClass
 * @param _protoObj
 * @returns
 */
function d3c_extendClass(selfFunction, pClass, protoObj) {
    function constructor(container, chartContext, options) {
        // Initialize private variable set.
        this._p = {};
        
        // Init this object.
        if (this.fInit) {
            this.fInit.apply(this, arguments);
        }
        return this;
    }
    
    var newClass = selfFunction ? selfFunction : constructor;
    newClass.prototype = pClass ? new pClass() : {};
    d3c_extend(newClass.prototype, protoObj);
    newClass.prototype._super = pClass ? pClass.prototype : null;
    return newClass;
}

/**
 * Rotate a svg node.
 * <p>
 * The _mode values include start, end, middle. Middle means the x and y
 * coordinates of rotation point is at center of text. Start means the x
 * coordinate of rotation point is at start of text, y coordinate is center of
 * text. End is similar to Start.
 * 
 * @param svgNode
 * @param degree
 * @param mode
 */
function d3c_rotateNode(svgNode, degree, mode) {
    var box, cx, cy, tran, tranA, cxy;

    if (degree) {
        box = svgNode.getBBox();
        if (mode === 'auto') {
            cxy = '';
        } else {
            cx = (mode === 'start') ? box.x : (mode === 'end') ? box.x +
                    box.width : (box.x + box.width / 2);
            cy = box.y + box.height / 2;  
            cxy = ' ' + cx + ' ' + cy;
        }
        tran = svgNode.getAttribute('transform');
        if (tran) {
            tranA = tran.split(/\)/g);
            if (tranA.length) {
                tran = '';
                for (var i in tranA) {
                    if (tranA.hasOwnProperty(i)) {
                        tran += ' ' + (tranA[i].indexOf('rotate') >= 0) ? 'rotate(' +
                                degree + cxy + ')'
                                : tranA[i].trim() + ')';
                    }
                }
            }
        } else {
            tran = 'rotate(' + degree + cxy + ')';
        }
        svgNode.setAttribute('transform', tran);
    }
    return svgNode;
}

/**
 * Rotate elements of selection.
 * 
 * @param selection
 * @param degree
 * @param mode start/middle/end/auto
 */
function d3c_rotate(selection, degree, mode) {
    return selection.attr('transform', function (_d) {
        var box, cx, cy, tran = null, tranA, cxy;

        if (degree) {
            box = this.getBBox();
            if (mode === 'auto') {
                cxy = '';
            } else {
                cx = (mode === 'start') ? box.x : (mode === 'end') ? box.x +
                        box.width : (box.x + box.width / 2);
                cy = box.y + box.height / 2;  
                cxy = ' ' + cx + ',' + cy;
            }
            
            tran = this.getAttribute('transform');
            if (tran) {
                tranA = tran.split(/\)/g);
                if (tranA.length) {
                    tran = '';
                    for (var i in tranA) {
                        if (tranA.hasOwnProperty(i)) {
                            tran += ' ' + (tranA[i].indexOf('rotate') >= 0) ? 'rotate(' +
                                    degree + cxy + ')'
                                    : tranA[i].trim() + ')';
                        }
                    }
                }
            } else {
                tran = 'rotate(' + degree + cxy + ')';
            }
        }
        return tran;
    });
}

/**
 * Translate elements of selection.
 * 
 * @param selection
 * @param x
 * @param y
 */
function d3c_translate(selection, x, y) {
    if (arguments.length === 1) {
        // Return x and y of current translate.
        var transXY = [];
        selection.each(function(){
            var tran = this.getAttribute('transform');
            if (tran && tran.indexOf('translate') >= 0) {
                tran = tran.match(/translate\([0-9\s\.\-,]+\)/);
                if (tran && tran.length) {
                    tran = tran[0].match(/([0-9\.\-]+)/g);
                    if (tran && tran.length && tran.length > 1) {
                        transXY.push({'x':tran[0], 'y': tran[1]});
                    }
                }
            }
        });
        return transXY;
    }
    
    function f (x, d) {
        return typeof x === 'function' ? x(d) : x; 
    }
    return selection.attr('transform', function (d) {
        var tran = this.getAttribute('transform');
        if (tran && tran.indexOf('translate') >= 0) {
            tranA = tran.split(/\)/g);
            if (tranA.length) {
                tran = '';
                for (var i in tranA) {
                    if (tranA.hasOwnProperty(i) && tranA[i].trim() !== '') {
                        tran += ' ' + (tranA[i].indexOf('translate') >= 0) ? 'translate(' +
                                f(x, d) + ',' + f(y, d) + ')'
                                : tranA[i].trim() + ')';
                    }
                }
            }
        } else {
            tran = 'translate(' + f(x, d) + ',' + f(y, d) + ') ' + (tran || '');
        }
        return tran;
    });
}

/**
 * Convert d3chart styles to CSS styles.
 * 
 * @param d3c_style style object or style name.
 * @returns
 */
function d3c_toCssStyle(d3c_style) {
    if (typeof d3c_style === 'object') {
        for (var key in d3c_style) {
            if (d3c_style.hasOwnProperty(key)) {
                var newKey = d3c_toCssStyle(key);
                if (newKey !== key) {
                    d3c_style[newKey] = d3c_style[key];
                    d3c_style[key] = null;
                    delete d3c_style[key];
                }
            }
        }
        return d3c_style;
    } else {
        return d3c_style ? d3c_style.replace(/([A-Z])/g, function (m, s) {
            return '-' + s.toLowerCase();
        }) : d3c_style;
    }
}

/**
 * Return an unique id.
 * 
 * @returns {String}
 */
function d3c_uniqueId(_param) {
    return CHART_GLOBAL.prefix + '-' + (_param ? (_param + '-') : '') + (internalCount++) + '-' + Math.random().toString(2).slice(2);
}

var LINEAR_GRADIENT_SHORT_NAME_PARTS = {
        'L' : ['0%', '50%'],
        'R' : ['100%', '50%'],
        'T' : ['50%', '0%'],
        'B' : ['50%', '100%'],
        'LT' : ['0%', '0%'],
        'TL' : ['0%', '0%'],
        'LB' : ['0%', '100%'],
        'BL' : ['0%', '100%'],
        'RT' : ['100%', '0%'],
        'TR' : ['100%', '0%'],
        'RB' : ['100%', '100%'],
        'BR' : ['100%', '100%']
    };

/**
 * Convert gradient color options to svg gradient color paramters.
 * 
 * @param gradientOpts
 * @returns
 */
function d3c_adaptColorGradient(gradientOpts) {
    var params = gradientOpts.parameters,
        parts = null;
    if (gradientOpts.type === 'linearGradient') {
        params = params || ['0%',  '0%', '100%', '100%'];
        if (typeof params === 'string') {
            /**
             * It uses short name. The short name include L,T,R,B and mean Left
             * side, Top side, Right side and Bottom Side.
             * <p>
             * The form should be like 'L,R' or 'T,B' or 'LT,RB' and so on
             * separated with comma, the first part means start and the second
             * part means end. The short name will be convert to percent value form.
             */
            parts = params.split(',');
            params = [];
            params[0] = LINEAR_GRADIENT_SHORT_NAME_PARTS[parts[0]][0];
            params[1] = LINEAR_GRADIENT_SHORT_NAME_PARTS[parts[0]][1];
            params[2] = LINEAR_GRADIENT_SHORT_NAME_PARTS[parts[1]][0];
            params[3] = LINEAR_GRADIENT_SHORT_NAME_PARTS[parts[1]][1];
        }
        return {x1 : params[0], y1 : params[1], x2 : params[2], y2 : params[3]};
    } else if (gradientOpts.type === 'radialGradient') {
        return {cx : params[0], cy : params[1], r : params[2], fx : params[3], fy : params[4]};
    }
}

/**
 * Convert d3charts color option to HTML/CSS style.
 * 
 * @param fillValue
 * @param chartContext
 * @returns fill value object
 */
function d3c_adaptFill(fillValue, chartContext) {
    var bbox = null,
    img = null,
    id = null,
    lg = null,
    i = 0;
    if (typeof fillValue === 'function') {
        return (function (_this) {
            var args = chartContext ? d3.merge(arguments, [chartContext])
                : arguments;
            return {
                'value' : fillValue.apply(_this, args)
            };
        })(this);
    } else if (typeof fillValue === 'object') {
        if (fillValue.type === 'image') {
            bbox = this.getBBox();
            img = this.d3Sel.append('image').datum(fillValue);
            img.attr({'x': 0, 'y': 0, 'width': bbox.width, 'height': bbox.height,
            'xlink:href': fillValue.parameters && fillValue.parameters[0]});
            return {
                value : (fillValue.indexOf('url') >= 0) ? fillValue : ('#url(' + fillValue + ')'),
                imageNode : img
            };
        } else if (fillValue.type === 'linearGradient' || fillValue.type === 'radialGradient') {
            var defs = chartContext.fDefs();
            id = d3c_uniqueId(fillValue.type);
            lg = defs.append(fillValue.type).attr('id', id).attr(d3c_adaptColorGradient(fillValue));
            for (i = 0; i < fillValue.stops.length; i++) {
                lg.append('stop')
                .attr(d3c_toCssStyle({offset: fillValue.stops[i].offset || '0%', stopColor: (fillValue.stops[i].stopColor || (this.options && this.options.fill) || 'white'), stopOpacity: fillValue.stops[i].stopOpacity || 1}));
            }
            return {
                value : 'url(#' + id + ')',
                gradientNode : lg
            };
        }
    } else {
        return {
            value : fillValue
        };
    }
}

/**
 * Convert d3charts dash-style option to HTML/CSS style.
 * 
 * @param name
 * @param value
 * @param width
 *            dash width
 * @param chartContext
 * @returns
 */
function d3c_adaptDashstyle(name, value, width, chartContext) {
    var i;
    if (typeof value === 'function') {
        return (function (_this) {
            var args = chartContext ? d3.merge(arguments, [chartContext])
                    : arguments;
            return {
                'name' : name,
                'value' : value.apply(_this, args)
            };
        })(this);
    } else {
        value = value && value.toLowerCase();
        if (value === 'solid') {
            value = 'none';
        } else if (value) {
            value = value.replace('shortdashdotdot', '3,1,1,1,1,1,').replace(
                    'shortdashdot', '3,1,1,1').replace('shortdot', '1,1,')
                    .replace('shortdash', '3,1,').replace('longdash', '8,3,')
                    .replace(/dot/g, '1,3,').replace('dash', '4,3,').replace(
                            /,$/, '').split(','); // ending comma

            i = value.length;
            while (i--) {
                value[i] = pInt(value[i]) * width;
            }
            value = value.join(',');
        }

        return {
            'name' : name,
            'value' : value
        };
    }
}

/**
* Return combined border width.
* 
* @param borderStyle
* @returns {Number}
*/
function d3c_getBorderWidth(borderStyle) {
    return borderStyle.strokeWidth || borderStyle.style['stroke-width'] || borderStyle.width || 0;
}

/**
 * Convert properties of border style object to fit attribute name standard of HTML/SVG/CSS.
 * 
 * @param _borderStyle
 * @param _chartContext
 * @returns {Object}
 */
function d3c_adaptBorderStyle(borderStyle, chartContext) {
    if (typeof borderStyle === 'object') {
        // Adjust property name
        borderStyle = d3c_toCssStyle(borderStyle);
        
        // Adjust property value
        for (var k in borderStyle) {
            if (borderStyle.hasOwnProperty(k)) {
                if (k === 'roundCorner') {
                    borderStyle.rx = borderStyle.rx || borderStyle.roundCorner;
                    borderStyle.ry = borderStyle.ry || borderStyle.roundCorner;
                } else if (k === 'dashStyle') {
                    borderStyle[k] = d3c_adaptDashstyle.call(this, k, borderStyle[k], d3c_getBorderWidth(borderStyle), chartContext).value;
                } else if (k === 'stroke' || k === 'fill') {
                    borderStyle[k] = d3c_adaptFill.call(this, borderStyle[k], chartContext).value;
                } 
            }
        }
    }
    
    return borderStyle;
}

/**
 * Apply border style to a selection.
 * 
 * @param selection
 * @param borderOpts
 * @param fillOpts
 * @param chartContext
 * @param functor
 * @returns
 */
function d3c_applyBorderStyle(selection, borderOpts, fillOpts, chartContext, functor) {
    if (fillOpts.fill || fillOpts.fillOpacity || fillOpts.fillOpacity === 0) {
        borderOpts = borderOpts || {};
        if (borderOpts.enabled === false) {
            delete borderOpts.stroke;
            delete borderOpts.strokeWidth;
            delete borderOpts.strokeOpacity;
        }
        
        borderOpts.enabled = true;
        if (fillOpts.fill) {
            borderOpts.fill = fillOpts.fill;
        }
        borderOpts.fillOpacity = (fillOpts.fillOpacity === 0) ? fillOpts.fillOpacity : (fillOpts.fillOpacity || 1);
        if (borderOpts.stroke) {
            borderOpts.StrokeOpacity = (borderOpts.StrokeOpacity === 0) ? borderOpts.StrokeOpacity : (borderOpts.StrokeOpacity || 1);    
        }
    }
    
    if (functor) {
        borderOpts = functor.apply(selection, [borderOpts, chartContext]);
    }
    
    if (borderOpts && borderOpts.enabled) {
        var
        _fill = selection.style('fill'),
        _t;
        if (_fill && (_t = /url\(#[0-9a-zA-Z\-]+/i.exec(_fill))) {
            // Remove old fill definition.
            chartContext.fDefs().select(_t[0].substring(4)).remove();
        }
        _fill = selection.style('stroke');
        _t = undefined;
        if (_fill && (_t = /url\(#[0-9a-zA-Z\-]+/i.exec(_fill))) {
            // Remove old stroke definition.
            chartContext.fDefs().select(_t[0].substring(4)).remove();
        }
        
        selection.style(d3c_adaptBorderStyle.call(selection, borderOpts, chartContext));
    }
    
    return selection;
}

/**
 * Convert properties of border style object to fit attribute name standard of HTML/SVG/CSS.
 * 
 * @param fontStyleOpts
 * @param chartContext
 * @returns
 */
function d3c_adaptFontStyle(fontStyleOpts, chartContext) {
    if (typeof fontStyleOpts === 'object') {
        
        // Adjust property value.
        for (var k in fontStyleOpts) {
            if (fontStyleOpts.hasOwnProperty(k)) {
                if (k === 'stroke' || k === 'fill') {
                    fontStyleOpts[k] = d3c_adaptFill.call(this, fontStyleOpts[k], chartContext).value;
                    fontStyleOpts[k + 'Opacity'] = (fontStyleOpts[k + 'Opacity'] === undefined) ? 1 : fontStyleOpts[k + 'Opacity']; 
                } 
            }
        }
        
        // Adjust property name.

        fontStyleOpts = d3c_toCssStyle.call(this, fontStyleOpts);
    }
    
    return fontStyleOpts;
}

/**
 * Apply font style to selection.
 * @param selection
 * @param fontStyleOpts
 * @param chartContext
 * @param functor
 * @returns
 */
function d3c_applyFontStyle(selection, fontStyleOpts, chartContext, functor) {
    fontStyleOpts = functor ? functor.apply(selection, [fontStyleOpts, chartContext]) : fontStyleOpts;
    selection.style(d3c_adaptFontStyle.call(selection, fontStyleOpts, chartContext));
    return selection;
}

/**
 * Convert margin option to standard format, the returned margin option contains
 * top&right&bottom&left.
 * 
 * @param margin
 * @returns
 */
function d3c_adaptMargin(margin) {
    if (typeof margin === 'string') {
        var values = margin.split(/ /g);
        switch (values.length) {
        case 1:
            return {
                top : values[0],
                right : values[0],
                bottom : values[0],
                left : values[0]
            };
        case 2:
            return {
                top : values[0],
                right : values[1],
                bottom : values[0],
                left : values[1]
            };
        case 3:
            return {
                top : values[0],
                right : values[1],
                bottom : values[2],
                left : values[1]
            };
        case 4:
            return {
                top : values[0],
                right : values[1],
                bottom : values[2],
                left : values[3]
            };
        }
        return {
            top : 0,
            right : 0,
            bottom : 0,
            left : 0
        };
    } else {
        var m = d3c_merge({
            top : 0,
            right : 0,
            bottom : 0,
            left : 0
        }, margin);
        return m;
    }
}

/**
 * Plus values of same option between specified two objects and save to first
 * object, if first object doesn't contain any option, just add the option to
 * first object with current value.
 * 
 * @param objectA
 * @param objectB
 * @returns
 */
function d3c_plusOfObject(objectA, objectB) {
    if (!objectB) {
        return objectA;
    }
    for (var p in objectB) {
        if (objectB.hasOwnProperty(p)) {
            if (objectA[p]) {
                objectA[p] += objectB[p];
            } else {
                objectA[p] = objectB[p];
            }
        }
    }
    return objectA;
}

/**
 * Add margin's settings to a bbox object.
 * 
 * @param bbox
 * @param margin
 * @returns
 */
function d3c_plusOfMargin2BBox(bbox, margin) {
    var m = d3c_adaptMargin(margin),
        b = d3c_copy(bbox);
    b.y += m.top;
    b.x += m.left;
    b.width += m.left + m.right;
    b.height += m.top + m.bottom;
    return b;
}

/**
 * Get/set series values
 * 
* @param data data array object.
* @param prop  index or property name of value in data array.
* @param valArray values array.
*/
function _values(data, prop, valArray) {
    var type = typeof data[0],
        nameType = typeof prop,
        hasValues = (valArray !== undefined),
        result = [],
        i = 0;
    if (type === 'number' || type === 'string' || type === 'boolean') {
        // data is single dimension array with primtive value.
        if (hasValues) {
            if (nameType === 'number' && data.length >= prop) {
                data[prop] = valArray.length && valArray[0];
            } 
        } else {
            if (nameType === 'number') {
                result = (data.length >= prop && [data[prop]]) || [];
            }
        }
    } else if (type === 'array') {
        for (i = 0; i < data.length; i++) {
            if (hasValues) {
                _values(data[i], prop, valArray[i]);
            } else {
                result.concat(_values(data[i], prop) || []);
            }
        }
    } else if (type === 'object') {
        for (i = 0; i < data.length; i++) {
            if (hasValues) {
                data[i][prop] = valArray[i];
            } else {
                result.concat(data[i][prop] || []);
            }
        }
    }
    return result;
}

/**
 * Get/set series values
 * 
 * @param data data array object.
 * @param prop  index or property name of value in data array.
 * @param valArray values array.
 */
function d3c_seriesValues(data, prop, valArray) {
    if (!data.length) {
        return [];
    }

    return _values(data, prop, valArray);
}

/**
 * Return min and max of specified property in data set.
 * 
 * @param data
 * @param name
 */
function d3c_getValuesMinMax(data, prop) {
    var arr = d3c_seriesValues(data, prop);
    return arr ? d3.extent(arr) : false;
}

/**
 * Convert percent number to pure number.
 * 
 * @param numberProperty
 * @param refValue
 * @returns
 */
function d3c_adaptNumberOpt(numberProperty, refValue) {
    var r = numberProperty || 0, s = refValue || 1; 
    return (typeof r === 'number') ? (r >= 1 ? r : Math.abs(s * r)) : (r.indexOf('%') ? (parseInt(r, 0) * s / 100) : r);
}

/**
 * Returns CSS class filter names with '.'
 * 
 * @param className
 * @returns {String}
 */
function d3c_classFilterNames(className) {
    return '.' + className.replace(/\s/g, '.');
}

/**
 * Save map of series type to creator function.
 */
var SERIES_CREATOR_SET = {};


/**
 * Register series creator.
 * 
 * @param seriesType
 * @param creatorCallback
 */
function d3c_registerSeriesCreator(seriesType, creatorCallback) {
    SERIES_CREATOR_SET[seriesType] = creatorCallback;
}

/**
 * Create series instance according to series type.
 * 
 * @param eContainer
 * @param chartContext
 * @param serieOpts
 * @returns
 */
function d3c_createSeries(eContainer, chartContext, serieOpts) {
    return SERIES_CREATOR_SET[serieOpts.type] && SERIES_CREATOR_SET[serieOpts.type].call(this, eContainer, chartContext, serieOpts);
}

/**
 * Merge chart options.
 * 
 * @param a
 * @param b
 * @returns
 */
function d3c_mergeChartOptions(a, b, ps) {
    var prop = null, i, t;
    if (!b) {
        return a;
    }
    if (!a) {
        return d3c_clone(b);
    }
    
    ps = ps || [];
    for (prop in b) {
        if (b.hasOwnProperty(prop)) {
            ps.push(prop);
            if (b[prop] === null || (typeof b[prop]) !== 'object') {
                a[prop] = b[prop];
            } else if (prop === 'series') {
                if (!(a[prop] instanceof Array) && b[prop] instanceof Array) {
                    t = a[prop];
                    a[prop] = [];
                    i = b[prop].length;
                    while (i--) {
                        if (t[b[prop][i].type + 'Series']) {
                            a[prop][i] = d3c_mergeChartOptions(d3c_clone(t[b[prop][i].type + 'Series']), b[prop][i], ps);
                        } else {
                            a[prop][i] = d3c_clone(b[prop][i]);
                        }
                    }
                } else if(a[prop] instanceof Array && !(b[prop] instanceof Array)) {
                    i = a[prop].length;
                    while (i--) {
                        t = a[prop];
                        if (b[prop][t.type + 'Series']) {
                            a[prop][i] = d3c_mergeChartOptions(a[prop][i], b[prop][t.type + 'Series'], ps);
                        }
                    }
                }
                
            } else if (prop === 'xAxis' && !a[prop]) {
                a[prop] = d3c_clone(DefaultXAxisOptions);
                a[prop] = d3c_mergeChartOptions(a[prop], b[prop], ps);
            } else if (prop === 'yAxis' || prop === 'bands' || prop === 'ranges' || prop === 'data' || prop === 'targets') {
                if (!a[prop]) {
                    if (prop === 'yAxis') {
                        a[prop] = d3c_clone(DefaultYAxisOptions);
                    } else if (prop === 'bands') {
                        // TODO ...  
                        a[prop] = d3c_clone(DefaultBandsOptions[ps[ps.length - 1]] || {});
                    } else if (prop === 'ranges') {
                        a[prop] = d3c_clone(DefaultRangesOptions[ps[ps.length - 1]] || {});
                    } else if (prop === 'targets') {
                        if (ps.length >= 2 && ps[ps.length - 2] === 'series') {
                            a[prop] = d3c_clone(DefaultTargetsOptions[a.type + 'Series'] || {});
                        }
                    }
                }
                if (!a[prop]) {
                    a[prop] = d3c_clone(b[prop]);
                } else if (!(a[prop] instanceof Array) && b[prop] instanceof Array) {
                    t = a[prop];
                    a[prop] = [];
                    i = b[prop].length;
                    while (i--) {
                        a[prop][i] = d3c_clone(t);
                    }
                    d3c_mergeChartOptions(a[prop], b[prop], ps);
                } else {
                    a[prop] = d3c_mergeChartOptions(a[prop], b[prop], ps);
                }
            } else {
                a[prop] = d3c_mergeChartOptions(a[prop], b[prop], ps);
            }
            
            ps.pop();
        }
    }
    
    return a;
}

/**
 * Create a d3c path object, call push function to add paths, and call toString function return entire path string.
 * 
 * @returns
 */
function d3c_path() {
    var paths = [], i = 0;
    
    function path() {
        return path.toString();
    }
    
    path.push = function (_type, coordinates) {
        paths.push(_type);
        i = 1;
        while (i < arguments.length) {
            paths.push(arguments[i]);
            i++;
        }
        return path;
    };
    
    path.toString = function () {
        return paths.join(' ');
    };
    
    return path;
}

/**
 * Create a d3c symbol object
 * 
 * @returns
 */
function d3c_symbol() {
    var s = d3.svg.symbol();
    
    function symbol() {
        return s();
    }
    
    symbol.type = function () {
        if (!arguments.length) {
            return s.type();
        } else {
            s.type(arguments[0]);
        }
        return symbol;
    };
    
    symbol.size = function () {
        if (!arguments.length) {
            return s.size();
        } else {
            s.size(arguments[0]);
        }
        return symbol; 
    };
    
    return symbol;
}

/**
 * Calculate proper scale domain according to specified values.
 * 
 * @param axisOpts
 * @param rangesOpts
 * @param values
 * @returns
 */
function d3c_calculateScaleDomain(axisOpts, rangesOpts, values) {
    function getScale(_v) {
        var t = Math.abs(_v), i = -1;
        if (t === 1) {
            return 0;
        } else if (t > 1) {
            while (t > 1) {
                t = t / 10;
                i++;
            }
            return Math.pow(10, i);
        } else if (t < 1) {
            while (t < 1) {
                t = t * 10;
                i++;
            }
            return Math.pow(10, -i);
        }
    }
    
    var extent = d3.extent(values), scale = getScale(extent[0]), i = 0;
    if (axisOpts.tick.scale && axisOpts.tick.scale.min !== undefined) {
        extent[0] = axisOpts.tick.scale.min;
    } else {
        extent[0] = scale === 0 ? 0 : (scale > 1 ? (extent[0] - extent[0] % scale) - scale : Math.floor((extent[0] - scale) / scale) * scale);
    }
    if (axisOpts.tick.scale && axisOpts.tick.scale.max !== undefined) {
        extent[1] = axisOpts.tick.scale.max;
    } else {
        extent[1] = scale === 0 ? 0 : (scale > 1 ? (extent[1] - extent[0] % scale) + scale : Math.floor((extent[0] + scale) / scale) * scale);
    }
    
    if (axisOpts.bands) {
        for (i in axisOpts.bands) {
            extent[0] = axisOpts.bands[i].x1 < extent[0] ? axisOpts.bands[i].x1 : extent[0];
            extent[1] = axisOpts.bands[i].x2 > extent[1] ? axisOpts.bands[i].x2 : extent[1];
        }
    }
    
    if (rangesOpts) {
        for (i in rangesOpts) {
            extent[0] = rangesOpts[i].x1 < extent[0] ? rangesOpts[i].x1 : extent[0];
            extent[1] = rangesOpts[i].x2 > extent[1] ? rangesOpts[i].x2 : extent[1];
        }
    }
    
    if (axisOpts.reverse === true) {
        i = extent[0];
        extent[0] = extent[1];
        extent[1] = i;
    }
    return extent;
    
}

//function d3c_convertBandsOpts(_bandsOpts, _scale, _domainExtent, _originBounds) {
//    return d3c_each(_bandsOpts, function (_d) {
//        _d.x1 = _scale((_d.x1 === undefined) ? _domainExtent[0] : _d.x1) - _originBounds.x;
//        _d.x2 = _scale((_d.x2 === undefined) ? _domainExtent[1] : _d.x2) - _originBounds.x;
//        _d.y1 = 0;
//        _d.y2 = _originBounds.height;
//        return _d;
//    });
//}
//
//function d3c_convertRangesOpts(_rangesOpts, _scale, _domainExtent, _originBounds) {
//    return d3c_each(_rangesOpts, function (_d) {
//        _d.x1 = _scale((_d.x1 === undefined) ? _domainExtent[0] : _d.x1) - _originBounds.x;
//        _d.x2 = _scale((_d.x2 === undefined) ? _domainExtent[1] : _d.x2) - _originBounds.x;
//        _d.y1 = d3c_radian(_d.y1, _originBounds.height);
//        _d.y2 = d3c_radian(_d.y2, _originBounds.height);
//        return _d;
//    });
//}

/**
 * Create marker group according to specified marke options.
 * 
 * @param parentUpdate
 * @param markerOpts
 * @param sizeRef
 * @param chartContext
 * @param borderFunctor
 * @returns
 */
function d3c_createMarker(parentUpdate, markerOpts, sizeRef, chartContext, borderFunctor) {
    var
    size = d3c_adaptNumberOpt(markerOpts.size, sizeRef),
    paths = d3c_symbol().type(markerOpts.type).size(size * size),
    markerUpdate = parentUpdate.selectAll(CN.FN.marker).data([markerOpts]);
    markerUpdate.enter().append('path').attr('class', CN.marker);
    markerUpdate.attr('d', paths());
    d3c_applyBorderStyle(markerUpdate, markerOpts.border, markerOpts, chartContext, borderFunctor);
    return markerUpdate;
}

/**
 * Create label group according to specified label options.
 * 
 * @param parentUpdate
 * @param labelOpts
 * @param text
 * @param chartContext
 * @returns
 */
function d3c_createLabel(parentUpdate, labelOpts, text, chartContext) {
    var
    labelUpdate = parentUpdate.selectAll(CN.FN.label).data([labelOpts]);
    labelUpdate = (labelUpdate.enter().append('g').attr('class', CN.label), labelUpdate),
    border = labelUpdate.selectAll(CN.FN.border).data([labelOpts]),
    border = (border.enter().append('rect').attr('class', CN.border), border),
    textUpdate = labelUpdate.selectAll('text').data([labelOpts.text]);
    textUpdate = (textUpdate.enter().append('text').text(text || labelOpts.text), textUpdate),
    bbox = null, textAnchor = labelOpts.font && (labelOpts.font.textAnchor || labelOpts.font['text-anchor']);
    
    d3c_applyBorderStyle(border, labelOpts.border, labelOpts, chartContext);
    d3c_applyFontStyle(textUpdate, labelOpts.font, chartContext).attr('dy', '.8em');
    
    bbox = d3c_bbox(labelUpdate.node());
    border.attr({'x': (textAnchor === 'middle' ? -(bbox.width / 2) : (textAnchor === 'end' ? -bbox.width : 0)), 'y': 0, 'width': bbox.width, 'height': bbox.height});
    
    return labelUpdate;
}

/**
 * Create range according to specified options.
 * 
 * @param rangeUpdate
 * @param opts
 * @param scale
 * @param originBounds
 * @param chartContext
 * @returns
 */
function d3c_createRange(rangeUpdate, opts, scale, originBounds, chartContext) {
    var
    domain = scale.domain(),
    range = scale.range(),
    x1 = opts.x1 ? opts.x1 : domain[0],
    x2 = opts.x2 ? opts.x2 : domain[1],
    y1 = opts.y1 ? d3c_adaptNumberOpt(opts.y1, originBounds.height) : 0,
    y2 = opts.y2 ? d3c_adaptNumberOpt(opts.y2, originBounds.height) : originBounds.height,
    r = opts.round,
    type = (opts.type === 'line') ? 'line' : ((r > 0 && (x1 === domain[0] || x2 === domain[1])) ? 'path': 'rect'),
    leftRound = (r > 0 && x1 === domain[0] && y1 === 0 && y2 === originBounds.height),
    rightRound = (r > 0 && x2 === domain[1] && y1 === 0 && y2 === originBounds.height),
    marker = null,
    label = null,
    labelBBox = null,
    rangeBorder = rangeUpdate.selectAll(CN.FN.border).data([opts]);
    rangeBorder.enter().append(type).attr('class', CN.border);
    
    x1 = scale(x1);
    x2 = scale(x2);
    if (type === 'line') {
        rangeBorder.attr({'x1': x1, 'x2': x2, 'y1': y1, 'y2' : y2});
    } else if (type === 'rect') {
        rangeBorder.attr({'x': x1, 'y': y1, 'width': x2 - x1, 'height': y2 - y1});
    } else if (type === 'path') {
        var path = (leftRound ? ('M' + x1 + ' ' + (y1 + r) + ' a' + r + ',' + r + ' 0 0,1 ' + r + ',' + (-r)) : (' M' + x1 + ' ' + y1 + ' l' + r + ' ' + 0))
                + ' L' + (x2 - r) + ' ' + y1
                + (rightRound ? (' a' + r + ',' + r + ' 0 0,1 ' + r + ',' + r) : (' l' + r + ' ' + 0 + ' l' + 0 + ' ' + r))
                + ' L' + x2 + ' ' + (y2 - r)
                + (rightRound ? (' a' + r + ',' + r + ' 0 0,1 ' + (-r) + ',' + r) : (' l' + 0 + ' ' + r + ' l' + (-r) + ' ' + 0))
                + (leftRound ? (' L' + (x1 + r) + ' ' + y2 + ' a' + r + ',' + r + ' 0 0,1 ' + (-r) + ',' + (-r)) : (' L' + x1 + ' ' + y2 + ' l' + 0 + ' ' + (-r)))
                + ' Z';
        rangeBorder.attr('d', path);
    }
    d3c_applyBorderStyle(rangeBorder, opts.border, opts, chartContext);
    
    if (opts.marker && opts.marker.enabled !== false) {
        marker = d3c_createMarker(rangeUpdate, opts.marker, originBounds.height, chartContext);
        d3c_translate(marker, x1, (opts.markerPosition === 'below') ?  y2 : y1);
    }
    
    if (opts.label && opts.label.enabled !== false) {
        label = d3c_createLabel(rangeUpdate, opts.label, (opts.label.text ? opts.label.text : (x2 ? ('[' + x1 + ',' + x2 + ']') : x1)), chartContext);
        labelBBox = label.node().getBBox();
        var y = 0;
        if (marker) {
            // Label position is relative to marker.
            y += (opts.markerPosition === 'below') ? y2 : y1;
            y += (opts.labelPosition === 'below') ? opts.marker.size / 2 : (-opts.marker.size - labelBBox.height);
        } else {
            // No marker, label position is relative to top or bottom of gadget
            y = (opts.labelPosition === 'below') ? y2 : y1 - labelBBox.height;
        }
        d3c_translate(label, x1, y);
    }
    
    return rangeUpdate;
}

/**
 * Create ranges.
 * 
 * @param _rangesUpdate
 * @param _scale
 * @param _originBounds
 * @param _context
 */
function d3c_createRanges(rangesUpdate, scale, originBounds, context) {
    rangesUpdate.each(function (rangeOpts, i) {
        return d3c_createRange(d3.select(this), rangeOpts, scale, originBounds, context);
    });
    return rangesUpdate;
}

/**
 * Create band.
 * 
 * @param bandUpdate
 * @param opts
 * @param scale
 * @param originBounds
 * @param context
 * @returns
 */
function d3c_createBand(bandUpdate, opts, scale, originBounds, context) {
    return d3c_createRange(bandUpdate, opts, scale, originBounds, context);
}

/**
 * Create bands.
 * 
 * @param bandsUpdate
 * @param opts
 * @param scale
 * @param originBounds
 * @param context
 * @returns
 */
function d3c_createBands(bandsUpdate, scale, originBounds, context) {
    return d3c_createRanges(bandsUpdate, scale, originBounds, context);
}

/**
 * The function create a border according to options, but not set border bounds.
 * 
 * @param group
 * @param opts
 * @param chartContext
 * @param functor
 * @returns
 */
function d3c_createBorder(group, opts, chartContext, functor) {
    var border = group.selectAll(CN.FN.border).data([opts]);
    border.enter().append('rect').attr('class', CN.border);
    d3c_applyBorderStyle(border, opts.border, opts, chartContext, functor);
    return border;
}

/**
 * Return format function.
 * 
 * @param _value
 * @param _pattern
 * @returns
 */
function d3c_format(_value, _pattern) {
    // TODO ... Will be implemented futrue.
    return _value;
}
