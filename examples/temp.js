function draw() {
    var opts = {
        chart : {
            // width:,
            // height:,
            fill : 'yellow',
            fillOpacity : 1,
            //            margin : {},
            border : {},

            colorPalette : [0x1f77b4, 0xff7f0e, 0x2ca02c, 0xd62728, 0x9467bd,
                0x8c564b, 0xe377c2, 0x7f7f7f, 0xbcbd22, 0x17becf],
            title : {
                enabled : false
            },
            legend : {
                enabled : false
            },
            plot : {
                layout : {
                    type : 'mixed', // It contains two types, mixed/grid, default is mixed.
                    rows : 0, // row number for grid layout, the height of each row will get same size to fit total height of plot.
                    columns : 0 // column number for grid layout, the width of each column will get same size to fit total width of plot.
                },
                // fill:'',
                fillOpacity : 0,
                border : {},
                series : [{
                        type : 'linear',
                        round : 20,
                        axisIndex : 0,
                        fill : {
                            type : 'linearGradient',
                            parameters : 'T,B',
                            stops : [{
                                    offset : '0%',
                                    stopColor : 'white',
                                    stopOpacity : 1
                                }, {
                                    offset : '100%',
                                    stopColor : 'blue',
                                    stopOpacity : 1
                                }
                            ]
                        },
                        fillOpacity : 1,
                        border : {
                            enabled : true,
                            stroke : 'red',
                            strokeOpacity : 1,
                            strokeWidth : 2,
                        },
                        data : [{
                                value : 150,
                                markerPosition : 'above', // below or above
                                marker : {
                                    enabled : true,
                                    type : 'circle',
                                    size : 20,
                                    fill : 'red',
                                    border : {},
                                },
                                labelPosition : 'above',
                                label : {
                                    enabled : true,
                                    text : '',
                                    font : {
                                        fill : 'black',
                                        fillOpacity : 1,
                                        textAnchor : 'middle', // start/middle/end
                                    },
                                    fill : 'pink',
                                    fillOpacity : 0.3,
                                    border : {
                                        stroke : 'red',
                                        strokeWidth : 2
                                    },
                                }
                            }, {
                                value : 50,
                                markerPosition : 'above', // below or above
                                marker : {
                                    enabled : true,
                                    type : 'triangle-down',
                                    size : 20,
                                    fill : 'blue',
                                    border : {},
                                },
                                labelPosition : 'below',
                                label : {
                                    enabled : true,
                                    text : '',
                                    font : {
                                        fill : 'black',
                                        fillOpacity : 1,
                                        textAnchor : 'middle', // start/middle/end
                                    },
                                    fill : 'pink',
                                    fillOpacity : 0.5,
                                    border : {
                                        stroke : 'red',
                                        strokeWidth : 2
                                    },
                                }
                            }
                        ]

                    }
                ]
            },
            yAxis : [{
                    enabled : true,
                    orient : 'bottom',
                    xOffset : 0, // The x offset relative to origin x of axis container, default is 0
                    yOffset : 0, // The y offset relative to origin y of axis container, default is 0
                    fill : 'pink', // Default is undefined.
                    fillOpacity : 0.5,
                    title : { // Inherit from label options and add following additional options.
                        position : '', // left/middle/right/top/bottom

                    },
                    label : {
                        enabled : true,
                        fill : 'black',
                        fillOpacity : 1,
                        font : {},
                        //        anchor: 'middle', // start/middle/end
                        rotation : 45,
                        rotationAnchor : 'middle',
                        position : 'opposite', // 'same' or 'opposite', 'same' means label is at same side with major ticks, 'opposite' means different side with major ticks.
                        format : null
                    },
                    axisLine : {
                        enabled : true,
                        stroke : 'red',
                        strokeOpacity : 1,
                        strokeWidth : 1 // stroke-width
                    },
                    tick : {
                        enabled : true,
                        padding : 3,
                        scale : {
                            //          stepNumber:0,
                            //          stepInterval:0,
                            //          min:,
                            //          max:,
                            //          autoExpand:false,// TRUE indicate to ignore min/max when actual
                            // value exceeds min/max
                        },
                        outerTickSize : 6,
                        showStartTickLabel : true,
                        showEndTickLabel : true,
                        major : {
                            enabled : true,
                            stroke : 'black',
                            strokeOpacity : 1,
                            strokeWidth : 1,
                            style : 'above', // cross/above/below
                            size : 10,
                            lineStepNumber : 1
                        },
                        minor : {
                            enabled : true,
                            count : 3,
                            stroke : 'black',
                            strokeOpacity : 1,
                            strokeWidth : 1,
                            style : 'above', // cross/above/below
                            size : 6
                        }
                    }
                }
            ]
        }
    }

    var svg = d3.select('body').append('div').attr({
            width : '800px',
            height : '150px'
        });
    var context = new d3charts.ChartContext();
    var linear = new d3charts.Chart(context1, opts).fRender(svg);

    var series = linear.fSeries('linear');
    setInterval(function () {
        series[0].fMovePointer(0, Math.random() * 160);
        series[0].fMovePointer(1, Math.random() * 160);
    }, 1000);
}
