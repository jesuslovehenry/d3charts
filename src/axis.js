/**
 * 
 */

var Axis = d3c_extendClass(null, Element, {
    _CLASS_NAMES: CN.axis,
    scale: null,
    tickValues: null,
    fInit: function () {
        this._super.fInit.apply(this, arguments);
        this.scale = d3.scale.linear();
    },
    _fRender: function (g) {
        var
        _this = this,
        p = this._p,
        context = this.chartContext,
        opts = this.options,
        labelOpts = opts.label,
        axisLineOpts = opts.axisLine,
        orient = opts.orient,
        tickOpts = opts.tick,
        scaleOpts = tickOpts.scaleOpts,
        tickNumbers = tickOpts.scale.stepNumber || 10,
        labelFormat = labelOpts && labelOpts.format,
        tickMajorSize = tickOpts.major.size,
        outerTickSize = tickMajorSize,
        tickMinorSize = tickOpts.minor.size,
        tickPadding = tickOpts.padding,
        tickSubdivide = tickOpts.minor.count || 3, 
        scale = this.scale,
        tickValues = this.tickValues,
        hasMinorTicks = false;
        
        this.d3Sel = g;
        g.each(function(d, i) {
            var
            g = d3.select(this).attr('class', _this.fClassNames());
            
            if (opts.enabled === false) return;
            
            // Set scale range according to width and height settings.
            if (orient === 'top' || orient === 'bottom') {
                scale.range([0,  opts.width]);
            } else {
                scale.range([opts.height, 0]);
            }
            
            // Stash a snapshot of the new scale, and retrieve the old snapshot.
            var
            scale0 = this.__scale__ || scale, 
            scale1 = this.__scale__ = scale.copy();
            
            // Do not set offset here, since all children element of axis depend
            // on coordinate of axis, it is better the container set offset of
            // axis group rather here
//            if (opts.xOffset !== 0 || opts.yOffset !== 0) {
//                d3c_translate(g, opts.xOffset, opts.yOffset);
//            }
            
            // Ticks, or domain values for ordinal scales.
            var
            majorStrokeStyle = {'stroke': d3c_adaptFill(tickOpts.major.stroke, context).value, 'stroke-opacity': tickOpts.major.strokeOpacity, 'stroke-width': tickOpts.major.strokeWidth},
            ticks = (tickValues === null) ? (scale1.ticks ? scale1.ticks.apply(scale1, [tickNumbers]) : scale1.domain()) : tickValues,
            tick = g.selectAll(CN.FN.tick + CN.FN.major).data(ticks, scale1),
            tickEnter = tick.enter().insert('g', '.domain').attr('class', CN.tick + ' ' + CN.major).style('opacity', 1e-6),
            tickExit = d3.transition(tick.exit()).style('opacity', 1e-6).remove(),
            tickUpdate = d3.transition(tick).style('opacity', 1),
            tickTransform = null,
            tickLabelFormat = String;
            
            if (labelFormat && p.labelFormat == labelFormat) {
                tickLabelFormat = p.labelFormat;
            } else if (typeof labelFormat === 'function') {
                tickLabelFormat = p.labelFormat = labelFormat;
            } else {
                if (typeof labelFormat === 'string') {
                    tickLabelFormat = p.labelFormat = scale1.tickFormat ? scale1.tickFormat.apply(scale1, [tickNumbers], labelFormat) : String; // String doesn't support format pattern now.
                } else {
                    tickLabelFormat = p.labelFormat = scale1.tickFormat ? scale1.tickFormat.apply(scale1, [tickNumbers]) : String; // String doesn't support format pattern now.
                }
            }
            
            if (tickOpts.minor && tickOpts.minor.enabled !== false ) {
                var
                minorStrokeStyle = {'stroke': d3c_adaptFill(tickOpts.minor.stroke, range).value, 'stroke-opacity': tickOpts.minor.strokeOpacity, 'stroke-width': tickOpts.minor.strokeWidth},
                subticks = d3c_axisSubdivide(scale, ticks, tickSubdivide),
                subtick = g.selectAll(CN.FN.tick + CN.FN.minor).data(subticks, String),
                subtickEnter = subtick.enter().insert('line', '.tick').attr('class', CN.tick + ' ' + CN.minor).style(minorStrokeStyle),
                subtickExit = d3.transition(subtick.exit()).style({'stroke-opacity' : 1e-6}).remove(),
                subtickUpdate = d3.transition(subtick).style(minorStrokeStyle);
                hasMinorTicks = true;
            }
            
            // Domain.
            var
            range = d3c_scaleRange(scale1),
            path = g.selectAll(CN.FN.domain).data([0]),
            pathUpdate = (path.enter().append('path').attr('class', CN.domain).style('fill', 'none'), d3.transition(path));
            
            tickEnter.append('line').style('fill', 'none');
            tickEnter.append('text');
            
            var
            lineEnter = tickEnter.select('line'),
            lineUpdate = tickUpdate.select('line');
            text = tick.select('text').text(tickLabelFormat),
            line = tick.select('line').style(majorStrokeStyle),
            textEnter = tickEnter.select('text');
            textUpdate = tickUpdate.select('text'),
            textBBox = null,
            majorOffset = null,
            minorOffset = null,
            labelOffset = null,
            axisPath = null;
            
            d3c_adaptPositions(opts);
            
            majorOffset = d3c_axisTickOffset(tickOpts.major, tickMajorSize, orient);
            minorOffset = d3c_axisTickOffset(tickOpts.minor, tickMinorSize, orient);
            labelOffset = d3c_axisLabelOffset(labelOpts, orient, tickOpts.major.style, tickOpts.major.size, tickPadding);
            axisPath = d3c_axisPath(orient, tickOpts.major.style, outerTickSize, range);
            if (orient === 'top' || orient === 'bottom') {
                tickTransform = d3_svg_axisX;
                lineEnter.attr('y1', majorOffset[0]).attr('y2', majorOffset[1]);
                textEnter.attr('y', labelOffset[0]);
                lineUpdate.attr('x2', 0).attr('y1', majorOffset[0]).attr('y2',  majorOffset[1]);
                textUpdate.attr('x', 0).attr('y', labelOffset[0]);
                text.attr('dy', labelOffset[1]).style('text-anchor', 'middle');
                if (hasMinorTicks) {
                    subtickEnter.attr('y1', minorOffset[0]).attr('y2', minorOffset[1]);
                    subtickUpdate.attr('x2', 0).attr('y1', minorOffset[0]).attr('y2',  minorOffset[1]);
                }
                
                pathUpdate.attr("d", axisPath);
            } else if (orient === 'left' || orient === 'right') {
                tickTransform = d3_svg_axisY;
                lineEnter.attr('x1', majorOffset[0]).attr('x2', majorOffset[1]);
                textEnter.attr('x', labelOffset[0]);
                lineUpdate.attr('x1', majorOffset[0]).attr('x2', majorOffset[1]).attr('y2', 0);
                textUpdate.attr('x', labelOffset[0]).attr('y', 0);
                text.attr('dy', labelOffset[1]).style('text-anchor', (d3c_adaptPosition(orient, labelOpts.position) === 'left' ? 'end' : 'start'));
                if (hasMinorTicks) {
                    subtickEnter.attr('x1', minorOffset[0]).attr('x2', minorOffset[1]);
                    subtickUpdate.attr('x1', minorOffset[0]).attr('x2', minorOffset[1]).attr('y2', 0);
                }
                pathUpdate.attr('d', axisPath);
            }
            
            // Apply tick label style
            if (labelOpts) {
                d3c_applyFontStyle(text, labelOpts.font, context);
                if (labelOpts.rotation) {
                    d3c_rotate(textEnter, labelOpts.rotation, labelOpts.rotationAnchor);
                }
            }
            textBBox = text.bbox();
            
            // Apply axis line style
            if (axisLineOpts && axisLineOpts.enabled !== false) {
                pathUpdate.style(d3c_toCssStyle(axisLineOpts));
            }
            
            // For ordinal scales:
            // - any entering ticks are undefined in the old scale
            // - any exiting ticks are undefined in the new scale
            // Therefore, we only need to transition updating ticks.
            if (scale1.rangeBand) {
              var dx = scale1.rangeBand() / 2, x = function(d) { return scale1(d) + dx; };
              tickEnter.call(tickTransform, x);
              tickUpdate.call(tickTransform, x);
            }

            // For quantitative scales:
            // - enter new ticks from the old scale
            // - exit old ticks to the new scale
            else {
              tickEnter.call(tickTransform, scale0);
              tickUpdate.call(tickTransform, scale1);
              tickExit.call(tickTransform, scale1);
              if (hasMinorTicks) {
                  subtickEnter.call(tickTransform, scale0);
                  subtickUpdate.call(tickTransform, scale1);
                  subtickExit.call(tickTransform, scale1);
              }
            }
        });
        
        return this;
    },
    fScale: function () {
        if (!arguments.length) {
            return this.scale;
        } else {
            this.scale = arguments[0];
            return this.fApplyChange(this.fScale);
        }
    },
    fScaleDomain: function (){
        if (!arguments.length) {
            return this.scale.domain();
        } else {
            this.scale.domain(arguments[0]);
            return this.fApplyChange(this.fScaleDomain);
        }
    },
    fTickValues: function () {
        if (!arguments.length) {
            return this.tickValues;
        } else {
            this.tickValues = arguments[0];
            return this.fApplyChange(this.fTickValues);
        }
    }
//    fScaleRange: function () {
//        if (!arguments.length) {
//            return this.scale.range();
//        } else {
//            this.scale.range(arguments[0]);
//            return this.fApplyChange(this.fScaleRange);
//        }
//    }
});

function d3c_scaleExtent(domain) {
    var start = domain[0], stop = domain[domain.length - 1];
    return start < stop ? [ start, stop ] : [ stop, start ];
}

function d3c_scaleRange(scale) {
    return scale.rangeExtent ? scale.rangeExtent() : d3c_scaleExtent(scale.range());
}

function d3c_axisTickOffset(tickOpts, tickSize, orient) {
    if ( orient === 'top' || orient === 'bottom') {
        return [(tickOpts.style === 'cross') ? -tickSize : 0,
                (tickOpts.style === 'above') ? -tickSize : ((!tickOpts.style && orient === 'top') ? -tickSize : tickSize)];
    } else {
        return [(tickOpts.style === 'cross') ? -tickSize : 0,
                (tickOpts.style === 'left') ? -tickSize : ((!tickOpts.style && orient === 'left') ? -tickSize : tickSize)];    
    }
}

function d3c_adaptPositions(opts, orient) {
    if (opts.label) {
        opts.label.position = d3c_adaptPosition(opts.orient, opts.label.position);
    }
    opts.tick.major.style = d3c_adaptPosition(opts.orient, opts.tick.major.style);
    if (opts.tick.minor) {
        opts.tick.minor.style = d3c_adaptPosition(opts.orient, opts.tick.minor.style);    
    }
}

function d3c_adaptPosition(orient, position) {
    if (position === 'corss') {
        return position;
    }
    
    if (orient === 'top') {
        return position === 'left' ? 'below' : (position === 'right' ? 'top' : position);
    } else if (orient === 'bottom') {
        return position === 'right' ? 'above' : (position === 'left' ? 'below' : position);
    } else if (orient === 'left') {
        return position === 'above' ? 'right' : (position === 'below' ? 'left' : position);
    } else if (orient === 'right') {
        return position === 'below' ? 'left' : (position === 'above' ? 'right' : position);
    } else {
        return position;
    }
}

function d3c_axisLabelOffset(opts, orient, tickStyle, tickSize, tickPadding) {
    var _tickStyle = d3c_adaptPosition(orient, tickStyle);
    if (opts.position === 'same') {
        opts.position = _tickStyle;
    } else if (opts.position === 'opposite') {
        opts.position = (_tickStyle === 'cross') ? ((orient === 'top') ? 'below' : (orient === 'bottom' ? 'above' : orient === 'left' ? 'right' : 'left'))
                : ((_tickStyle === 'below') ? 'above' : (_tickStyle === 'above' ? 'below' : _tickStyle === 'left' ? 'right' : 'left'));
    } 
    
    if (opts.position === 'cross') {
        opts.position = (orient === 'top') ? 'above' : (orient === 'bottom' ? 'below' : orient === 'left' ? 'left' : 'right');
    }
    
    if (orient === 'bottom' || orient === 'top') {
        if (opts.position === 'above') {
            return [((_tickStyle !== 'below') ? -Math.max(tickSize, 0) : 0) - tickPadding, '0em']; 
        } else {
            return [((_tickStyle !== 'above') ? Math.max(tickSize, 0) : 0) + tickPadding, '.8em'];
        }
    } else if (orient === 'left' || orient === 'right') {
        if (opts.position === 'left') {
            return [((_tickStyle !== 'right') ? -Math.max(tickSize, 0) : 0) - tickPadding, '.32em']; 
        } else {
            return [((_tickStyle !== 'left') ? Math.max(tickSize, 0) : 0) + tickPadding, '.32em'];
        }
    } 
}

//function d3c_axisPath(orient, tickStyle, outerTickSize, range) {
//    if (orient === 'top') {
//        if (tickStyle === 'cross') {
//            return 'M ' + range[0] + ',' + (-outerTickSize) + ' V' + outerTickSize + ' V0' + ' H' + range[1] + ' V' + outerTickSize + ' V' + (-outerTickSize);
//        } else if (tickStyle === 'below') {
//            return 'M ' + range[0] + ',' + outerTickSize + ' V0' + ' H' + range[1] + ' V' + outerTickSize;
//        } else {
//            return 'M ' + range[0] + ',' + (-outerTickSize) + ' V0' + ' H' + range[1] + ' V' + (-outerTickSize);
//        }
//    } else if (orient === 'bottom') {
//        if (tickStyle === 'cross') {
//            return 'M ' + range[0] + ',' + (-outerTickSize) + ' V' + outerTickSize + ' V0' + ' H' + range[1] + ' V' + outerTickSize + ' V' + (-outerTickSize);
//        } else if (tickStyle === 'above') {
//            return 'M ' + range[0] + ',' + (-outerTickSize) + ' V0' + ' H' + range[1] + ' V' + (-outerTickSize);
//        } else {
//            return 'M ' + range[0] + ',' + outerTickSize + ' V0' + ' H' + range[1] + ' V' + outerTickSize;
//        }
//    } else if (orient === 'left') {
//        if (tickStyle === 'cross') {
//            return 'M ' + range[0] + ',' + (-outerTickSize) + ' H' + outerTickSize + ' H0' + ' H' + range[1] + ' H' + outerTickSize + ' H' + (-outerTickSize);
//        } else if (tickStyle === 'right') {
//            return 'M ' + range[0] + ',' + outerTickSize + ' H0' + ' V' + range[1] + ' H' + outerTickSize;
//        } else {
//            return 'M ' + range[0] + ',' + (-outerTickSize) + ' H0' + ' V' + range[1] + ' H' + (-outerTickSize);
//        }
//    } else if (orient === 'right') {
//        if (tickStyle === 'cross') {
//            return 'M ' + range[0] + ',' + (-outerTickSize) + ' H' + outerTickSize + ' H0' + ' V' + range[1] + ' H' + outerTickSize + ' V' + (-outerTickSize);
//        } else if (tickStyle === 'left') {
//            return 'M ' + range[0] + ',' + (-outerTickSize) + ' H0' + ' V' + range[1] + ' H' + (-outerTickSize);
//        } else {
//            return 'M ' + range[0] + ',' + outerTickSize + ' H0' + ' V' + range[1] + ' H' + outerTickSize;
//        }
//    }
//}

function d3c_axisPath(orient, tickStyle, outerTickSize, range) {
    if (orient === 'top' || orient === 'bottom') {
        return 'M' + range[0] + ',0' + ' H' + range[1]; 
    } else if (orient === 'left' || orient === 'right') {
        return 'M' + range[0] + ',0' + ' V' + range[1];
    } 
}

function d3_svg_axisX(selection, x) {
    selection.attr("transform", function(d) { return "translate(" + x(d) + ",0)"; });
}

function d3_svg_axisY(selection, y) {
    selection.attr("transform", function(d) { return "translate(0," + y(d) + ")"; });
}

function d3c_axisSubdivide(scale, ticks, m) {
    var subticks = [];
    if (m && ticks.length > 1) {
        var extent = d3c_scaleExtent(scale.domain()), i = -1, n = ticks.length, d = (ticks[1] - ticks[0]) / ++m, j, v;
        while (++i < n) {
            for (j = m; --j > 0; ) {
                if ((v = +ticks[i] - j * d) >= extent[0]) {
                    subticks.push(v);
                }
            }
        }
        for (--i, j = 0; ++j < m && (v = +ticks[i] + j * d) < extent[1]; ) {
            subticks.push(v);
        }
    }
    return subticks;
}
