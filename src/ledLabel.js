/**
 *
 */

var DefaultLedLabelOptions = {
    value : 0,
    width : 0,
    digitCount : 3,
    negative : false,
    decimals : 0,
    gap: 130,
    fill: 'black',
    fillOpacity: 0.15
};

var LedLabel = d3c_extendClass(null, Element, {
        value : null,
        digits : [0],
        _scale : null,
        _dispUpdate : null,
        _fRender : function () {
            var
            i = 0,
            opts = this.options,
            width = opts.width,
            digitCount = opts.digitCount,
            gap = opts.gap,
            _scale = this._scale,
            d3Sel = (this.d3Sel = this.d3Sel || this.eContainer.d3Sel.append('g').attr('class', CN.ledLabel));
            
            this.digits = new Array(digitCount);
            for (i = 0; i < digitCount; i++) {
                this.digits[i] = 0;
            }  
            
            _scale = this._scale = width / (gap * digitCount + 50);
            // var height= 200 * _scale;

            var disp = d3Sel.selectAll(".digit").data(this.digits);
            this._dispUpdate = (disp.enter().append("g").attr("class", "digit"), d3.transition(disp));
            this._dispUpdate.attr("transform", function (d, i) {
                return "translate(" + (width - gap * _scale * i - 80 * _scale) + ", " + (20 * _scale) + ")";
            })
            .call(d3c_led_drawDigit, _scale);
            if (opts.fill) {
                this._dispUpdate.style({'fill': d3c_adaptFill.call(this._dispUpdate, opts.fill, this.chartContext).value, 'fill-opacity': opts.fillOpacity || 1e-6});
            }
            return this.fValue(opts.value || 0);
        },
        fValue : function (val) {
            var 
            opts = this.options,
            decimals = opts.decimals,
            negative = opts.negative,
            digits = this.digits;
            
            if (!arguments.length) {
                return opts.value;
            }
            opts.value = val;

            var v = Math.round(Math.abs(val) * Math.pow(10, decimals));
            this._dispUpdate.each(function (d, i) {
                var g = d3.select(this);

                if (!negative && val < 0) {
                    digits[i] = -1;
                    d3c_led_litDigit(g, 10, false);
                    return;
                }

                digits[i] = v % 10;
                d3c_led_litDigit(g, digits[i], (i == decimals));
                if (v < 10 && i >= decimals) {
                    if (negative && v == -1 && val < 0 && i > decimals) {
                        digits[i] = -1;
                        d3c_led_litDigit(g, 10, false);
                        val = -val;
                    } else {
                        v = -1;
                    }
                } else {
                    v = Math.floor(v / 10);
                }
            });
            
            // Enable or disable 
            this._dispUpdate.selectAll('.off').style('fill-opacity', opts.fillOpacity || 1e-6);
            this._dispUpdate.selectAll('.on').style('fill-opacity', 1);
            return this;
        },
        fDigitCount : function (x) {
            if (!arguments.length) {
                return this.options.digitCount;
            } else {
                this.options.digitCount = x;
                this.digits = new Array(this.options.digitCount);
                for (var i = 0; i < this.options.digitCount; i++) {
                    this.digits[i] = 0;
                }  
                return this.fApplyChange(this.fDiditCount);
            }
        },
        fDecimals : function (x) {
            if (!arguments.length) {
                return this.options.decimals;
            } else {
                this.options.decimals = x;
                return this.fApplyChange(this.fDecimals);
            }
        },
        fWidth : function (x) {
            if (!arguments.length) {
                return this.options.width;
            } else {
                this.options.width = x;
                return this.fApplyChange(this.fWdith);
            }
        },
        fNegative : function (x) {
            if (!arguments.length) {
                return this.options.negative;
            } else {
                this.options.negative = x;
                return this.fApplyChange(this.fNegative);
            }
        },
        fGap : function (x) {
            if (!arguments.length) {
                return this.options.gap;
            } else {
                this.options.gap = x;
                return this.fApplyChange(this.fGap);
            }
        }
    });

function d3c_led_drawDigit(element, scale) {
    var ll = 40 * scale;
    var aa = 10 * scale;
    var bb = 10 * scale;
    var cc = 2 * scale;
    var rr = 10 * scale;
    var a = d3c_led_drawSegment(element, 0, 0, ll, aa, bb, cc, 0);
    var b = d3c_led_drawSegment(element, 35 * scale, 42 * scale, ll, aa, bb, -cc, 100);
    var c = d3c_led_drawSegment(element, 21 * scale, 126 * scale, ll, aa, bb, -cc, 100);
    var d = d3c_led_drawSegment(element, -28 * scale, 168 * scale, ll, aa, bb, cc, 0);
    var e = d3c_led_drawSegment(element, -62 * scale, 126 * scale, ll, aa, bb, -cc, 100);
    var f = d3c_led_drawSegment(element, -48 * scale, 42 * scale, ll, aa, bb, -cc, 100);
    var g = d3c_led_drawSegment(element, -14 * scale, 84 * scale, ll, aa, bb, cc, 0);
    var dot = element.append("circle")
        .attr("cx", 32 * scale)
        .attr("cy", 175 * scale)
        .attr("r", rr)
        .attr("class", "off")
        .style("stroke", "none");
    return [a, b, c, d, e, f, g, dot];
}

function d3c_led_drawSegment(e, cx, cy, l, a, b, c, angle) {
    return e.append("path")
    .attr("d", "M" + (cx + l) + " " + cy + "L" + (cx + l - a + c) + " " + (cy - b) + "L" + (cx - l + a + c) + " " + (cy - b) + "L" + (cx - l) + " " + (cy) + "L" + (cx - l + a - c) + " " + (cy + b) + "L" + (cx + l - a - c) + " " + (cy + b))
    .attr("transform", function () {
        return "rotate(" + angle + " " + cx + " " + cy + ")";
    })
    .attr("class", "off")
    .style("stroke", "none");
}

function d3c_led_litDigit(digit, val, dot) {
    var cond = [];
    switch (val) {
    case 1:
        cond = [0, 1, 1, 0, 0, 0, 0];
        break;
    case 2:
        cond = [1, 1, 0, 1, 1, 0, 1];
        break;
    case 3:
        cond = [1, 1, 1, 1, 0, 0, 1];
        break;
    case 4:
        cond = [0, 1, 1, 0, 0, 1, 1];
        break;
    case 5:
        cond = [1, 0, 1, 1, 0, 1, 1];
        break;
    case 6:
        cond = [1, 0, 1, 1, 1, 1, 1];
        break;
    case 7:
        cond = [1, 1, 1, 0, 0, 0, 0];
        break;
    case 8:
        cond = [1, 1, 1, 1, 1, 1, 1];
        break;
    case 9:
        cond = [1, 1, 1, 1, 0, 1, 1];
        break;
    case 0:
        cond = [1, 1, 1, 1, 1, 1, 0];
        break;
    case 10:
        cond = [0, 0, 0, 0, 0, 0, 1];
        break;
    default:
        cond = [0, 0, 0, 0, 0, 0, 0];
    }

    digit.selectAll("*").each(function (d, i) {
        d3.select(this).attr("class", (i < 7 && cond[i]) || (i == 7 && dot) ? "on" : "off");
    });
}