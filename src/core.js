
// JavaScript Document

var CHART_GLOBAL = {
    lazyRender: true,
    prefix: 'd3charts'
};

// The field is used to count internally.
var internalCount = 0;

/**
 * The ClassNS object defines class name space, the t property defines top level
 * class name, the s property defines sub level class name.
 */
var CN = {
    svg: 'svg',
    chart: 'chart',
    chartTitle: 'chartTitle',
    legend: 'legend',
    legendItem: 'legendItem',
    plot: 'plot',
    seriesPlot: 'seriesPlot',
    axis: 'axis',
    xAxis: 'xAxis',
    yAxis: 'yAxis',
    series: 'series',
    
    barSeries: 'barSeries',
    lineSeries: 'lineSeries',
    areaSeries: 'areaSeries',
    pieSeries: 'pieSeries',
    dialSeries: 'dialSeries',
    bubbleSeries: 'bubbleSeries',
    scatterSeries: 'scatterSeries',
    
    linearSeries: 'linearSeries',
    bulletSeries: 'bulletSeries',
    sparkLineSeries: 'sparkLineSeries',
    cylinderSeries: 'cylinderSeries',
    thermometerSeries: 'thermometerSeries',
        
    gadget: 'gadget',
    border: 'border',
    label: 'label',
    title: 'title',
    icon: 'icon',
    tooltip: 'tooltip',
    
    bands: 'bands',
    ranges: 'ranges',
    pointers: 'pointers',
    
    
    tick: 'tick',
    major: 'major',
    minor: 'minor',
    marker: 'marker',
    band: 'band',
    line: 'line',
    range: 'range',
    pointer: 'pointer',
    indicator: 'indicator',
    arcDial: 'arcDial',
    measure: 'measure',
    target: 'target',
    border: 'border',
    seriesPlot: 'seriesPlot',
    domain: 'domain',
    dialArc: 'dialArc',
    ledLabel : 'ledLabel',
    scaleTube : 'scaleTube',
    scaleBall : 'scaleBall'
};

var FN = function () {
    var fn = {};
    for (var i in CN) {
        fn[i] = '.' + CN[i];
    }
    return fn;
};
CN.FN = FN();

/**
 * The exception class.
 */
function Exception(_id, _content) {
    this.fInit.apply(this, arguments);
}

Exception.prototype = {
    _super: null,
    id: null,
    content: null,
    fInit: function (_id, _content) {
        this.id = _id;
        this.content = _content;
    }
};

Exception.ID_OPTION_UNDEFINED = 1001;

/**
 * The object defines default option values of label.
 */
var DefaultLabelOptions = {
    enabled: false, // default is true,
    text: '', // the content.
    xOffset: 0,
    yOffset: 0,
    anchor: 'start', // start/middle/end
    rotation: 0, // degree of rotation, positive is clockwise.
    rotatoinAnchor: 'start', // start/middle/end
    font: {
        fill: 'black', // text
        fillOpacity: 0
    //  fontName:'',
    //  fontSize:''
    },
    padding: { // Padding space between test and border.
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    border: {
        enabled: false, // default is false
        stroke: 'black', // color value, default is null.
        strokeOpacity: 1, // default is 1, not transparency.
        strokeWidth: 0, // Number, default is 0.
        dashStyle: 'solid',
        roundCorner: 0  // Number, default is 0.
    },
//    fill: 'white', // background color.
    fillOpacity: 0
// Number, default is 0 that means transparency.
// cssStyle:{} // CSS style properties to apply for this label text.
};


/**
 * The object defines default option values of series, the initial object
 * contains general series object, and different series implementation file
 * should add concrete series default options to this object, the property name
 * is series name.
 */
var DefaultSeriesOptions = {
        baseSeries: {
            type: '',
            name: '', // The name should be anything including string, object or function and so on.
            layoutData: { // enabled when plot layout is grid type.
                vertialSpan: 1,
                horizontalSpan: 1
            },
            data: [] // The data allows array and function.
        }
    };

/**
 * The default targets options, different series may have different default
 * value for targets, concrete series should register default setting into this
 * object. The property name is targets' container.
 */
var DefaultTargetsOptions = {
        'bulletSeries': {} // 
};

/**
 * Similar to DefaultTargetsOptios.
 */
var DefaultRangesOptions = {}; //

var DefaultBandsOptions = { 
    enabled: true,
    type: 'line', // line or range
//    x1: 0,
//    x2: 0,
    fill: 'black',
    fillOpacity: 1,
    border: {},
    labelPosition: 'below', // above, below
    label: {
        enabled: false,
        text:'',
        font:{
            fill: 'black',
            fillOpacity: 1,
            textAnchor: 'middle', // start/middle/end
        },
        fill: 'white',
        fillOpacity: 1e-6,
        border: {}, 
    },
    markerPosition: 'below', // above, below
    marker: { // Only enabled for line band.
        enabled: false,
        type: 'circle',
        size: 5,
        border: {},
        fill: 'white',
        fillOpacity: 1
    }
};

/**
 * The object defines default option values of axis.
 */
var DefaultAxisOptions = {
    enabled: true,
//    orient: 'bottom', // top, bottom, left, right, in, out
    reverse: false, // Indicate if axis is reverse direction
    xOffset: 0, // The x offset relative to origin x of axis container, default is 0 
    yOffset: 0, // The y offset relative to origin y of axis container, default is 0
    title: { // Inherit from label options and add following additional options. 
        position: '', // left/middle/right/top/bottom
        
    },
    label: {
        enabled: true,
        normalize: true, // Used for dial axis label, true means the label will be rotated rather than horizontal.
        fill: 'black',
        fillOpacity: 1,
        font: {
             
        },
//        anchor: 'middle', // start/middle/end
        rotation: 0,
        position: 'same', // 'same' or 'opposite', 'same' means label is at same side with major ticks, 'opposite' means different side with major ticks.
        format: null
    },
    axisLine: {
        enabled: true,
        stroke: 'black',
        strokeOpacity: 1,
        strokeWidth: 1 // stroke-width
    },
    tick: {
        enabled: true,
        padding: 3,
        scale: {
//          stepNumber:0,
//          stepInterval:0,
//          min:,
//          max:,
//          autoExpand:false,// TRUE indicate to ignore min/max when actual
            // value exceeds min/max
        },
        outerTickSize: 6,
        showStartTickLabel: true,
        showEndTickLabel: true,
        major: {
            enabled: true,
            stroke: 'black',
            strokeOpacity: 1,
            strokeWidth: 2,
            style: 'below',// cross/above/below
            size: 6,
            lineStepNumber: 1
        },
        minor: {
            enabled: false,
            count: 3,
            stroke: 'black',
            strokeOpacity: 1,
            strokeWidth: 1,
            style: 'below',// cross/above/below
            size: 4
        }
    }
//    bands : DefaultBandsOptions // Array in runtime options.
};

var DefaultXAxisOptions = d3c_merge(d3c_clone(DefaultAxisOptions), {
    
});

var DefaultYAxisOptions = d3c_merge(d3c_clone(DefaultAxisOptions), {
    
});

/**
 * The object defines default option values of chart.
 */
var DefaultChartOptions = {
    // width:,
    // height:,
    // fill:,
    fillOpacity: 0,
//  margin: {},
    border: {},
    
    colorPalette: [0x1f77b4, 0xff7f0e, 0x2ca02c, 0xd62728, 0x9467bd,
                    0x8c564b, 0xe377c2, 0x7f7f7f, 0xbcbd22, 0x17becf],
    title: {
        enabled: false, // default is true,
        // text: '', // the content.
        position: 'top', // top/right/bottom/left/floating.
        x: 0, // x coordinate relative to container, be valid when position is
        // floating.
        y: 0, // y coordinate relative to container, be valid when position is
        // floating.
        anchor: 'start', // start/middle/end
        vAlign: 'middle', // top/middle/bottom, floating position will ignore
        // this option.
        hAlign: 'middle', // left/middle/right, floating position will ignore
        // this option.
        rotation: 0, // degree of rotation, positive is clockwise.
        rotatoinAnchor: 'start', // start/middle/end
        // font: {
        // fontName:'',
        // fontSize:''
        // },
        margin: { // margin space between title and container.
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        },
        padding: { // Padding space between test and border.
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        },
        borderStyle: {
            enabled: false, // default is false
            stroke: 'black', // color value, default is null.
            strokeOpacity: 1, // default is 1, not transparency.
            strokeWidth: 0, // Number, default is 0.
            dashStyle: 'solid',
            roundCorner: 0
        // Number, default is 0.
        },
        // fill:'', // background color in border area.
        fillOpacity: 0,
//        background: '', // background color of title
        backgroundOapcity: 0
    // Number, default is 0 that means transparency.
    // cssStyle:{} // CSS style properties to apply for this label text.
    },
    legend: {
        enabled: false,
        position: '', // top/right/bottom/left/floating
        x: 0, // The x coordinate of legend if position is floating.
        y: 0,  // The y coordinate of legend if position is floating.
        borderStyle: {
            enabled: false, // default is false
            stroke: 'black', // color value, default is null.
            strokeOpacity: 1, // default is 1, not transparency.
            strokeWidth: 0, // Number, default is 0.
            roundCorner: 0  // Number, default is 0.
        },
        legendItem: {
            // arrangement: '', // vertical/horizontal, the default value
            // depends on legend position, vertical is default for left/right
            // legend position, horizontal is default for top/bottom legend
            // position.
            // icon: '', // No default value, the value depends on series type.
            label: {}, // default label options without x/y/padding/borderStyle
                        // options
            borderStyle: {
                enabled: false, // default is false
                stroke: 'black', // color value, default is null.
                strokeOpacity: 1, // default is 1, not transparency.
                strokeWidth: 0, // Number, default is 0.
                roundCorner: 0
            // Number, default is 0.
            },
            // fill:'', // background color in border area.
            fillOpacity: 0
        }
    },
    plot: {
        layout: {
            type: 'mixed', // It contains two types, mixed/grid, default is mixed.
            rows: 0, // row number for grid layout, the height of each row will get same size to fit total height of plot.
            columns: 0 // column number for grid layout, the width of each column will get same size to fit total width of plot.
        },
        // fill:'',
        fillOpacity: 0,
        border: {},
        series: DefaultSeriesOptions
    }
//    ,
    // category: {},
//    xAxis: DefaultXAxisOptions,
//    yAxis: DefaultYAxisOptions  // Array
};

/**
 * The object defines default options.
 */
var DefaultOptions = {
    // lang:{},
    chart: DefaultChartOptions
};

/**
 * Chart context class.
 */
function ChartContext(svgSelection) {
    this.fInit.apply(this, arguments);
}

ChartContext.prototype = {
    _super: null,
    eContainer: null,
    options: null,
    themeOpts: null,
    eChart: null,
    chartId: null,
    defs: null,
    fInit: function (svgSelection) {
        this.svgSelection = typeof svgSelection === 'string' ? d3.select(svgSelection) : svgSelection;
    },
    fOptions: function () {
        if (!arguments.length) {
            return this.options;
        } else {
            this.options = arguments[0];
        }
    },
    fTheme: function () {
        if (!arguments.length) {
            return this.themeOpts;
        } else {
            this.themeOpts = arguments[0];
        }
    },
    fContainer: function () {
        if (!arguments.length) {
            return this.eContainer;
        } else {
            this.eContainer = arguments[0];
        }
    },
    fChart: function () {
        if (!arguments.length) {
            return this.eChart;
        } else {
            this.eChart = arguments[0];
        }
    },
    fChartId: function () {
        if (!arguments.length) {
            return this.chartId;
        } else {
            this.chartId = arguments[0];
        }
    },
    fDefs: function () {
        if (!arguments.length) {
            return this.defs ? this.defs : (this.defs = this.svgSelection.append('defs'));
        } else {
            this.defs = arguments[0];
        }
    }
};

/**
 * This class defines two abstract callbacks for user to do custom process during rendering.
 */
var RendererCallback = d3c_extendClass(null, null, {
    _super: null,
    fBeforeRendering: function () {
        
    },
    fAfterRendering: function () {
        
    }
});
/**
 * Element class is base class of chart.
 */
var Element = d3c_extendClass(null, RendererCallback,  {
    _super: null,
    eContainer: null,
    chartContext: null,
    options: null,
    d3Sel: null,
    _CLASS_NAMES: 'element',
    classNames: null,
    isRendered: false,
    fInit: function (_container, _chartContext, _options) {
        this.eContainer = _container;
        this.chartContext = _chartContext;
        this.options = _options || {};
    },
    fApplyChange: function (callerFunction) {
        if (!CHART_GLOBAL.lazyRender) {
            this.fRedraw();
        }
        return this;
    },
    fRender: function () {
        this.fBeforeRendering.apply(this, arguments);
        this._fRender.apply(this, arguments);
        this.isRendered = true;
        this.fAfterRendering.apply(this, arguments);
        return this;
    },
    _fRender: function () {
        // Do nothing in abstract method.
        return this;
    },
    fRedraw: function () {
        // Only render element after destory successfully. Before first
        // rendering, the element have not been rendered, so it is forbidden to
        // redraw.
        if (this.fDestory()) {
            this.fRender(this.d3Sel);
        }
        
        return this;
    },
    fOptions: function () {
        if (!arguments.length) {
            return this.options;
        } else {
            this.options = arguments[0];
            return this.fApplyChange(this.fOptions);
        }
    },
    fX: function () {
        if (!arguments.length) {
            return this.options && this.options.x;
        } else if (this.options) {
            this.options.x = arguments[0];
            if (this.isRendered) {
                this.d3Sel.attr('x', this.options.x);
                return this;
            } else {
                return this.fApplyChange(this.fX);
            }
        }
    },
    fY: function () {
        if (!arguments.length) {
            return this.options && this.options.y;
        } else if (this.options) {
            this.options.y = arguments[0];
            if (this.isRendered) {
                this.d3Sel.attr('y', this.options.y);
                return this;
            } else {
                return this.fApplyChange(this.fY);
            }
        }
    },
    fWidth: function () {
        if (!arguments.length) {
            return this.options && this.options.width;
        } else if (this.options) {
            this.options.width = arguments[0];
            return this.fApplyChange(this.fWidth);
        }
    },
    fHeight: function () {
        if (!arguments.length) {
            return this.options && this.options.height;
        } else if (this.options) {
            this.options.height = arguments[0];
            return this.fApplyChange(this.fHeight);
        }
    },
    fClassNames: function () {
        if (!arguments.length) {
            return this.classNames || this._CLASS_NAMES;
        } else {
            this.classNames = arguments[0];
            if (this.isRendered) {
                this.d3Sel.attr('class', this.classNames);
            } else {
                return this.fApplyChange(this.fClassNames);
            }
        }
    },
    fAttr: function () {
        var type = null;
        if (this.d3Sel) {
            if (arguments.length === 1) {
                type = typeof arguments[0];
                if (type === 'string') {
                    return this.d3Sel.attr(arguments[0]);
                } else if (type === 'object') {
                    this.d3Sel.attr.apply(this, arguments);
                }
            } else if (arguments.length) {
                this.d3Sel.attr.apply(this, arguments);
            }
        }
    },
    fGetBBox: function () {
        return this.d3Sel ? d3c_copy(this.d3Sel.bbox()): {};
    },
    fDestory: function () {
        if (this.d3Sel) {
            this.d3Sel.selectAll('*').remove();
            //delete this;
            this.isRendered = false;
            return true;
        } else {
            return false;
        }
    }
});

