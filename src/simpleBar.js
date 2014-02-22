/**
 * New node file
 */
//var SimpleBarOpts = {
//    title:'',
//    subtitle:'',    
//      font:{},
//      subtitleFont:{},
//    fill:,
//    fillOpacity:,
//    border:{},
//    data:[{
//        x:'',
//        y:''
//    }],
//        categoryType: ''
//        categoryLabelFont:{},
//      seriesLabelFont:{},
//      xDataFormat:'',
//      yDataFormat:'',
//}
var SimpleBar = function(_chartContext) {
    var
    chartContext = _chartContext,
    h = null,
    w = null;
   
    function bar(g) {
        g.each(function(d, i){
            var
            g = d3.select(this),
            opts = d,
            data = opts.data,
            width = w || opts.width,
            height = h || opts.height,
            title = opts.title,
            xValue = d3c_seriesValues(data, 'x'),
            yValues = d3c_seriesValues(data, 'y'),
            minMaxY = [d3.min(yValues), d3.max(yValues)],
            y = d3.scale.linear().range([height, 0]);
            y.domain([0, minMaxY[1]]),
            barWidth = width / data.length,
            b = {'x': 0, 'y': 0, 'width': width, 'height': height};
            if (title) {
                var titleUpdate = g.selectAll(CN.FN.title).data([title]);
                titleUpdate.enter().append('text')
                    .attr('class', CN.title)
                    .attr('dy', '.8em')
                    .attr({'x': 0, 'y': 0})
                    .text(title),
                titleBBox = (d3c_applyFontStyle(titleUpdate, opts.font, chartContext), titleUpdate.bbox(true));
            }
            
            var
            subtitle = g.selectAll('.subtitle').data([minMaxY[0]]),
            subtitleLabel = opts.subtitle || (opts.yDataFormat ? opts.yDataFormat(minMaxY[0]) : minMaxY[0]) + ' - ' + (opts.yDataFormat ? opts.yDataFormat(minMaxY[1]) : minMaxY[1]),
            subtitleUpdate = subtitle.enter().append('text')
                .attr('class', '.subtitle')
                .attr('dy', '.8em')
                .attr({'x': 0, 'y': (titleBBox || {'height': height}).height})
                .text(subtitleLabel),
            subtitleBBox = (d3c_applyFontStyle(subtitleUpdate, opts.subtitleFont, chartContext), subtitleUpdate.bbox(true)),
            totalBBox = g.selectAll('.title, .subtitle').bbox(true);
            
            b.x = totalBBox.width;
            b.width -= totalBBox.width; 
            
            var
            barsGroup = g.selectAll('.barGroup').data([data]);
            barsGroup.enter().append('g').attr('class', 'barGroup');
            d3c_translate(barsGroup, b.x, b.y);
            barsGroup.exit().remove();
            barsGroup.each(function(d){
                var barsGroup = d3.select(this);
                barsUpdate = barsGroup.selectAll('.bar').data(d);
                barsUpdate.enter().append('g').attr('class', 'bar');
                barsUpdate.exit().remove;
                barsUpdate.each(function(d, i) {
                    var
                    g = d3.select(this).attr('transform', 'translate(' + (i * barWidth) + ',0)'),
                    dpUpdate = g.selectAll('.dataPoint').data([d]),
                    slUpdate = g.selectAll('.seriesLabel').data([d]);
                    clUpdate = g.selectAll('.categoryLabel').data([d]);
                    
                    dpUpdate.enter().append('rect').attr('class', 'dataPoint');
                    dpUpdate.exit().remove();
                    slUpdate.enter().append('text').attr('class', 'seriesLabel');
                    slUpdate.exit().remove();
                    clUpdate.enter().append('text').attr('class', 'categoryLabel');
                    clUpdate.exit().remove();
                    
                    clUpdate
                    .style('text-anchor', 'middle')
                    .attr("x", barWidth / 2)
                    .attr("y", height)
                    .attr("dy", "-.2em")
                    .text(adaptCategoryData(opts, d.x))
                    .call(d3c_applyFontStyle, opts.categoryLabelFont, chartContext);   
                    
                    var
                    clBBox = clUpdate.node().getBBox(),
                    newH = height - clBBox.height;
                    
                    dpUpdate.attr('y', newH)
                        .attr('height', 0)
                        .attr('width', barWidth - 1)
                        .call(d3c_applyBorderStyle, opts.border, opts, chartContext)
                        .transition().duration(1000)
                        .attr('y', y(d.y))
                        .attr('height', newH - y(d.y))
                        .style('fill', getFill.call(this, opts.fill, chartContext, d.y) );
                     slUpdate
                         .style('text-anchor', 'middle')    
                         .attr('transform', 'translate(' + (barWidth /2 ) + ',' + Math.min((y(d.y)+ 10), newH - 10) + ') rotate(-90)') 
                         .attr("x", 0)
                         .attr("y", 0)
                         .attr("dy", ".3em")
                         .text(opts.yDataFormat ? opts.yDataFormat(d.y) : d.y)
                         .call(d3c_applyFontStyle, opts.seriesLabelFont, chartContext);
                });
            });
            
            
        });
        return this;
    }
    
    bar.width = function() {
        if (!arguments.length) {
            return w;
        } else {
            w = arguments[0];
        }
        return bar;
    };
    
    bar.height = function() {
        if (!arguments.length) {
            return h;
        } else {
            h = arguments[0];
        }
        return bar;
    };
    
    function getFill(fill, context, y) {
        if (fill) {
            if (typeof fill === 'string') { 
                return d3c_adaptFill(fill, context); 
            } else if(typeof fill === 'function') {
                return fill.call(this, y, context);
            } 
        }
        return fill;
    }
    
    function adaptCategoryData(opts, value) {
        var d = value, t;
        if (opts.categoryType === 'date') {
            t = new Date();
            t.setTime(d);
            d = t;
        }
        return opts.xDataFormat ? opts.xDataFormat(d) : d;
    }
    
    return bar;
}

var SimpleBarCharts = function() {
    var
    data,
    x,
    y,
    width,
    height,
    chartContext,
    simpleBar,
    svg;
    
    function sbc(g) {
        svg = g.selectAll('svg').data([0]);
        svg.enter().append('svg')
            .attr('class', 'simpleBarChart')
            .attr({'x':x, 'y': y, 'width': width, 'height': height});
        
        chartContext = chartContext || new ChartContext(svg);
        var
        barCharts = svg.selectAll('.barChart').data(data),
        barHeight = height / data.length;
        barCharts.enter().append('g').attr('class', 'barChart');
        simpleBar = simpleBar || new SimpleBar(chartContext);
        simpleBar.width(width).height(barHeight);
        simpleBar(barCharts);
        barCharts.each(function(d, i){
            d3c_translate(d3.select(this), x, barHeight * i);
        });
    }
    
    sbc.data = function() {
        if (!arguments.length) {
            return data;
        } else {
            data = arguments[0];
        }
        return sbc;
    };
    
    sbc.bounds = function() {
        if (!arguments.length) {
            return {'x': x, 'y': y, 'width' : width, 'height': height};
        } else {
            x = arguments[0].x;
            y = arguments[0].y;
            width = arguments[0].width;
            height = arguments[0].height;
        }
        return sbc;
    };
    
    return sbc;
}