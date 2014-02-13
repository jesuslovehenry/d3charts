/**
 * New node file
 */
//var SimpleBarOpts = {
//    title:'',
//    subTitle:'',    
//      font:{},
//      subtitleFont:{},
//    fill:,
//    fillOpacity:,
//    border:{},
//    data:[{
//        x:'',
//        y:''
//    }],
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
            minLabel = g.selectAll('.minLabel').data([minMaxY[0]]),
            minLabelUpdate = minLabel.enter().append('text')
                .attr('class', '.minLabel')
                .attr('dy', '.8em')
                .attr({'x': 0, 'y': (titleBBox || {'height': height}).height})
                .text('Min: ' + opts.yDataFormat ? opts.yDataFormat(minMaxY[0]) : minMaxY[0]),
            minLabelBBox = (d3c_applyFontStyle(minLabelUpdate, opts.subtitleFont, chartContext), minLabelUpdate.bbox(true)),
            maxLabel = g.selectAll('.maxLabel').data([minMaxY[1]]),
            maxLabelUpdate = maxLabel.enter().append('text')
                .attr('class', '.maxLabel')
                .attr('dy', '.8em')
                .attr({'x': 0, 'y': titleBBox.height + minLabelBBox.height})
                .text('Max: ' + opts.yDataFormat ? opts.yDataFormat(minMaxY[1]) : minMaxY[1]),
            maxLabelBBox = (d3c_applyFontStyle(maxLabelUpdate, opts.subtitleFont, chartContext), maxLabelUpdate.bbox(true)),
            totalBBox = g.selectAll('.title, .minLabel, .maxLabel').bbox(true);
            
            b.x = totalBBox.width;
            b.width -= totalBBox.width; 
            
            var
            barsGroup = g.selectAll('.barGroup').data(data);
            barsGroup.enter().append('g').attr('class', 'barGroup');
            d3c_translate(barsGroup, b.x, b.y);
            barsGroup.exit().remove();
            var 
            barsUpdate = barsGroup.selectAll('.bar').data(data);
            barsUpdate.enter().append('g').attr('class', 'bar');
            barsUpdate.exit().remove;
            barsUpdate.attr("transform", function(d, i) { return "translate(" + (i * barWidth) + ",0)"; });
            
            barsUpdate.each(function(d, i) {
                var g = d3.select(this);
                
                g.selectAll('.dataPoint').data([d]).enter().append('rect').attr('class', 'dataPoint');
                g.selectAll('.seriesLabel').data([d]).enter().append('text').attr('class', 'seriesLabel');
//                barsUpdate.selectAll('.categoryLabel').enter().append('text').attr('class', 'categoryLabel');

                var barsDataPoints = g.select('.dataPoint')
                    .attr('y', height)
                    .attr('height', 0)
                    .attr('width', barWidth - 1)
                    .call(d3c_applyBorderStyle, opts.border, opts, chartContext)
                    .transition().duration(1000)
                    .attr('y', y(d.y))
                    .attr('height', height - y(d.y));
                var barsSeriesLabels = g.select('.seriesLabel')
                    .attr("x", barWidth / 2)
                    .attr("y", y(d.y) + 3)
                    .attr("dy", ".75em")
                    .text(opts.yDataFormat ? opts.yDataFormat(d.y) : d.y)
                    .call(d3c_applyFontStyle, opts.seriesLabelFont, chartContext);
//               var barsCategoryLabels = barGroup.selectAll('categoryLabel')
//                    .attr("x", barWidth / 2)
//                    .attr("y", function(d) { return y(d.y) + 3; })
//                    .attr("dy", ".75em")
//                    .text(function(d) { rreturn d.y; });    
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
        barCharts.transition().each(function(d, i){
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