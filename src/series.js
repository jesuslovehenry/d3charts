var LinearSeries = {
    type : 'linear',
    x : 0,
    y : 0,
    width : 0,
    height : 0,
    orient : 'horizontal', //Horizontal or vertialcal.
    fill : '',
    fillOpaticy : 1e-6,
    border : {},
    axisIndex : 0,
    data : { // Array
        value : 0,
        marker : {},
        label : {}
    },
    ranges : { // Array

    }
};

var BulletSeries = {
    type : 'bullet',
    x : 0,
    y : 0,
    width : 0,
    height : 0,
    orient : 'horizontal', //Horizontal or vertical.
    fill : '',
    fillOpacity : 1e-6,
    border : {},
    axisIndex : 0,
    data : {}, // Array
    target : {}, // properties are same with data
    ranges : {}
};

var SparkLineSeries = {
    type : 'sparkLine',
    x : 0,
    y : 0,
    width : 0,
    height : 0,
    fill : '',
    fillOpacity : 1e-6,
    border : {},
    data : [], // Array
    line : {},
    markers : { // Array of start/end/low/high
        enabled: false,
        marker : {}
    }
};

var ThermometerSeries = {
    type : 'thermometer',
    x : 0,
    y : 0,
    width : 0,
    height : 0,
    fill : '',
    fillOpacity : 1e-6,
    border : {},
    axisIndex : 0,
    ballSize : '5%',
    data : {}    // Array
};

var Cylinder = {
    type : 'cylinder',
    x : 0,
    y : 0,
    width : 0,
    height : 0,
    fill : '',
    fillOpacity : 1e-6,
    border : {},
    axisIndex : 0,
    cWidth : '10%',
    data : {}
    // Array
};

var LineSeries = {};

var AreaSeries = {};

var BubbleSeries = {};

var ColumnSeries = {};