/**
 * Title class
 */

var Title = d3c_extendClass(null, Label, {
    _CLASS_NAMES: CN.title,
    _fRender: function () {
        var opts = this.options,
            x = opts.x,
            y = opts.y,
            w = opts.width,
            h = opts.height,
            m = opts.margin,
            vAlign = opts.vAlign,
            hAlign = opts.hAlign,
            bbox = null,
            dx = null,
            dy = null;
        if (!opts.enabled) {
            return this;
        }
        
        this.d3Sel = this.eContainer.d3Sel.append('g').attr('class', this.fClassNames());
        bbox = this._super.fRender.apply(this.d3Sel, arguments).fGetBBox();
        m = d3c_adaptMargin(m);
        bbox = d3c_plusOfMargin2BBox(bbox, m);
        
        if (w) {
            if (bbox.width < w) {
                if (hAlign === 'left') {
                    dx = x + m.left;
                } else if (hAlign === 'middle') {
                    dx = (w - bbox.width) / 2 - m.left;
                } else if (hAlign === 'right') {
                    dx = w - bbox.width - m.right;
                }
            }    
        } else {
            w = bbox.width;
        }
        
        if (h) {
            if (bbox.height < h) {
                if (vAlign === 'top') {
                    dy = y + m.top;
                } else if (vAlign === 'middle') {
                    dy = (h - bbox.height) / 2 - m.top;
                } else if (vAlign === 'bottom') {
                    dy = h - bbox.height - m.bottom;
                } 
            }    
        } else {
            h = bbox.height;
        }
        
        if (dx || dy) {
            // Adjust title position.
            d3c_translate(this.d3Sel, dx || x, dy || y);
        }
    }
});