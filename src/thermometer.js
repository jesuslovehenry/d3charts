/**
 * 
 */

var DefaultThermometerSeriesOptions = {
        type : 'thermometer',
        type : 'bullet',
//      x : 0,
//      y : 0,
//      width : 0,
//      height : 0,
      margin: {
          top: 10,
          bottom:10,
          left:10,
          right:10
      },
      fill : 'rgb(225, 225, 225)',
      fillOpacity : 1,
      border : {
          stroke: 'black',
          strokeWidth: 1,
          strokeOpacity: 1
      },
      axisIndex : 0,
      ballSize: '50%', // Percent value of thermometer.
      tubeSize: '20%', // Size of tube size.
      topRound : 0, // percentage value of number value, percentage value is relative to tubeSize.
//      data : [{
//          value: 0,
//          size: '30%', // The measure size in bullet, it may be percent value relative to bullet width or absolute number.
////          fill:
//          fillOpacity: 1,
////          border : {}
//          labelPosition: 'outside', // Indicate the value label shows in measure bar or inside or outside
//          label: {} 
//      }], // Array
//      ranges: [{
//          
//      }]
}


//Register dial series default options.
DefaultSeriesOptions.thermometerSeries = DefaultThermometerSeriesOptions;
DefaultRangesOptions.thermometerSeries = {
  type: 'range', // line or range
  fill: 'black',
  fillOpacity: 1
};

//Register dial series creator.
d3c_registerSeriesCreator('thermometer', function (_container, _chartContext, _opts) {
  // Copy corresponding axis.
  _opts.axis = d3c_clone(_chartContext.jointOpts.chart.yAxis[_opts.axisIndex || 0]);
  return new ThermometerSeries(_container, _chartContext, _opts);
});

var ThermometerSeries = d3c_extendClass(null, Element, {
    type: 'thermometer',
    _CLASS_NAMES: CN.thermometerSeries + ' ' + CN.series,
    scale: null,
    eAxis: null,
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
        dataOpts = opts.data[0],
        labelOpts = dataOpts.label,
        rangesOpts = opts.ranges,
        axisOpts = opts.axis,
        x = opts.x,
        y = opts.y,
        w = opts.width,
        h = opts.height,
        domain = null,
        extent = null,
        scale = this.scale,
        d3Sel = null,
        ballSize = d3c_adaptNumberOpt(opts.ballSize, w),
        tubeSize = d3c_adaptNumberOpt(opts.tubeSize, w),
        margin = d3c_adaptMargin(opts.margin),
        eAxis,
        delta0 = Math.acos(tubeSize / ballSize) * ballSize / 2,
        delta = ballSize / 2 - delta0;
        
        axisOpts.reverse = false;
        domain = d3c_calculateScaleDomain(axisOpts, rangesOpts, opts.data.map(function(d){return d.value;})),
        extent = d3.extent(domain),
        scale = this.scale.domain(domain);
        
        g = d3Sel = this.d3Sel = g || (function(){
            var sel = _this.eContainer.d3Sel.selectAll(d3c_classFilterNames(_this.fClassNames())).data([opts]);
            sel.enter().append('g').attr('class', _this.fClassNames());
            return sel;
        })();
        
        g.each(function(d, i){
            var
            bbox = null,
            b = {'x': 0, 'y': 0, 'width': w || 0, 'height': h || 0},
            
            g = d3.select(this);
            g.attr('class') ? null : g.attr('class', _this.fClassNames());

            // Process margin
            b.x = margin.left;
            b.y = margin.top;
            b.width -= (margin.left + margin.right);
            b.height -= (margin.top + margin.bottom);

            // Render label
            if (labelOpts) {
                var lOpts = d3c_clone(labelOpts);
                lOpts.text = dataOpts.value;
                lOpts.anchor = 'middle';
                var
                labelUpdate = g.selectAll(CN.FN.label).data([lOpts]);
                labelUpdate.enter().append('g').attr('class', CN.label);
                
                var label = new Label(_this, context, lOpts);
                label.fRender(labelUpdate);
                labelUpdate.call(d3c_translate, w / 2, b.y + b.height - labelUpdate.bbox().height);
                b.height -= labelUpdate.bbox().height;
            }
            
            function renderSeries(bounds, duration) {
            
                // Render thermometer ball and thermometer bar
                var
                b = bounds,
                tubeHeight = b.height - ballSize + delta,
                tubePath = 'M' + (b.y + (b.width - tubeSize) / 2) + ',' + (b.y + tubeHeight) + ' l' + 0 + ',' + (-tubeHeight) + ' l' + tubeSize + ',' + 0 + ' l' + 0 + ',' + tubeHeight,
                ballPath = 'M' + (b.y + (b.width - tubeSize) / 2) + ',' + (b.y + tubeHeight) + ' a' + ballSize / 2 + ',' + ballSize /2 + ' 0 1, 0 ' +  tubeSize + ',' + 0;
                seriesPlot = g.selectAll('.plotBorder').data([tubePath, ballPath]);
                seriesPlot.enter().append('path').attr('class', 'plotBorder');
                
                
                seriesPlot.each(function(d, i){
                    var
                    g = d3.select(this),
                    plotOpts = {'fill': d3c_thermometer_fillGradient(i == 0 ? 'tube' : 'ball', opts.fill), 'fillOpacity': opts.fillOpacity, 'border': d3c_copy(opts.border)};
                    g.attr('d', d).call(d3c_applyBorderStyle, plotOpts.border, plotOpts, context);
                });
                
                var
                axis = g.selectAll(CN.FN.axis).data([axisOpts]),
                axisUpdate = (axis.enter().append('g').attr('class', CN.axis), axis),
                ranges = axisUpdate.selectAll(CN.FN.range).data(rangesOpts),
                rangesUpdate = ranges.enter().append('g').attr('class', CN.range),
                axisHeight = tubeHeight - axisOpts.yOffset,
                range = [axisHeight, 0];
//                axisUpdate.call(d3c_translate, (w + tubeSize) / 2, bounds.y + bounds.height - ballSize);
                axisUpdate.call(d3c_translate, bounds.x + (bounds.width + tubeSize) / 2 + axisOpts.xOffset, bounds.y + axisOpts.yOffset);
                
                scale.range(range);
                
                // Render ranges
                rangesUpdate.each(function(rangeOpts, i) {
                    var
                    g = d3.select(this),
                    y1 = scale(rangeOpts.x1 || extent[0]),
                    y2 = scale(rangeOpts.x2 || extent[1]),
                    x1 = rangesOpts.y1 || 0,
                    width = rangesOpts.y2 ? (rangesOpts.y2 - x1) : (axisOpts.tick.minor && axisOpts.tick.minor.size) || (axisOpts.tick.major && axisOpts.tick.major.size / 2) || Math.min(5, tubeSize / 5),
                    rect = g.selectAll('rect').data([[y1, y2, width]]),
                    rectUpdate = (rect.enter().append('rect'), rect);
                    rectUpdate
                    .attr('x', 1)
                    .attr('y', y2)
                    .attr('width', width)
                    .attr('height', Math.abs(y2-y1))
                    .call(d3c_applyBorderStyle, rangeOpts.border, rangeOpts, context);
                });
                
                // Render axis
                axisOpts.orient = 'right';
                axisOpts.label.position = 'same';
                axisOpts.tick.major.style = 'right';
                axisOpts.width = b.width;
                axisOpts.height = axisHeight;
                if (axisOpts.tick.minor) {
                    axisOpts.tick.minor.style = 'rgiht'; 
                }
                eAxis = _this.eAxis = new Axis(_this, context, axisOpts);
                eAxis.fScale(scale);
                eAxis.fRender(axisUpdate);
                
                // Render data
                var
                data = dataOpts,
                ballFill = d3c_thermometer_fillGradient('ball', data.fill),
                tubeFill = d3c_thermometer_fillGradient('tube', data.fill),
                tubeUpdate = g.selectAll(CN.FN.scaleTube).data([0]),
                ballUpdate =  g.selectAll(CN.FN.scaleBall).data([0]),
                ballOpts = {'fill': ballFill, 'fillOpacity': data.fillOpacity, 'border': {'strokeOpacity': 0}},
                tubeOpts = {'fill': tubeFill, 'fillOpacity': data.fillOpacity, 'border': {'strokeOpacity': 0}},
                scaleValue = scale(data.value);
                
                tubeUpdate.enter().append('path')
//                .call(d3c_translate, w / 2, b.y + tubeHeight)
                .call(d3c_applyBorderStyle, tubeOpts.border, tubeOpts, context)
                .attr('d', 'M' + (b.y + (b.width - tubeSize) / 2) + ',' + (b.y + tubeHeight) + ' l' + 0 + ',' + 1 + ' l' + tubeSize + ',' + 0 + ' l' + 0 + ',' + 1)
                .transition().duration(duration)
                .attr('d', function(d, i) {
                    console.log(d + ', ' + i);
                    return 'M' + (b.y + (b.width - tubeSize) / 2) + ',' + (b.y + tubeHeight) + ' l' + 0 + ',' + -(b.height - scaleValue) + ' l' + tubeSize + ',' + 0 + ' l' + 0 + ',' + (b.height - scaleValue)
                });
                
                ballUpdate.enter().append('path')
                .call(d3c_applyBorderStyle, ballOpts.border, ballOpts, context)
                .attr('d', ballPath);
            }
            
            renderSeries(b, 5000);
//            bbox = renderSeries(b, 0);
//            if (bbox.x < 0 || bbox.y < 0 || bbox.width > b.width || bbox.height > b.height) {
//                b.x += bbox.x < 0 ? Math.abs(bbox.x) : 0;
//                b.y += bbox.y < 0 ? Math.abs(bbox.y) : 0;
//                b.width = b.width * 2 - bbox.width;
//                b.height = b.height * 2 - bbox.height;
//                renderSeries(b, 1000);
//            }
            
        });
        return this;
    },
    fRedraw: function () {
        this.fRender(this.d3Sel);
    }
});

function d3c_thermometer_fillGradient(type, fill) {
    var fillOpts = {};
    if (type === 'ball') {
        // ball
        fillOpts.type = 'radialGradient';
        fillOpts.parameters = ['50%', '50%', '50%', '50%', '50%'];
        fillOpts.stops = [{
            offset : '0%',
            stopColor : 'rgb(225, 225, 225)',
            stopOpacity : 1
        }, {
            offset : '100%',
            stopColor : fill,
            stopOpacity : 1
        }
        ];
    } else {
        // Tube
        fillOpts.type = 'linearGradient';
        fillOpts.parameters = 'L,R';
        fillOpts.stops = [{
            offset:'0%',
            stopColor:fill,
            stopOpacity:1,
        },{
            offset:'30%',
            stopColor:'rgb(225, 225, 225)',
            stopOpacity:1,
        },{
            offset:'100%',
            stopColor:fill,
            stopOpacity:1,
        }];
    }
    
    return fillOpts;
}

