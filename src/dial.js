/**
 * 
 * 
 * This class references implementation of {@link http://iop.io/js/iopctrl.js}
 *  
 */

var DefaultDialSeriesOptions = {
    type: 'dial',
    startAngle: -90, // 
    endAngle: 90,
    // fill:'',
    fillOpacity: 0,
    border: {
        enabled: false,
        stroke: 'white',
        strokeOpacity: 0,
        strokeWidth: 0
    },
    dialArc: {
        enabled: true,
        radius: '80%', // percent value of min value of container's width and height.
        innerRadius: '70%', // Same with radius, 
//        fill: 'white',
        fillOpacity: 0,
        border: {
            enabled: false,
            stroke: 'white',
            strokeOpacity: 1e-6,
            strokeWidth: 0
        }
    },
    value: {
        enabled: false,
        font: {
        },
//      fill:,
        fillOpacity: 0,
        border: {
            
        }
    },
    ranges: [
//             {
//          name:,
//        startValue:,
//        endValue:,
//        innerRadius:'30%', // percent value of dial radius.
//        radius:'70%',   // percent value of dial radius.
//        fill,
//          fillOpacity,
//        border:{}
//    }
],
    indicator: {
        fill: 'red',
        fillOpacity: 1,
        body: {
            headRadius: '80%',
            headSize: '1%',
            pivotSize: '5%',
            tailRadius: '20%',
            tailSize: '2%',
            fill: 'red',
            fillOpacity: 1,
            border: {
                
            }
        },
//        headMarker: {
//            enabled: false,
//            type: 'arrow',//
//            size: 4,
//            fill: 'black',
//            fillOpacity: 1,
//            border: {}
//        },
//        tailMarker: {
//            enabled: false,      
//            type: 'circle' ,//
//            size: 4,
//            fill:'black',
//            fillOpacity:1,
//            border:{}
//        },
        pivotMarker: {
            enabled: true,
            type: 'circle',
            size: '5%', // percent of radius
            fill: 'black',
            fillOpacity: 1,
            border: {
                stroke: 'red',
                strokeWidth: '5%'
            }
        }
    }
};

// Register dial series default options.
DefaultSeriesOptions.dialSeries = DefaultDialSeriesOptions;

// Register dial series creator.
d3c_registerSeriesCreator('dial', function (_container, _chartContext, _opts) {
    // Copy corresponding axis.
    _opts.axis = d3c_clone(_chartContext.jointOpts.chart.yAxis[_opts.axisIndex || 0]);
    return new DialSeries(_container, _chartContext, _opts);
});

var DialSeries = d3c_extendClass(null, Element, {
    type: 'dial',
    _CLASS_NAMES: CN.dialSeries + ' ' + CN.series,
    eAxis: null,
    dialArc: null,
    indicatorUpdate: null,
    valueLabel: null,
    ranges: [],
    cx: 0,
    cy: 0,
    pPointerUpdate: null,
    pRange: null,
    pExtent: null,
    pInvert: null,
    pComp: null,
    pCursorArc: null,
    pCursorUpdate: null,
    pCurrentValue: null,
    pCurrentRad: null,
    pLastEvent: null,
    pOnValueChanged: null,
    pLastAngle: null,
    arcFactor: 0.5,
    _fRender: function () {
        var 
        _this = this,
        chartContext = this.chartContext,
        opts = this.options,
        indicatorOpts = opts.indicator,
        valueOpts = opts.value,
        rangesOpts = opts.ranges,
        x = opts.x,
        y = opts.y,
        width = opts.width,
        height = opts.height,
        radius = (opts.dialArc.radius = d3c_adaptNumberOpt(opts.dialArc.radius, d3.extent([width / 2, height / 2])[0])), 
        innerRadius = (opts.dialArc.innerRadius = d3c_adaptNumberOpt(opts.dialArc.innerRadius || opts.radius, radius)),
        cx = (this.cx = width / 2),
        cy = (this.cy = height / 2),
        d3Sel = null,
        eAxis = this.eAxis;
        
        // Save radius and inner radius to options.
        opts.dialArc.radius = radius;
        opts.dialArc.innerRadius = innerRadius;
        
        // Create axis. 
        eAxis = this.eAxis = new ArcAxis(this, chartContext, opts).fX(cx).fY(cy);
        this.eAxis.fScale().range([d3c_radian(opts.startAngle), d3c_radian(opts.endAngle)]);
        
        this.pRange = d3c_dial_scaleRange(eAxis.fScale());
        this.pExtent = d3c_dial_scaleExtent(eAxis.fScale());
        this.pInvert = (this.pRange[0] > this.pRange[1]) ? true : false;
        this.pComp = 2 * Math.PI - Math.abs(this.pRange[1] - this.pRange[0]);
        this.pComp = this.pComp < 0 ? 0 : this.pComp;
                
        // Create dial selection.
        d3Sel = this.d3Sel = this.d3Sel || this.eContainer.d3Sel.append('g').datum(opts).attr('class', this.fClassNames());
        d3c_translate(d3Sel, x || 0, y || 0);
        
        // Render dial border and background.
        var border = d3Sel.append('circle').attr('class', CN.border).attr({'cx': cx, 'cy':
            cy, 'r': radius}).style({'fill-opacity': 1e-6});
        d3c_applyBorderStyle(border, opts.border, opts, chartContext);
        
        // Render dialArc.
        var 
        arc = d3Sel.selectAll(CN.FN.dialArc).data([opts]),
        arcUpdate = (arc.enter().append('g').attr('clsss', CN.dialArc), d3.transition(arc));
        
        this.dialArc = arcUpdate;
        d3c_translate(arcUpdate, cx, cy);
        arcUpdate.append('path').attr('class', 'lane').style('fill-opacity', 1e-6).attr('d', d3.svg.arc().
                startAngle(this.pExtent[0]).endAngle(this.pExtent[1]).innerRadius(innerRadius).outerRadius(radius));
        this.pCursorArc = d3.svg.arc().startAngle(this.pRange[0]).endAngle(this.pRange[1]).innerRadius(innerRadius).outerRadius(radius);
        arcUpdate.append('path').attr('class', 'cursor').style('fill-opacity', 1e-6).attr('d', this.pCursorArc);
        this.pCursorUpdate = arcUpdate.selectAll('.cursor');
        d3c_applyBorderStyle(arcUpdate.selectAll('path'), opts.dialArc.border, opts.dialArc, chartContext);
        
        // Create ranges
        var
        b = d3Sel.append('g').attr('class', CN.ranges).selectAll(CN.FN.range).data(rangesOpts),
        rangesUpdate = (b.enter().append('g').attr('class', CN.range), d3.transition(b)),
        rangesExit = d3.transition(b.exit()).style("fill-opacity", 1e-6).remove();

        // Render axis
        eAxis.fRender();
        
        // Render ranges until axis is rendered to get right scale domain for range rendering. 
        d3c_translate(rangesUpdate, cx, cy).each(function (rangeOpts, i){
            var rangePath = d3.select(this).append('path').
                attr('class', CN.range + ' ' + (rangeOpts.name || i)).
                attr('d', d3.svg.arc().startAngle(d3c_dial_convert(eAxis.fScale(), rangeOpts.startValue)).
                          endAngle(d3c_dial_convert(eAxis.fScale(), rangeOpts.endValue)).
                          innerRadius((rangeOpts.innerRadius = d3c_adaptNumberOpt(rangeOpts.innerRadius, radius))).
                          outerRadius((rangeOpts.radius = d3c_adaptNumberOpt(rangeOpts.radius, radius))));
            // Set border
            d3c_applyBorderStyle(rangePath, rangeOpts.border, rangeOpts, chartContext);
        });
        
        // Render value
        
        // Compose indicator and render indicator
        this.pPointerUpdate = (function(){
            var
            indicator = d3Sel.selectAll(CN.FN.indicator).data([indicatorOpts]),
            indicatorUpdate = (indicator.enter().append('g').attr('class', CN.indicator), d3.transition(indicator)),
            ib = indicatorOpts.body,
            ih = indicatorOpts.headMarker,
            ip = indicatorOpts.pivotMarker,
            it = indicatorOpts.tailMarker,
            pointerUpdate,
            paths = d3c_path(),
            bodyNode = null,
            headNode = null,
            tailNode = null,
            pivotNode = null;
            
            function borderFunctor(_borderOpts, chartContext) {
                (_borderOpts && _borderOpts.strokeWidth) ? _borderOpts.strokeWidth = (_borderOpts.strokeWidth = d3c_adaptNumberOpt(_borderOpts.strokeWidth, radius)) : null;
                return _borderOpts;
            };
            
            ib.headRadius = d3c_adaptNumberOpt(ib.headRadius, radius);
            ib.headSize = d3c_adaptNumberOpt(ib.headSize, radius);
            ib.pivotSize = d3c_adaptNumberOpt(ib.pivotSize, radius);
            ib.tailRadius = d3c_adaptNumberOpt(ib.tailRadius, radius);
            ib.tailSize = d3c_adaptNumberOpt(ib.tailSize, radius);
            
            // Create pointer group.
            pointerUpdate = d3c_translate(indicatorUpdate, cx, cy).append('g').attr('class', CN.pointer);
            if (indicatorOpts.fill) {
                pointerUpdate.style({'fill': indicatorOpts.fill || 'red', 'fill-opacity': indicatorOpts.fillOpacity || 1e-6});    
            }
            
            // render pointer body
            paths.push('M', -ib.pivotSize / 2, 0);
            paths.push('L', -ib.headSize / 2, -ib.headRadius);
            paths.push('L', ib.headSize / 2, -ib.headRadius);
            paths.push('L', ib.pivotSize / 2, 0);
            paths.push('L', ib.tailSize / 2, ib.tailRadius);
            paths.push('L', -ib.tailSize / 2, ib.tailRadius);
            paths.push('Z');
            bodyNode = pointerUpdate.append('path').datum(ib).attr('class', 'body').attr('d', paths());;
            d3c_applyBorderStyle(bodyNode, ib.border, ib, chartContext);
            
            // render pivot
            if (ip && ip.enabled) {
                ip.size = d3c_adaptNumberOpt(ip.size, radius);
                paths = (typeof ip.type === 'function') ? ip.type.call(_this, ip) : d3c_symbol().type(ip.type).size(ip.size * ip.size);
                pivotNode = pointerUpdate.append('path').datum(ip).attr('class', 'pivot').attr('d', paths());
                d3c_applyBorderStyle(pivotNode, ip.border, ip, chartContext, borderFunctor);
            }
            
            // render head
            if (ih && ih.enabled) {
                ih.size = d3c_adaptNumberOpt(ih.size, radius);
                paths = (typeof ih.type === 'function') ? ih.type.call(_this, ih) : d3c_symbol().type(ih.type).size(ih.size * ih.size);
                headNode = pointerUpdate.append('path').datum(ih).attr('class', 'head').attr('d', paths());
                d3c_translate(headNode, 0, -ib.headRadius);
                d3c_applyBorderStyle(headNode, ih.border, ih, chartContext, borderFunctor);
            }
            
            // render tail
            if (it && it.enabled) {
                it.size = d3c_adaptNumberOpt(it.size, radius);
                paths = (typeof it.type === 'function') ? it.type.call(_this, it) : d3c_symbol().type(it.type).size(it.size * ih.size);
                tailNode = pointerUpdate.append('path').datum(it).attr('class', 'tail').attr('d', paths());
                d3c_translate(tailNode, 0, ib.tailRadius);
                d3c_applyBorderStyle(tailNode, it.border, it, chartContext, borderFunctor);
            }
            
//            this.pPointerUpdate.append("path").attr("d", "M0 " + 0.2 * radius + " L 0 " + -1.05 * radius + "");
//            this.pPointerUpdate.append("circle").attr("r", 0.03 * radius);
            
            return pointerUpdate;
            
        })();
        
        
        d3c_rotate(this.pPointerUpdate, 180 * this.pRange[0] / Math.PI, 'auto');
        
        //this.fMovePointer(d3c_dial_invert(eAxis.fScale(), this.pRange[0]), 1000);
        this.fMovePointer(d3c_seriesValues(opts.data, 0)[0], 1000);
    },
    fMovePointer: function(_value, _td) {
        var _this = this, defTD = 1000;
        // Save value to options.
        d3c_seriesValues(_this.options, 0, [_value]);
        if(_value == _this.pCurrentValue) return;

        var rad = d3c_dial_convert(_this.eAxis.fScale(), _value);
        var startRad = (_this.pCurrentRad === null || _this.pCurrentRad === undefined || isNaN(_this.pCurrentRad)) ?  _this.pRange[0] : _this.pCurrentRad;
        
        _this.pCursorUpdate.transition()
            .duration(_td || defTD)
            .delay(0)
            .ease('cubic-out')
            .attrTween("d", function() {
                
                return function(step) {
                    _this.pCurrentRad = startRad + (rad - startRad) * step;
                    _this.pCurrentValue = d3c_dial_invert(_this.eAxis.fScale(), _this.pCurrentRad);
                    
//                    var now = new Date().getTime();
//                    if(pOnValueChanged && (step==1 || (pLastEvent || 0) + minEventInterval < now)) {
//                        pOnValueChanged(pCurrentValue, step==1);
//                        pLastEvent=now;
//                    }
                    
                    if(_this.pComp != 0) {
                        _this.pPointerUpdate.attr("transform", "rotate(" + 180 * _this.pCurrentRad / Math.PI + ")");
                    }
                    return _this.pCursorArc.endAngle(_this.pCurrentRad)();
                };
            })
            .each(function() {
                if(_this.pComp == 0) {
                    d3.transition(_this.pPointerUpdate)
                        .duration(_td || defTD)
                        .delay(0)
                        .ease('cubic-out')
                        .attr("transform", "rotate(" + 180 * rad / Math.PI + ")");
                }
            });
    },
    fAxisOpts: function() {
        if (!arguments) {
             return this.options.axis;
        } else {
            this.options.axis = arguments[0];
            return this.fApplyChange(this, fAxisOpts);
        }
    },
    fData: function() {
        if (!arguments) {
            return this.options.data;
        } else {
            this.options.data = arguments[0];
            return this.fApplyChange(this, fData);
        }
    }
}); 

var ArcAxis = d3c_extendClass(null, Element, {
    _CLASS_NAMES: CN.axis,
    scale: null,
    fInit: function () {
        this._super.fInit.apply(this, arguments);
        this.scale = d3.scale.linear();
    },
    _fRender: function () {
        var 
        opts = this.options,
        axisOpts = opts.axis,
        labelOpts = axisOpts.label,
        tickOpts = axisOpts.tick,
        scaleOpts = tickOpts.scale,
        chartContext = this.chartContext,
        scale = this.scale,
        x = opts.x,
        y = opts.y,
        radius = opts.dialArc.radius,
        innerRadius = opts.dialArc.innerRadius,
        orient = axisOpts.orient,
        tickMajorSize = (tickOpts.major.size = d3c_adaptNumberOpt(tickOpts.major.size, radius)),
        tickMinorSize = (tickOpts.minor.size = d3c_adaptNumberOpt(tickOpts.minor.size, radius)),
        tickPadding = (tickOpts.padding = d3c_adaptNumberOpt(tickOpts.padding, radius)),
        tickNumbers  = opts.axis.tick.scale.stepNumber,
        tickValues = null,
        axisLabelFormat = axisOpts.format,
        tickSubdivide = tickOpts.minor.count || 3, 
        startRad = d3c_radian(opts.startAngle),
        endRad = d3c_radian(opts.endAngle),
        normalize = axisOpts.label.normalize,
        extent = null,
        d3Sel = null;
        
        // Create scale
        var value = d3c_seriesValues(opts.data, 0);
        value = value.length ? value[0] : 0;
        if (scaleOpts.min === undefined && scaleOpts.max === undefined) {
            scaleOpts.min = value / 10;
            scaleOpts.max = value + value - scaleOpts.min;
        }
        scaleOpts.min = (scaleOpts.min === undefined) ? value - Math.abs(scaleOpts.max - value) : scaleOpts.min;
        scaleOpts.max = (scaleOpts.max === undefined) ? value + Math.abs(value - scaleOpts.min) : scaleOpts.max;
        
        this.scale.domain([scaleOpts.min, scaleOpts.max]).range([startRad, endRad]);
        extent = d3c_dial_scaleExtent(scale);
        tickNumbers = (!tickNumbers && scaleOpts.stepInterval) ? ((extent[1] - extent[0]) / scaleOpts.stepInterval) : (tickNumbers || 10);
        
        // Create selection.
        var
        a = this.eContainer.d3Sel.selectAll(d3c_classFilterNames(this.fClassNames())).data([opts]),
        axisUpdate = (a.enter().append('g').attr('class', this.fClassNames()), d3.transition(a));
        d3Sel = this.d3Sel = this.d3Sel || d3c_translate(axisUpdate, x, y);
        
        // Create axis
        (function(){
            var ticks = tickValues ? tickValues : (scale.ticks ? scale.ticks.apply(scale, [tickNumbers]) : scale.domain()),
                    tickLabelFormat = axisLabelFormat ? axisLabelFormat : (scale.tickFormat ? scale.tickFormat.apply(scale, [tickNumbers]) : String);
            ticks = tickNumbers < 3 ? d3.extent(ticks) : ticks; 
            
            var subticks = d3c_dial_axisSubdivide(scale, ticks, tickSubdivide),
                subtick = d3Sel.selectAll(CN.FN.tick + CN.FN.minor).data(subticks, String),
                minorStrokeStyle = {'stroke': d3c_adaptFill(tickOpts.minor.stroke, chartContext).value, 'stroke-opacity': tickOpts.minor.strokeOpacity, 'stroke-width': tickOpts.minor.strokeWidth},
                subtickEnter = subtick.enter().insert('line', CN.FN.tick).attr('class', CN.tick + ' ' + CN.minor).style(minorStrokeStyle),
                subtickExit = d3.transition(subtick.exit()).style({'stroke-opacity' : 1e-6}).remove(),
                subtickUpdate = d3.transition(subtick).style(minorStrokeStyle);
             
            var tick = d3Sel.selectAll(CN.FN.tick + CN.FN.major).data(ticks, String),
                majorStrokeStyle = {'stroke': d3c_adaptFill(tickOpts.major.stroke, chartContext).value, 'stroke-opacity': tickOpts.major.strokeOpacity, 'stroke-width': tickOpts.major.strokeWidth},
                tickEnter = tick.enter().insert('g', CN.FN.domain).attr('class', CN.tick + ' ' + CN.major),
                tickExit = d3.transition(tick.exit()).style('stroke-opacity', 1e-6).remove(),
                tickUpdate = d3.transition(tick),
                tickTransform = null;
            
            var path = d3Sel.selectAll(CN.FN.domain).data([0]),
                pathUpdate = (path.enter().append('path').attr('class', CN.domain), d3.transition(path));
            
            var scale1 = scale.copy(), scale0 = this.__chart__ || scale1;
            this.__chart__ = scale1;
            tickEnter.append('line').style(majorStrokeStyle);
            tickEnter.append('text');
            var tickLineEnter = tickEnter.select('line'),
                tickLineUpdate = tickUpdate.select('line').style(majorStrokeStyle),
                text = tick.select('text').text(tickLabelFormat),
                textEnter = tickEnter.select('text'),
                textUpdate = tickUpdate.select('text'),
                textTransform,
                t,
                majorY,
                minorY,
                labelY,
                labelFillStyles = {'fill': d3c_adaptFill(axisOpts.label.fill, chartContext).value, 'fill-opacity': axisOpts.label.fillOpacity || 1e-6};
            
            if (axisOpts.label.fill) {
                textEnter.style(labelFillStyles);
                textUpdate.style(labelFillStyles);
            }
            d3c_applyFontStyle(textEnter, axisOpts.label.font, chartContext);
            d3c_applyFontStyle(textUpdate, axisOpts.label.font, chartContext);
            
            switch (orient) {
            case 'out': {
                majorY = d3c_dial_axisTickYValues(tickOpts.major, tickMajorSize, 0);
                minorY = d3c_dial_axisTickYValues(tickOpts.minor, tickMinorSize, 0);
                // Calculate label y coordinate and adjust label position property of label options.
                labelY = d3c_dial_axisLabelYVaue(labelOpts, orient, tickOpts.major.style, tickOpts.major.size, tickPadding, 0);
                
                tickTransform = d3c_dial_axisTransform;
                tickLineEnter.attr('y1', majorY[0]).attr('y2', majorY[1]);
                tickLineUpdate.attr('y1', majorY[0]).attr('x2', 0).attr('y2', majorY[1]);
                subtickEnter.attr('y1', minorY[0]).attr('y2', minorY[1]);
                subtickUpdate.attr('y1', minorY[0]).attr('x2', 0).attr('y2', minorY[1]);
                pathUpdate.attr('fill-opacity', 1e-6).attr('d', d3.svg.arc().startAngle(extent[0]).endAngle(extent[1]).innerRadius(innerRadius).outerRadius(radius));
                
                if (normalize) {
                    textTransform = (labelOpts.position === 'above') ? d3c_dial_textTransformNormalizeOut : d3c_dial_textTransformNormalizeIn;
                    textEnter.call(textTransform, scale0, labelY);
                    textUpdate.call(textTransform, scale1, labelY);
                    text.attr('class', 'unselectable').attr('dy', '0em');
                } else {
                    textEnter.attr('y', labelY);
                    textUpdate.attr('x', 0).attr('y', labelY);
                    text.attr('class', 'unselectable').attr('dy', labelOpts.position === 'above' ? '1.3em' : '.5em').style('text-anchor', 'middle');
                }

                break;
            }
            case 'in': {
                t = radius - innerRadius,
                majorY = d3c_dial_axisTickYValues(tickOpts.major, tickMajorSize, t);
                minorY = d3c_dial_axisTickYValues(tickOpts.minor, tickMinorSize, t);
                // Calculate label y coordinate and adjust label position property of label options.
                labelY = d3c_dial_axisLabelYVaue(labelOpts, orient, tickOpts.major.style, tickMajorSize, tickPadding, t);
                
                tickTransform = d3c_dial_axisTransform;
                tickLineEnter.attr('y1', majorY[0]).attr('y2', majorY[1]);
                tickLineUpdate.attr('y1', majorY[0]).attr('x2', 0).attr('y2', majorY[1]);
                subtickEnter.attr('y1', minorY[0]).attr('y2', minorY[1]);
                subtickUpdate.attr('y1', minorY[0]).attr('x2', 0).attr('y2', minorY[1]);
                pathUpdate.attr('fill-opacity', 1e-6).attr('d', d3.svg.arc().startAngle(extent[0]).endAngle(extent[1]).innerRadius(innerRadius).outerRadius(radius));
                
                if(normalize) {
                    textTransform = (labelOpts.position === 'above') ? d3c_dial_textTransformNormalizeOut : d3c_dial_textTransformNormalizeIn;
                    textEnter.call(textTransform, scale0, labelY),
                    textUpdate.call(textTransform, scale1, labelY),
                    text.attr('class', 'unselectable');
                } else {
                    textEnter.attr('y', labelY);
                    textUpdate.attr('x', 0).attr('y', labelY);
                    text.attr('class', 'unselectable').attr('dy', labelOpts.position === 'above' ? '1.3em' : '.5em').style('text-anchor', 'middle');
                }
                break;
            }
            }
            
            var r = radius;
            if (scale.rangeBand) {
                var dx = scale1.rangeBand() / 2,
                    x = function (d) {
                        return scale(d) + dx;
                    };
                tickEnter.call(tickTransform, x, r);
                tickUpdate.call(tickTransform, x, r);
            } else {
                tickEnter.call(tickTransform, scale0, r);
                tickUpdate.call(tickTransform, scale1, r);
                tickExit.call(tickTransform, scale1, 4);
                subtickEnter.call(tickTransform, scale0, r);
                subtickUpdate.call(tickTransform, scale1, r);
                subtickExit.call(tickTransform, scale1, r);
            }

            // Remove hidden label.
            ticks[0] = (tickOpts.showStartTickLabel === false) ? text.remove : ticks[0]; 
            ticks[ticks.length - 1] = (tickOpts.showEndTickLabel === false) ? null : ticks[ticks.length - 1];
            text.data(ticks, String).exit().remove();
            
        })();
    },
    fScale: function () {
        if (!arguments.length) {
            return this.scale;
        } else {
            this.scale = arguments[0];
            return this.fApplyChange(this.fScale);
        }
    }
});

function d3c_dial_extent(domain) {
    var start = domain[0], stop = domain[domain.length - 1];
    return start < stop ? [ start, stop ] : [ stop, start ];
}
function d3c_dial_scaleExtent(scale) {
    return scale.rangeExtent ? scale.rangeExtent() : d3c_dial_extent(scale.range());
}
function d3c_dial_scaleRange(scale) {
    var extent = d3c_dial_scaleExtent(scale);
    var range = scale.range();
    return range[0] < range[range.length - 1] ? [ extent[0], extent[1] ] : [ extent[1], extent[0] ];
}
function d3c_dial_convert(scale, x) {
    var d = scale(x);
    isNaN(d) ? d = d3c_dial_scaleRange(scale)[0] : d;
    return scale.rangeBand ? d + scale.rangeBand() / 2 : d;
}
function d3c_dial_invert(scale, x) {
    if(scale.invert) return scale.invert(x);

    var l = scale.domain().length;
    var range = d3c_dial_scaleRange(scale);
    var band = (range[1] - range[0]) / l;
    var index = Math.floor((x - range[0]) / band);
    return scale.domain()[index < l ? index : l-1];

}
var d3c_dial_axisDefaultOrient = "out", d3c_dial_axisOrients = {
    'in': 1,
    'out': 1
};

function d3c_dial_axisTransform(selection, x, r) {
    selection.attr("transform", function(d) {
        return "translate(" + r * Math.sin(x(d)) + "," + -r * Math.cos(x(d)) + ") rotate("+ 180 / Math.PI * x(d) +")";
    });
}
function d3c_dial_textTransformNormalizeOut(selection, x, dr) {
    selection.attr("transform", function(d) {
            var a = x(d) + (x.rangeBand ? x.rangeBand() / 2 : 0);
            return "rotate("+ -180 / Math.PI * a + ")" + "translate(" + -dr * Math.sin(a) + "," + dr * Math.cos(a) + ")";
        })
        .style("text-anchor", function(d) {
            var a = x(d) + (x.rangeBand ? x.rangeBand() / 2 : 0);
            a = a < -Math.PI ? a += 2*Math.PI : a > Math.PI ? a -= 2*Math.PI : a;
            return a > -19*Math.PI/20 && a < -Math.PI/20 ? "end" : a < 19*Math.PI/20 && a > Math.PI/20 ? "start" : "middle";
        })
        .style("baseline-shift", function(d) {
            var a = x(d) + (x.rangeBand ? x.rangeBand() / 2 : 0);
            return -80 * Math.pow(Math.sin(Math.abs(a/2)), 2) + "%";
        });
}

function d3c_dial_textTransformNormalizeIn(selection, x, dr) {
    selection.attr("transform", function(d) {
        var a = x(d) + (x.rangeBand ? x.rangeBand() / 2 : 0);
        return "rotate("+ -180 / Math.PI * a + ")" + "translate(" + -dr * Math.sin(a) + "," + dr * Math.cos(a) + ")";
        })
        .style("text-anchor", function(d) {
            var a = x(d) + (x.rangeBand ? x.rangeBand() / 2 : 0);
            a = a < -Math.PI ? a += 2*Math.PI : a > Math.PI ? a -= 2*Math.PI : a;
            return a > -7*Math.PI/8 && a < -Math.PI/8 ? "start" : a < 7*Math.PI/8 && a > Math.PI/8 ? "end" : "middle";
        })
         .style("baseline-shift", function(d) {
            var a = x(d) + (x.rangeBand ? x.rangeBand() / 2 : 0);
            return -100 * Math.pow(Math.cos(Math.abs(a/2)), 3) + "%";
        });
}

function d3c_dial_axisSubdivide(scale, ticks, m) {
    var subticks = [];
    if (m && ticks.length > 1) {
        var extent = d3c_dial_extent(scale.domain()), i = -1, n = ticks.length, d = (ticks[1] - ticks[0]) / ++m, j, v;
        while (++i < n) {
            for (j = m; --j > 0; ) {
                if ((v = +ticks[i] - j * d) >= extent[0]) {
                    subticks.push(v);
                }
            }
        }
        for (--i, j = 0; ++j < m && (v = +ticks[i] + j * d) < extent[1]; ) {
            subticks.push(v);
        }
    }
    return subticks;
}

function d3c_dial_axisTickYValues(_tickOpts, _tickSize, _offset) {
    return [(_tickOpts.style === 'cross') ? _offset - _tickSize : _offset,
             (_tickOpts.style === 'above') ? (_offset - _tickSize) : (_offset + _tickSize)];
}

function d3c_dial_axisLabelYVaue(_labelOpts, _orient, _tickStyle, _tickSize, _tickPadding, _offset) {
    var opts = _labelOpts;
    if (opts.position === 'same') {
        opts.position = _tickStyle;
    } else if (opts.position === 'opposite') {
        opts.position = (_tickStyle === 'below') ? 'above' : 'below';
    } 
    if (opts.position === 'cross') {
        opts.position = (_orient === 'in') ? 'below' : 'above';
    }
    
    if (opts.position === 'above') {
        return -Math.max(_tickSize, 0) - _tickPadding + (_orient === 'in' ? _offset : 0);
    } else  { // Should be below
        return Math.max(_tickSize, 0) + _tickPadding + (_orient === 'in' ? _offset : 0);
    } 
}