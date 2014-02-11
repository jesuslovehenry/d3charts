/**
 * Label class extends from Element class.
 */

var Label = d3c_extendClass(null, Element, {
    _CLASS_NAMES: CN.label,
    _fRender: function (g) {
        var
        _this = this;
        context = this.ChartContext,
        opts = this.options,
        paddingOpts = d3c_adaptMargin(opts.padding),
        format = opts.format,
        xOffset = opts.xOffset || 0,
        yOffset = opts.yOffset || 0,
        bbox = null,
        borderUpdate = null,
        textUpdate = null;
        
        this.d3Sel = g;
        g.each(function (d, i) {
            var 
            g = d3.select(this),
            text = opts.text || d;
            
            if (!g.attr('class')) {
                g.attr('class', _this.fClassNames());
            }
            if (opts.enabled === false) {
                return this;
            };
            
            if (opts.fill && opts.border) {
                borderUpdate = d3c_createBorder(g, opts, context);
            }
            
            textUpdate = g.selectAll('text').data([opts]);
            textUpdate.enter().append('text');
            textUpdate.text(typeof format === 'function' ? format.call(this, text) : d3c_format(text, format));
            textUpdate.call(d3c_applyFontStyle, opts.font, context).attr({'x': xOffset, 'y': yOffset, 'dy': '.8em'});
            bbox = g.bbox(true);
            
            if (borderUpdate) {
                borderUpdate.attr({'x': xOffset, 'y': yOffset, 'width': paddingOpts.left + bbox.width + paddingOpts.right, 'height': paddingOpts.top + bbox.height + paddingOpts.bottom});
            }
            
            d3c_translate(textUpdate, paddingOpts.left, paddingOpts.top);
            
            if (opts.anchor === 'middle') {
                textUpdate.attr('x', xOffset -bbox.width / 2);
                if (borderUpdate) {
                    borderUpdate.attr('x', xOffset -(paddingOpts.left + bbox.width + paddingOpts.right) / 2);
                }
            } else if (opts.anchor === 'end') {
                textUpdate.attr('x', xOffset -bbox.width);
                if (borderUpdate) {
                    borderUpdate.attr('x', xOffset -(paddingOpts.left + bbox.width + paddingOpts.right));
                }
            }
            
            if (opts.rotation) {
                g.call(d3c_rotate, opts.rotation, opts.rotationAnchor);
            }
        });
        
        return this;
    },
    fLabelFromat: function () {
        if (!arguments.length) {
            return this.options.format;
        } else {
            this.options.format = arguments[0];
            return this.fApplyChange(this.fLabelFormat);
        }
    }
});
