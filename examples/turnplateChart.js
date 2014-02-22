/**
 * New node file
 */
d3.chart = d3.chart || {};
d3.chart.turnplate = function(_id) {
	var
	id = _id || 'turnplateChart',
	cx,
	cy,
	startAngle,
	radius,
	wheelStyles, // fill, stroke
	itemNumber,
	itemRadius,
	itemStyles, // fill, stroke, text, font properties
	svg,
	wheelCircle,
	items,
	d3ColorPalette = d3.scale.category20(),
	transitionOpts,
	transitionCallback	,
	p = {};
	
	function turnplate(g) {
		var
		x = cx | 0,
		y = cy | 0,
		r = radius || 100,
		num = itemNumber || 10,
		wStyles = (function(){
			var s = wheelStyles || {};
			if (!s.fill) {
				s['fill-opacity'] = s['fill-opacity'] || 1e-6;
			}
			return s;
		})(),
		iStyles =(function(){
			var s = itemStyles || {};
			if (!s.fill) {
				s['fill'] = function(d) {
					return d3ColorPalette(d + ' ');
				};
				s['fill-opacity'] = s['fill-opacity'] || 0.5;
			} 
			return s;
		})(), 
		roundLen = 2 * Math.PI * r,
		arcLen = roundLen / num,
		innerR = r - (arcLen / 2),
		itemR = (arcLen = (roundLen = (2 * Math.PI * innerR)) / num , itemRadius || (arcLen / 2)),
		startLen = ((startAngle || 0) / 360) * roundLen,
		itemsPos = (function(){
			var data = [];
			for (var i = 0; i< num; i++) {
			    data.push((startLen + (i * arcLen)) % roundLen);
			}
			return data; 
		})(),
		transOpts = (function(){
			var opts = transitionOpts || {};
			opts.duration = opts.duration || 1000;
			opts.ease = opts.ease || 'cubic-in-out';
			opts.delay = opts.delay || 0;
			return opts;
		})(),
		scale = d3.scale.linear(),
		centerGroup;
		
		// Set scale domain and range.
		scale.domain([0, roundLen]).range([0, Math.PI * 2]);
		
		svg = g.selectAll('.' + id).data([0]);
		svg.enter().append('svg:svg').attr('class', id);
		centerGroup = svg.selectAll('.center').data([0]);
		centerGroup.enter().append('g').attr('class', 'center').attr('transform','translate(' + x  + ',' + y + ')');
		wheelCircle = centerGroup.selectAll('.wheel').data([0]);
		wheelCircle.enter().append('circle').attr('class', 'wheel').attr('r', r).style(wStyles);
		items = centerGroup.selectAll('.itemCircle').data(itemsPos);
		items.enter().append('g').attr('class', 'item');
		items.exit().remove();
		
		var itemCircles = items.append('circle'), i = 0;
		items.append('text').attr('dy', '.3em').text(function(){return i++;}).attr('text-anchor', 'middle');
		p.transOpts = transOpts;
		p.scale = scale;
		p.r = r;
		p.innerR;
		p.itemR = itemR;
		p.itemStyles = iStyles;
		p.itemTransformFunction = circlePosTransform;
		(transitionCallback || turnplate.CenterSpreadTransition)(items, itemCircles, p);
		
//		items.transition().duration(transOpts.duration).delay(transOpts.delay).ease(transOpts.ease).call(circlePosTransform, scale, (r - itemR));
//		itemCircles.attr('r', 0).transition().duration(transOpts.duration).delay(transOpts.delay).ease(transOpts.ease).attr('r', itemR).style(iStyles);
	}
	
	turnplate.cx = function() {
		if (!arguments.length) {
			return cx;
		} else {
			cx = arguments[0];
		}
		return turnplate;
	};
	
	turnplate.cy = function() {
		if (!arguments.length) {
			return cy;
		} else {
			cy = arguments[0];
		}
		return turnplate;
	};
	
	turnplate.startAngle = function() {
		if (!arguments.length) {
			return startAngle;
		} else {
			startAngle = arguments[0];
		}
		return turnplate;
	};
	
	turnplate.radius = function() {
		if (!arguments.length) {
			return radius;
		} else {
			radius = arguments[0];
		}
		return turnplate;
	};
	
	turnplate.wheelStyles = function() {
		if (!arguments.length) {
			return wheelStyles;
		} else {
			wheelStyles = arguments[0];
		}
		return turnplate;
	};
	
	turnplate.itemNumber = function() {
		if (!arguments.length) {
			return itemNumber;
		} else {
			itemNumber = arguments[0];
		}
		return turnplate;
	};
	
	turnplate.itemRadius = function() {
		if (!arguments.length) {
			return itemRadius;
		} else {
			itemRadius = arguments[0];
		}
		return turnplate;
	};
	
	turnplate.itemStyles = function() {
		if (!arguments.length) {
			return itemStyles;
		} else {
			itemStyles = arguments[0];
		}
		return turnplate;
	};
	
	turnplate.wheelSelection = function() {
		return wheelCircle;
	};
	
	turnplate.itemSelection = function() {
		if (!arguments.length) {
			// return all item selections.
			return items;
		} else {
			// return specified item selection by index argument.
			return d3.select(items[0][arguments[0]]);
		}
	};
	
	turnplate.transitionOpts = function() {
		if (!arguments.length) {
			return transitionOpts;
		} else {
			transitionOpts = arguments[0];
		}
		return turnplate;
	};
	
	turnplate.transitionCallback = function() {
		if (!arguments.length) {
			return transitionCallback;
		} else {
			transitionCallback = arguments[0];
		}
		return turnplate;
	};
	
	turnplate.InPlaceTransition = function(items, itemCircles, parameters) {
		var p = parameters;
		items.call(p.itemTransformFunction, p.scale, (p.r - p.itemR));
		itemCircles.attr('r', 0).transition().duration(p.transOpts.duration).delay(p.transOpts.delay).ease(p.transOpts.ease).attr('r', p.itemR).style(p.itemStyles);
	};
	
	turnplate.CenterSpreadTransition = function(items, itemCircles, parameters, callback) {
		var p = parameters;
		items.transition().duration(p.transOpts.duration).delay(p.transOpts.delay).ease(p.transOpts.ease).call(p.itemTransformFunction, p.scale, (p.r - p.itemR));
		itemCircles.attr('r', 0).transition().duration(p.transOpts.duration).delay(p.transOpts.delay).ease(p.transOpts.ease).attr('r', p.itemR).style(p.itemStyles);
	};
	
	function circlePosTransform (selection, scale, r) {
	    selection.attr("transform", function(d) {
	        return "translate(" + r * Math.sin(scale(d)) + "," + -r * Math.cos(scale(d)) + ")";
	    });
	};
	
	return turnplate;
}