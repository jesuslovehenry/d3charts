
var Plot = d3c_extendClass(null, Element, {
    _CLASS_NAMES: CN.plot,
    eSeries: null,
    fInit: function () {
        this._super.fInit.apply(this, arguments);
        this.eSeries = [];
    },
    _fRender: function () {
        var
        chartContext = this.chartContext,
        opts = this.options,
        x = opts.x,
        y = opts.y,
        w = opts.width,
        h = opts.height,
        i = 0,
        series = null,
        border;
        
        if (opts.layout.type === 'mixed') {
            // All series will be painted at same position without considering overlay.
        } else if ( opts.layout.type === 'grid') {
            // All series will be painted at specified cells of grid.
        }
        
        this.d3Sel = this.d3Sel || this.eContainer.d3Sel.append('g').datum(opts).attr({'x': x, 'y': y, 'class': this.fClassNames()});
        d3c_translate(this.d3Sel, x, y);
        border = this.d3Sel.append('rect').attr('class', CN.border).attr({'x': 0, 'y': 0, 'width': w, 'height': h}).datum(opts.border);
        d3c_applyBorderStyle(border, opts.border, opts, chartContext);
        
        i = opts.series.length;
        while (i--) {
            serieOpts = opts.series[i];
            serieOpts.x = x;
            serieOpts.y = y;
            serieOpts.width = w;
            serieOpts.height = h;
            
            // Adjust series fill with color palette setting.
            if (this.chartContext.options.chart.colorPalette) {
                var len = this.chartContext.options.chart.colorPalette.length;
                serieOpts.fill = serieOpts.fill || this.chartContext.options.chart.colorPalette[i % len];
            }
            
            this.eSeries.push(series =  d3c_createSeries.call(this, this, this.chartContext, serieOpts));
            series.fRender();
        }
    }
});

