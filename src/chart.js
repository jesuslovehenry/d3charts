
/**
 * 
 */
function Chart(node, _chartContext, _options, _theme) {
//    var args = arguments;
    // Initialize private variable set.
    this._p = {};
    
    // Init this object.
    if (this.fInit) {
//        args[0] = {d3Sel : args[0]};
        this.fInit.apply(this, arguments);
    }
    return this;
}
d3c_extendClass(Chart, Element, {
    _CLASS_NAMES : CN.chart,
    themeOpts : null,
    eTitle : null,
    eLegend : null,
    eXAxis : null,
    eYAxis : [],
    ePlot : null,
    eSeries : [],
    defs : null,
    innerBounds : null,
    outerBounds : null,
    fInit : function (_chartContext, _options, _theme) {
        this._super.fInit.call(this,
                {},
                _chartContext,
                _options,
                _theme);
        
        this.chartContext.eContainer = this.eContainer;
        this.chartContext.options = this.options;
        this.chartContext.themeOpts = this.themeOpts = _theme;
        this.chartContext.eChart = this;
    },
    _fRender : function (selection) {
        var 
        p = this._p,
        chart = this,
        opts =  this.chartContext.jointOpts = chart.jointOpts = d3c_mergeChartOptions(d3c_mergeChartOptions(d3c_clone(DefaultOptions), this.themeOpts), this.options),
        chartOpts = (opts && opts.chart) ? opts.chart : {},
        titleOpts = chartOpts.title || {}, 
        titlePos = chartOpts.title.position,
        titleBBox = null,
        titleX = null,
        titleY = null,
        legendOpts = chartOpts.lengend || {},
        plotOpts = chartOpts.plot || {},
        svgSel = null,
        remainBounds = this.innerBounds,
        selType = null;
        
        selType = typeof selection;
        if (selType === 'string') {
            this.eContainer.d3Sel = d3.select(selection);
        } else if (selType === 'function') {
            this.eContainer.d3Sel = selType();
        } else {
            this.eContainer.d3Sel = selection;
        }
        this.chartContext.chartId = this.eContainer.d3Sel.attr('id');
        
        // Compute chart width and height.
        chartOpts.width = chartOpts.width || parseInt(this.eContainer.d3Sel.attr('width'), 0);
        chartOpts.height = chartOpts.height || parseInt(this.eContainer.d3Sel.attr('height'), 0);
        
        // Render chart. 
        // Create chart object(svg).
        this.chartContext.svgSelection = svgSel = p.svg = this.eContainer.d3Sel.append('svg');
        svgSel.attr('class', this.chartContext.chartId + ' ' + CN.svg + ' ' + this.fClassNames());
        svgSel.attr({
            'width': chartOpts.width,
            'height': chartOpts.height
        });
            
        // 1 Compute chart outer and inner bounds.
        chart.outerBounds = {
                x: 0,
                y: 0,
                width: chartOpts.width,
                height: chartOpts.height
            };
        chart.innerBounds = d3c_clone(chart.outerBounds);

        chart.d3Sel = chart.d3Sel || svgSel.selectAll(CN.FN.chart)
                    .data([chartOpts]).enter().append('g');
        chart.d3Sel.attr('class', CN.chart);

        var margin = d3c_adaptMargin(chartOpts.margin);
        chart.innerBounds.x += margin.left;
        chart.innerBounds.width -= (margin.left + margin.right);
        chart.innerBounds.y += margin.top;
        chart.innerBounds.height -= (margin.top + margin.bottom);

        remainBounds = this.innerBounds;
            
//            if (chartOpts.background || chartOpts.border) {
//                var chartBorder = selection.append('rect').attr('class',
//                        'chart-border');
//                d3c_applyOptions(chartOpts, chartBorder, chartContext);
//                if (chartOpts.border && chartOpts.border.enabled) {
//                    d3c_applyOptions(chartOpts.border, chartBorder,
//                            chartContext);
//                }
//                chartBorder.attr({
//                    'x': innerBounds.x,
//                    'y': innerBounds.y,
//                    'width': innerBounds.width,
//                    'height': innerBounds.height
//                });
//
//                var borderWidth = chartBorder.attr('stroke-width') ||
//                        chartBorder.style('stroke-width');
//                innerBounds.x += borderWidth;
//                innerBounds.width -= borderWidth * 2;
//                innerBounds.y += borderWidth;
//                innerBounds.height -= borderWidth * 2;
//            }
//
//            var padding = d3c_adaptMargin(chartOpts.padding);
//            if (padding) {
//                innerBounds.x += padding.left;
//                innerBounds.width -= (padding.left + padding.right);
//                innerBounds.y += padding.top;
//                innerBounds.height -= (padding.top + padding.bottom);
//            }

        // 2 Add title
        
        titleOpts.rotation = titleOpts.rotation ? titleOpts.rotation:
            ((titlePos === 'top' || titleOpts === 'bottom') ? 0: -90); 
        chart.eTitle = new Title(chart, chart.chartContext, titleOpts);
        if (titleOpts.enabled) {
            chart.title.fRender(chart.d3Sel);
            titleBBox = chart.title.getBBox();
            if (titlePos === 'top') {
                titleX = remainBounds.x;
                titleY = remainBounds.y;
                remainBounds.y += titleBBox.height;
                remainBounds.height -= titleBBox.height;
            } else if (titlePos === 'bottom') {
                titleX = remainBounds.x;
                titleY = remainBounds.y - titleBBox.height;
                remainBounds.height -= titleBBox.height;
            } else if (titlePos === 'left') {
                titleX = remainBounds.x;
                titleY = remainBounds.y;
                remainBounds.x += titleBBox.width;
                remainBounds.width -= titleBBox.width;
            } else if (titlePos === 'right') {
                titleX = remainBounds.x + remainBounds.width - titleBBox.width;
                titleY = remainBounds.y;
                remainBounds.width -= titleBBox.width;
            }
            chart.title.fX(titleX).fY(titleY);
        }
        
        // 3 Add legend
        // As default, for axis chart, legend item should show each series info,for non-axis chart, legend item should display category info.
        
        d3c_merge(chartOpts.legend, remainBounds);
        chart.eLegend = new Legend(chart, chart.chartContext, legendOpts);
        if (legendOpts.enabled) {
            chart.eLegend.fRender(chart.d3Sel);
            
            // TODO... adjust legend group bounds.
        }
            
        // 4 Add chart area
        // 4.1 parse all series to classify series type, some series need axis, some not.
        // 4.1 Add y axis
        // 4.2 Add x axis
        // 4.3 Add plot & series
        
        d3c_merge(chartOpts.plot, remainBounds); // set plot bounds.
        chart.ePlot = new Plot(chart, chart.chartContext, plotOpts);
        chart.ePlot.fRender(chart.d3Sel);
        this.eSeries = chart.ePlot.eSeries;
        
        // 5 Transition

        chart._super._fRender.apply(chart, arguments);
        
        return this;
    },
    fTheme: function () {
        if (!arguments.length) {
            return this.theme;
        } else {
            this.theme = arguments[0];
            return this.fApplyChanged(this.fTheme);
        }
    },
    fWidth: function () {
        if (!arguments.length) {
            // Get width.
            return (this.options && this.options.chart.width) ? this.options.chart.width
                   : (isRendered ? this.getBBox().width
                           : undefined);
        } else if (this.options && this.options.chart.width !== arguments[0]) {
            // Set width
            this.options.chart.width = arguments[0];
            return this.fApplyChanged(this.fWidth);
        }
    },
    fHeight: function () {
        if (!arguments.length) {
            // Get height.
            return (this.options && this.options.chart.height) ? this.options.chart.height
                   : (isRendered ? this.getBBox().height
                           : undefined);
        } else if (this.options && this.options.chart.height !== arguments[0]) {
            // Set height
            this.options.chart.height = arguments[0];
            return this.fApplyChanged(this.fHeight);
        }
    },
    // Set/get title.
    // Set and create/recreate title with title options parameter, get title
    // object without parameter.
    fTitle: function () {
        if (!arguments.length) {
            return this.eTitle;
        } else {
        // Set title options and create/recreate title.
        // TODO...
            return this.fApplyChanged(this.fTitle);
        }
    },
    /**
     * Add(insert)/get chart series.
     * <p>
     * Add series :
     * <p>
     * the first parameter is array of number to define insert index, null
     * array means append operator instead of insert operator, the second parameter
     * is array of series options object.
     * <p>
     * Get series :
     * <p>
     * parameter is array of number to indicate returned index of series, null
     * array means all series will be returned.
     */
    fSeries : function () {
        var type = null, i, returns = [], s;
        if (!arguments.length) {
            return this.eSeries;
        }

        if (typeof arguments[0] === 'string') {
            // The argument is specified series type and all series type equals to the value will be returned.
            type = arguments[0];
            s = (this.isRendered) ? this.eSeries : this.options.chart.plot.series;
            i = s.length;
            while (i--) {
                if (s[i].type === type) {
                    returns.push(s[i]);
                }
            }
            return returns;
        } else if (arguments[0] instanceof Array) {
            if (arguments[1]) {
                // Add/insert series
                // TODO...
                return this.fApplyChange(this.fSeries);
            } else {
                // Get series
                if (arguments[0].lenght === 0) {
                    return this.eSeries;
                }
                else {
                    var selected = [];
                    for (var index in arguments[0]) {
                        if (this.eSeries[index]) {
                            selected.push(this.eSeries[index]);
                        }
                    }
                    return selected.reverse();
                }
            }
        }
        return this;
    }
});


   