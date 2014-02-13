/**
 * 
 */
d3charts = {
    ChartGlobal : CHART_GLOBAL,
    ClassNames : CN,
    ChartContext : ChartContext,
    Element : Element,
    LedLabel : LedLabel,
    Label : Label,
    Chart : Chart,
    Title : Title,
	Axis : Axis,
	ArcAxis : ArcAxis,
	Legend : Legend,
	Plot : Plot,
	DialSeries : DialSeries,
	LinearSeries : LinearSeries,
	BulletSeries : BulletSeries,
	ThermometerSeries: ThermometerSeries,
	api : {
	    clone: d3c_clone,
	    merge: d3c_merge,
	    translate: d3c_translate
	},
	SimpleBar: SimpleBar,
	SimpleBarCharts : SimpleBarCharts
};

window.d3charts = window.d3charts || d3charts;

})();