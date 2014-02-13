/**
 * 
 */
var DefaultLinearSeriesOptions = {
    type : 'linear',
//    x : 0,
//    y : 0,
//    width : 0,
//    height : 0,
    round: 0, // round radius of four corners.
    axisIndex: 0,
//    fill : '',
    fillOpaticy : 1e-6,
    border : {},
    axisIndex: 0
//    ,
//    data: { // Array
//        value: 0,
//        markerPosition: 'below', // below or above
//        marker: {
//            enabled: true,
//            type: 'circle',
//            size: 10,
//            fill: 'white',
//            fillOpacity: 1,
//            border: {
//                
//            },
//            
//            markerPosition: 'below',
//            marker: {
//                
//            }
//        },
//        labelPosition: 'below',
//        label: {
//            enabled: true,
//            text:'',
//            font:{
//                fill: 'black',
//                fillOpacity: 1,
//                textAnchor: 'middle', // start/middle/end
//            },
//            fill: 'white',
//            fillOpacity: 1e-6,
//            border: {},
//        }
//    ,
//    line : {
//        enabled: false,
//        stroke: 'yellow',
//        strokeWidth:1,
//        strokeOpacity:1
//    }
//    }
//    ,
//    ranges : { // Array
//        enabled: true,
//        type: 'line', // line or range
////        x1: 0,
////        x2: 0,
//        //y1: 0,
//        //y2: 0,
//        fill: 'black',
//        fillOpacity: 1,
//        border: {},
//        labelPosition: 'below', // above, below
//        label: {
//            enabled: false,
//        },
//        markerPosition: 'below', // above, below
//        marker: { // Only enabled for line band.
//            enabled: false,
//            type: 'circle',
//            size: 5,
//            border: {},
//            fill: 'white',
//            fillOpacity: 0
//        }
//    }
};

//Register dial series default options.
DefaultSeriesOptions.linearSeries = DefaultLinearSeriesOptions;

// Register dial series creator.
d3c_registerSeriesCreator('linear', function (_container, _chartContext, _opts) {
    // Copy corresponding axis.
    _opts.axis = d3c_clone(_chartContext.jointOpts.chart.yAxis[_opts.axisIndex || 0]);
    return new LinearSeries(_container, _chartContext, _opts);
});

var LinearClassNames = {
    linearSeries: 'linearSeires',
    border: 'border',
    bar: 'bar',
    ranges: 'ranges',
    range: 'range',
    pointer: 'pointer',
    marker: 'marker',
    axis: 'axis',
    tick: 'tick',
    major: 'major',
    minor: 'minor',
    label: 'label',
    title: 'title',
    subTitle: 'sutTitle'
}

var LinearSeries = d3c_extendClass(null, Element, {
    type: 'linear',
    _CLASS_NAMES: CN.linearSeries + ' ' + CN.series,
    eAxis: null,
    fInit: function () {
      this._super.fInit.apply(this, arguments);
    },
    _fRender : function () {
        var
        p = this._p,
        context = this.chartContext,
        opts = this.options,
        dataOpts = opts.data,
        rangesOpts = opts.ranges,
        axisOpts = opts.axis,
        bandsOpts = axisOpts.bands,
        x = opts.x,
        y = opts.y,
        w = opts.width,
        h = opts.height,
        hasBands = bandsOpts && bandsOpts.length,
        hasRanges = rangesOpts && rangesOpts.length,
        gadgetBounds = {'x': x, 'y': y, 'width': w, 'height': h},
        d3Sel = null,
        eAxis = null,
        domain = d3c_calculateScaleDomain(axisOpts, rangesOpts, opts.data.map(function(d){return d.value;})),
        extent = d3.extent(domain),
        scale = d3.scale.linear().domain(domain).range([0, w]),
        bbox = null;
        
        // Create root selection.
        d3Sel = this.d3Sel = (this.d3Sel || this.eContainer.d3Sel.append('g').datum(opts).attr('class', this.fClassNames()));
        d3c_translate(d3Sel, x, y);
        
        d3Sel.attr('display', 'none');
        
        // 1. First render.
        // Render linear bar.
        p.sGadgetBorder = d3Sel.append('rect').attr('class', CN.border).attr({'x': gadgetBounds.x, 'y': gadgetBounds.y, 'width': gadgetBounds.width, 'height': gadgetBounds.height});
        opts.round ? p.sGadgetBorder.attr({'rx': opts.round, 'ry': opts.round}) : null;
        d3c_applyBorderStyle(p.sGadgetBorder, opts.border, opts, context);
        
        // Create bands group and render bands.
        if (hasBands) {
            p.sBands = d3Sel.selectAll(CN.FN.band).data(bandsOpts);
            p.sBandsUpdate = (p.sBands.enter().append('g').attr('class', CN.band), d3.transition(p.sBands));
            d3c_each(bandsOpts, function(_bandOpts) {
                _bandOpts.round = opts.round;
                return _bandOpts;
            });
            d3c_translate(p.sBandsUpdate, gadgetBounds.x, gadgetBounds.y);
            d3c_createBands(p.sBandsUpdate, scale, gadgetBounds, context);
        }
        
        // Create ranges group and render ranges
        if (hasRanges) {
            p.sRanges = d3Sel.selectAll(CN.FN.range).data(rangesOpts);
            p.sRangesUpdate = (p.sRanges.enter().append('g').attr('class', CN.range), d3.transition(p.sRanges));
            d3c_translate(p.sRangesUpdate, gadgetBounds.x, gadgetBounds.y);
            d3c_createRanges(p.sRangesUpdate, scale, gadgetBounds, context);
        }
        
        // Render axis.
        axisOpts.x = 0;
        axisOpts.y = (axisOpts.orient === 'top') ? 0 : h;
        axisOpts.width = w;
        eAxis = this.eAxis = new Axis(this, context, axisOpts);
        eAxis.fScale(scale);
        var axisUpdate = d3Sel.selectAll('.axis').data([axisOpts]).enter().append('g');
        d3c_translate(axisUpdate, 0, axisOpts.y);
        eAxis.fRender(axisUpdate);
        
        // Render data pointers
        p.sPointers = d3Sel.selectAll(CN.FN.pointer).data(dataOpts);
        p.sPointersUpdate = (p.sPointers.enter().append('g').attr('class', CN.pointer), d3.transition(p.sPointers));
        p.sPointersUpdate.each(function (pointerOpts, i) {
            var
            pointer = d3.select(this).call(d3c_createMarker, pointerOpts.marker, h, context),
            x = scale(pointerOpts.value),
            y = (pointerOpts.markerPosition === 'below') ? gadgetBounds.y + gadgetBounds.height : gadgetBounds.y,
            label;
            
            d3c_translate(pointer, x, y);
            if (pointerOpts.label && pointerOpts.label.enabled !== false) {
                label = d3c_createLabel(pointer, pointerOpts.label, pointerOpts.value, context);
                d3c_translate(label, 0, (pointerOpts.labelPosition === 'below') ? pointerOpts.marker.size / 2 : - (label.bbox().height + pointerOpts.marker.size / 2));
//                label.select('text').attr('dy', (data.position === 'below') ? '.3em' : '.7em');
            };
            
            // Create line
            if (pointerOpts.line && pointerOpts.line.enabled !== false) {
                var line = pointer.selectAll('line').data([pointerOpts.line]);
                line.enter().insert('line', CN.FN.marker).attr({'x1': 0, 'y1': 0, 'x2': 0, 'y2': (pointerOpts.markerPosition === 'below') ? -gadgetBounds.height : gadgetBounds.height});
                d3c_applyBorderStyle(line, pointerOpts.line, {}, context);
            } else {
                pointer.selectAll('line').remove();
            }
        });
        
        // 2. Compute bounds of plot bar.
        // Adjust border bounds and redraw axis, linear bar and data pointers.
        bbox = d3Sel.node().getBBox();
        gadgetBounds.x = bbox.x < 0 ? gadgetBounds.x + Math.abs(bbox.x) : gadgetBounds.x;
        gadgetBounds.width = bbox.width > gadgetBounds.width ? gadgetBounds.width - gadgetBounds.x - (bbox.width - gadgetBounds.width) : gadgetBounds.width;
        gadgetBounds.y = bbox.y < 0 ? gadgetBounds.y + Math.abs(bbox.y) : gadgetBounds.y;
        gadgetBounds.height = bbox.height > gadgetBounds.height ? gadgetBounds.height - gadgetBounds.y - (bbox.height - gadgetBounds.height) : gadgetBounds.height;
        
        // Re-render axis, linear bar and data pointers.
        p.sGadgetBorder.attr({'x': gadgetBounds.x, 'y': gadgetBounds.y, 'width': gadgetBounds.width, 'height': gadgetBounds.height});
        
        // adjust axis.
        eAxis.fOptions().x = gadgetBounds.x; 
        eAxis.fOptions().y = (axisOpts.orient === 'top') ? gadgetBounds.y : gadgetBounds.y + gadgetBounds.height;
        eAxis.fOptions().width = gadgetBounds.width;
        scale.range([gadgetBounds.x, gadgetBounds.x + gadgetBounds.width]);
        eAxis.fRedraw();
        d3c_translate(axisUpdate, eAxis.fOptions().x, eAxis.fOptions().y);
        
        // adjust pointers.
        p.sPointersUpdate.each(function (pointerOpts, i) {
            d3c_translate(d3.select(this), scale(pointerOpts.value), (pointerOpts.markerPosition === 'below') ? gadgetBounds.y + gadgetBounds.height : gadgetBounds.y);
            d3.select(this).select('line').attr({'x1': 0, 'y1': 0, 'x2': 0, 'y2': (pointerOpts.markerPosition === 'below') ? -gadgetBounds.height : gadgetBounds.height});
        });
        
        // adjust bands.
        if (hasBands) {
            p.sBands = d3Sel.selectAll(CN.FN.band).data(bandsOpts);
            p.sBandsUpdate = (p.sBands.enter().append('g').attr('class', CN.band), d3.transition(p.sBands));
            d3c_each(bandsOpts, function(_bandOpts) {
                _bandOpts.round = opts.round;
                return _bandOpts;
            });
            d3c_translate(p.sBandsUpdate, gadgetBounds.x, gadgetBounds.y);
            d3c_createBands(p.sBandsUpdate, scale, gadgetBounds, context);
        }
        // adjust ranges.
        if (hasRanges) {
            p.sRanges = d3Sel.selectAll(CN.FN.range).data(rangesOpts);
            p.sRangesUpdate = (p.sRanges.enter().append('g').attr('class', CN.range), d3.transition(p.sRanges));
            d3c_translate(p.sRangesUpdate, gadgetBounds.x, gadgetBounds.y);
            d3c_createRanges(p.sRangesUpdate, scale, gadgetBounds, context);
        }
        this.fTransition();
    },
    fTransition: function () {
        var scale = this.eAxis.fScale(),
            opts = this.eAxis.options;
        this.d3Sel.attr('display', 'block');
        this.fPointer().each(function (_d, i) {
            var
            _this = d3.select(this),
            tran = _this.attr('transform'),
            xy = tran && _this.attr('transform').match(/([\+-]?[0-9\.]+)/g);
            
            if (xy && xy.length > 1) {
                _this.call(d3c_translate, scale(0), parseInt(xy[1])).transition().duration(1000).call(d3c_translate, scale(_d.value), parseInt(xy[1]));
            }
        });
    },
    fPointer: function(i) {
        if (arguments.length && d3c_isNumber(arguments[0])) {
            return this._p.sPointers && d3.select(this._p.sPointers[0][arguments[0]]);
        }
        return this._p.sPointers;
    },
    fMovePointer: function (i, _pointValue) {
        var pointerUpdate =this.fPointer(i),
            transXY = d3c_translate(pointerUpdate);
        if (transXY.length) {
            pointerUpdate.transition().duration(1000).call(d3c_translate, this.eAxis.fScale()(_pointValue), transXY[0].y);
        }
    }
});