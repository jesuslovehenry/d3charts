/**
 * 
 */
// Define chart options
var options = {
	lang:{},
	chart:{
		colorPalette:{},
		title:{
			enabled:, // default is true.
			text:,
			rotation:,
			vAlign:, // top, bottom, center
			hAlign:, // left, bottom, center
			margin:, // number or {top:1, bottom:1, left:1, right:1}
			position: ,// left, top, bottom, right, floating
			x: , // valid when position is floating.
			y: , // valid when position is floating.
			height:,
			width:,
			border: {
				enabled:, // default is false
				style:{ // CSSObject
				},
				weight:,
				lineStyle:,
				color:,
			},
			style:{} // CSSObject
		},
		legend:{
			enabled:,
			position:,// top, bottom, left, right, floating
			style:{}, // CSSObject
			title:,
			border:,
			margin:,
			direction:,// vertical order or horizontal order of legend items
			x:, valid when position is floating
			y:, valid when position is floating,
			item: {
				style:{},// CSSObject
				border:,
				margin:
			}
		},
		xAxis:[],
		yAxis:[],
		plot:{},
		series:{},
		seriesGroup:{},
		category:{}
	}
};
