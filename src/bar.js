/**
 * New node file
 */
/**
 * 
 */

var DefaultBarSeriesOptions = {
        type: '',
        name: '', // The name should be anything including string, object or function and so on.
        layoutData: { // enabled when plot layout is grid type.
            vertialSpan: 1,
            horizontalSpan: 1
        },
        data: [] // The data allows array and function.
};

//Register dial series default options.
DefaultSeriesOptions.barSeries = DefaultBarSeriesOptions;
DefaultTargetsOptions.barSeries = { // properties are same with data
    size: '60%',
    width: 5,
    fill: 'black',
    fillOpacity: 1
};

// Register dial series creator.
d3c_registerSeriesCreator('bar', function (_container, _chartContext, _opts) {
    // Copy corresponding axis.
    _opts.axis = d3c_clone(_chartContext.jointOpts.chart.yAxis[_opts.axisIndex || 0]);
    return new BarSeries(_container, _chartContext, _opts);
});

var BarSeries = d3c_extendClass(null, Element, {
    type: 'bar',
    _CLASS_NAMES: CN.barSeries + ' ' + CN.series,
    scale: null,
    fInit: function () {
        this._super.fInit.apply(this, arguments);
        this.scale = d3.scale.linear();
        return this;
    },
    _fRender: function (g) {
        var
        _this = this,
        p = this._p,
        context = this.chartContext,
        opts = this.options,
        x =  opts.x,
        y = opts.y,
        w = opts.width,
        h = opts.height,
        scale = this.scale,
        domain = d3c_calculateScaleDomain(axisOpts, rangesOpts, opts.data.map(function(d){return d.value;})),
        extent = d3.extent(scale.domain()),
        d3Sel = null;
        
        g = d3Sel = this.d3Sel = g || (function(){
            var sel = _this.eContainer.d3Sel.selectAll(d3c_classFilterNames(_this.fClassNames())).data([opts]);
            sel.enter().append('g').attr('class', _this.fClassNames());
            return sel;
        })();
        
        g.each(function(d, i){
            var
            bbox = null,
            bounds = {'x': 0, 'y': 0, 'width': w || 0, 'height': h || 0},
            
            g = d3.select(this);
            g.attr('class') ? null : g.attr('class', this.fClassNames());

            // Process margin
            bounds.x = margin.left;
            bounds.y = margin.top;
            bounds.width -= (margin.left + margin.right);
            bounds.height -= (margin.top + margin.bottom);
            
            var
            titles = g.selectAll(CN.FN.title).remove().data([titleOpts, subtitleOpts]),
            titleUpdate = (titles.enter().append('g').attr('class', CN.title), titles.transition()),
            titleExit =  d3.transition(titles.exit()).style('opacity', 1e-6).remove(),
            title = null,
            subtitle = null,
            previousText;
            
            titleUpdate.each(function(d, i) {
                var g = d3.select(this);
                if (d && d.enabled !== false) {
                    d.anchor = isVertical ? 'middle' : (isReverse ? 'start' : 'end');

                    if (i === 0) {
                        // title.
                        title = new Label(_this, context, d);
                        g.attr('class', CN.title + ' '+ CN.major);
                        title.fRender(g);
                    } else {
                        // subtitle.
                        subtitle = new Label(_this, context, d);
                        g.attr('class', CN.title + ' '+ CN.minor);
                        subtitle.fRender(g);    
                    }
                }
            });
            
            bbox = titleUpdate.bbox(true);

            // Adjust bounds.
            if (isVertical) {
                bounds.y += isReverse ? 0 : bbox.height;
                bounds.height = bbox.height;
            } else {
                bounds.x += isReverse ? 0 : bbox.width;
                bounds.width -= bbox.width; 
            }
            
            // Set title translate.
            titleUpdate.each(function(d, i) {
                var sel = d3.select(this);
                if (isVertical) {
                    d3c_translate(sel, bounds.x + bounds.width / 2,  (bounds.y + (isReverse ? bounds.height : 0) + (previousText ? previousText.bbox().height : 0)));
                } else {
                    d3c_translate(sel, bounds.x + (isReverse ? bounds.width : 0) , bounds.y + (previousText ? previousText.bbox().height : 0));
                }
                previousText = sel;
            });
            
            function renderSeries(bounds, duration) {
                // Render plot.
                var
                series = g.selectAll(CN.FN.seriesPlot).data([opts]),
                seriesUpdate = (series.enter().append('g').attr('class', CN.seriesPlot).call(d3c_translate, bounds.x, bounds.y), series),
                plot = d3c_createBorder(seriesUpdate, opts, context).attr({'width': bounds.width, 'height': bounds.height}),
                b = d3c_copy(bounds);
                b.x = 0;
                b.y = 0;
                
                duration = duration || 1000;
                
                d3c_translate(plot, b.x, b.y);
                
                // Set scale range.
                scale.range(seriesOrient === 'vertical' ? [b.height, 0] : [0, b.width]);
                
                // Render ranges.
                if (rangesOpts && rangesOpts.length) {
                    var
                    rangesUpdate = seriesUpdate.selectAll(CN.FN.range).data(rangesOpts);
                    rangesUpdate.enter().append('g').attr('class', CN.range);
                    d3c_createRanges(rangesUpdate, scale, b, context);
                }
            
                // Render data(measures)
                var
                measuresUpdate = seriesUpdate.selectAll(CN.FN.measure).data(measuresOpts);
                measuresUpdate.enter().append('g').attr('class', CN.measure);
                measuresUpdate.sort(function c(a, b){
                    return b.value < a.value ? -1 : b.value > a.value ? 1 : 0;
                });
                p.measures = measuresUpdate;
                measuresUpdate.each(function(opts, i) {
                    var
                    g = d3.select(this),
                    size = d3c_adaptNumberOpt(opts.size || (isVertical ? b.width / 3 : b.height / 3), isVertical ? b.width : b.height),
                    asDot = opts.asDot || false,
                    rect = g.selectAll('rect').data([opts]),
                    rectUpdate = (rect.enter().append('rect'), rect),
                    scaleValue = scale(opts.value);
                    
                    if (isVertical) {
                        g.call(d3c_translate, b.width / 2, isReverse ? 0 : b.height);
                        rectUpdate
                        .attr('x', -size / 2)
                        .attr('y', isReverse ? 0 : -scaleValue)
                        .attr('width', size)
                        .attr('height', asDot ? size : scaleValue);
                    } else {
                        g.call(d3c_translate, isReverse ? b.width : 0, b.height / 2);
                        rectUpdate
                        .attr('x', 0)
                        .attr('y', - size / 2)
                        .attr('width', asDot ? size : 0 )
                        .attr('height', size)
                        .transition().duration(duration)
                        .attr('x', isReverse ? scaleValue - b.width : 0)
                        .attr('y', - size / 2)
                        .attr('width', asDot ? size : (isReverse ? b.width - scaleValue: scaleValue) )
                        .attr('height', size);
                    }
                    d3c_applyBorderStyle(rect, opts.border, opts, context);
                });
            
                // Render targets
                var
                targetsUpdate = seriesUpdate.selectAll(CN.FN.target).data(targetsOpts);
                targetsUpdate.enter().append('g').attr('class', CN.target);
                targetsUpdate.sort(function c(a, b){
                    return a.value < b.value ? -1 : a.value > b.value ? 1 : 0;
                });
                p.targets = targetsUpdate;
                targetsUpdate.each(function(opts, i) {
                    var
                    g = d3.select(this),
                    size = d3c_adaptNumberOpt(opts.size || (isVertical ? b.width / 3 : b.height / 3), isVertical ? b.width : b.height),
                    width = opts.width,
                    rect = g.selectAll('rect').data([opts]),
                    rectUpdate = (rect.enter().append('rect'), rect),
                    rangeValue = scale(opts.value)
                    
                    if (isVertical) {
                        g.call(d3c_translate, b.width / 2, isReverse ? 0 : b.height);
                        rectUpdate
                        .attr('x', b.width / 2)
                        .attr('y', isReverse ? rangeValue - width : -rangeValue + width)
                        .attr('width', size)
                        .attr('height', width);
                    } else {
                        g.call(d3c_translate, isReverse ? b.width : 0, b.height / 2);
                        rectUpdate
                        .transition().duration(duration)
                        .attr('x', isReverse ? rangeValue - b.width - width : rangeValue)
                        .attr('y', -size / 2)
                        .attr('width', width)
                        .attr('height', size);
                    }
                    d3c_applyBorderStyle(rect, opts.border, opts, context);
                });
                
                // Render Axis
                var
                eAxis = null,
                axisOrient = isVertical ? (axisOpts.orient === 'top' ? 'right' : (axisOpts.orient === 'bottom' ? 'left' : axisOpts.orient)) 
                        : (axisOpts.orient === 'left' ? 'bottom' : (axisOpts.orient === 'right' ? 'top' : axisOpts.orient));
                axisUpdate = seriesUpdate.selectAll(CN.FN.axis).data([axisOpts]);
                axisUpdate.enter().append('g').attr('class', CN.axis);
                axisUpdate.each(function(d, i){
                    var g = d3.select(this);
                    axisOpts.width = b.width;
                    axisOpts.height = b.height;
                    axisOpts.orient = axisOrient;   
                    eAxis = _this.eAXis = new Axis(_this, context, axisOpts);
                    eAxis.fScale(scale).fRender(g);
                    
                    g.call(d3c_translate, 
                          (axisOrient === 'right') ? b.width : 0,
                          (axisOrient === 'bottom') ? b.height : 0);
                });
                
                return seriesUpdate.bbox(true);
            }
            
            bbox = renderSeries(bounds, 0);
            if (bbox.x < 0 || bbox.y < 0 || bbox.width > bounds.width || bbox.height > bounds.height) {
                bounds.x += bbox.x < 0 ? Math.abs(bbox.x) : 0;
                bounds.y += bbox.y < 0 ? Math.abs(bbox.y) : 0;
                bounds.width = bounds.width * 2 - bbox.width;
                bounds.height = bounds.height * 2 - bbox.height;
                renderSeries(bounds, 1000);
            }
            
        });
        
        this.fTransition(g);
        
        p.scale = scale.copy();
        return this;
    },
    fTransition: function () {
        
    },
    fRedraw: function () {
        this.fRender(this.d3Sel);
    },
    fTarget : function(i) {
        if (arguments.length && d3c_isNumber(arguments[0])) {
            return this._p.targets && d3.select(this._p.targets[0][arguments[0]]);
        }
        return this._p.targets;  
    },
    fMoveTarget: function(i, value) {
        var
        targetUpdate =this.fTarget(i);
        
        if(targetUpdate) {
            var
            rect = targetUpdate.select('rect');
            x = parseInt(rect.attr('x')),
            newX = this.scale(value);
        
            if (x != newX) {
                rect.transition().duration(1000).attr('x', newX);
            }
        }
    },
    fMeasure: function(i) {
        if (arguments.length && d3c_isNumber(arguments[0])) {
            return this._p.measures && d3.select(this._p.measures[0][arguments[0]]);
        }
        return this._p.measures;
    },
    fChangeMeasure: function(i, value) {
        var
        measureUpdate =this.fMeasure(i);
        
        if(measureUpdate) {
            var
            rect = measureUpdate.select('rect');
            w = parseInt(rect.attr('width')),
            newW = this.scale(value);
        
            if (w != newW) {
                rect.transition().duration(1000).attr('width', newW);
            }
        }
    }
});