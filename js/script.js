+function ($) {

function range(start, stop, step) {
  var a = [start], b = start;
  while(b < stop) {b += step; a.push(b)}
  return a;
};

function add(a, b) {
    return a + b;
}

function deltaTempo (x1, y1, x2, y2, vel0) {
    var Dx = x2 - x1;
    var Dy = y2 - y1;
    
    if (Dx < 0) {
        return ["Delta X < 0!", ""];
    };
    
    var teta = Math.atan(Dy/Dx);
    var L = (Dx**2 + Dy**2)**(1/2);
    var v = (2*g*Math.sin(teta)*L + vel0**2)**(1/2);
    
    var dt = (v - vel0)/(g*Math.sin(teta));
/*    
    console.log(teta);
    console.log(L);
    console.log(v);
    console.log(dt);
*/
    return [dt, v];

};


function tempoTotal (x, y, var0, var1) {
    var lista_var = [];
    var Dvar = var1 - var0;
    
    for (var i = 0; i < numDePontos + 1; i++) {
        lista_var.push(i*(Dvar/numDePontos) + var0);
    };

    console.log(lista_var.length)
        
    var v0 = 0;
    var dts = [0];
    for (var i = 0; i < lista_var.length - 1; i++) {
        if (i != var1) {
            var valor_tx = x(lista_var[i]);
            var valor_ty = y(lista_var[i]);
            var valor_t1x = x(lista_var[i+1]);
            var valor_t1y = y(lista_var[i+1]);
            var delta_t = deltaTempo(valor_tx, valor_ty, valor_t1x, valor_t1y, v0);
            
            Xs.push(valor_tx);
            Ys.push(valor_ty);
            dts.push(delta_t[0]);
            v0 = delta_t[1];
        };
    };
            
    if ("Delta X < 0!" in dts) {
        return "Delta X < 0!";
    }
    
    else {
        var T = dts.reduce(add, 0);
        return T;
    };
};




$("#calcularTempo").click(function(){
  Xs = [];
  Ys = [];
  chartPontos = [];

  var xt = $("#xt").val();
  var yt = $("#yt").val();
  var t0 = $("#t0").val();
  var t1 = $("#t1").val();

/*
  xt = "x(t) = t";
  yt = "y(t) = -t";
  t0 = 0;
  t1 = 2;
*/

  xt = math.eval("x(t) = " + xt);
  yt = math.eval("y(t) = " + yt);
  t0 = math.eval(t0);
  t1 = math.eval(t1);



  //console.log(xt, yt, t0, t1);
  var resultado = tempoTotal(xt, yt, t0, t1);
  //console.log(xt(t0), yt(t1));
  //console.log(deltaTempo(0, 0, 2, -2, 0)[0]);
  //console.log(range(0, 9, 1));

  $("#resultado").text("Resultado: " + resultado + "s");

  var Xmax = math.max(Xs);
  var Xmin = math.min(Xs);
  var Ymax = math.max(Ys);
  var Ymin = math.min(Ys);

  var M = Xmax;
  var m = Xmin;

  if (Xmax < Ymax) {
    M = Ymax;
  };

  if (Xmin > Ymin) {
    m = Ymin;
  };

  console.log(M, m);

  for (i = 0; i <= Xs.length; i++) {
    chartPontos.push({"X": Xs[i], "Y": Ys[i]})
  }

  AmCharts.makeChart( "chartdiv", {
  "type": "xy",
  "startDuration": 1.5,
  "trendLines": [],
  "graphs": [
    {
      "id": "AmGraph-1",

      "xField": "X",
      "yField": "Y"
    }
  ],
  "guides": [],
  "valueAxes": [
    {
      "id": "ValueAxis-1",
      "maximum": 0,
      "minimum": m,
      "axisAlpha": 0
    },
    {
      "id": "ValueAxis-2",
      "maximum": M,
      "minimum": 0,      
      "position": "bottom",
      "axisAlpha": 0
    }
  ],
  "allLabels": [],
  "balloon": {},
  "titles": [],
  "dataProvider": chartPontos
})

});

$("#reta").click(function(){
  $("#xt").val("t");
  $("#yt").val("t*(-2)/pi");
  $("#t0").val("0");
  $("#t1").val("pi");
});

$("#circulo").click(function(){
  $("#xt").val("cos(t)");
  $("#yt").val("sin(t)");
  $("#t0").val("pi");
  $("#t1").val("3*pi/2");
});

$("#cicloide").click(function(){
  $("#xt").val("t - sin(t)");
  $("#yt").val("-1 + cos(t)");
  $("#t0").val("0");
  $("#t1").val("pi");
});

$("#grafico").click(function(){
  var xt = $("#xt").val();
  var yt = $("#yt").val();
  var t0 = $("#t0").val();
  var t1 = $("#t1").val();

  xt = math.eval("x(t) = " + xt);
  yt = math.eval("y(t) = " + yt);
  t0 = math.eval(t0);
  t1 = math.eval(t1);
});

var numDePontos = 10000;   // var0 + numDePontos
var g = -9.81;
var Xs = [];
var Ys = [];
var chartPontos = [];

}(jQuery);




/*
var chart;
var graph;

var chartData = chartPontos;


AmCharts.ready(function () {
    // SERIAL CHART
    chart = new AmCharts.AmSerialChart();

    chart.dataProvider = chartData;
    chart.marginLeft = 10;
    chart.categoryField = "year";

    // AXES
    // category
    var categoryAxis = chart.categoryAxis;
    categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
    categoryAxis.minPeriod = "YYYY"; // our data is yearly, so we set minPeriod to YYYY
    categoryAxis.dashLength = 3;
    categoryAxis.minorGridEnabled = true;
    categoryAxis.minorGridAlpha = 0.1;

    // value
    var valueAxis = new AmCharts.ValueAxis();
    valueAxis.axisAlpha = 0;
    valueAxis.inside = true;
    valueAxis.dashLength = 3;
    chart.addValueAxis(valueAxis);

    // GRAPH
    graph = new AmCharts.AmGraph();
    graph.type = "smoothedLine"; // this line makes the graph smoothed line.
    graph.lineColor = "#d1655d";
    graph.negativeLineColor = "#637bb6"; // this line makes the graph to change color when it drops below 0
    graph.bullet = "round";
    graph.bulletSize = 8;
    graph.bulletBorderColor = "#FFFFFF";
    graph.bulletBorderAlpha = 1;
    graph.bulletBorderThickness = 2;
    graph.lineThickness = 2;
    graph.valueField = "value";
    graph.balloonText = "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>";
    chart.addGraph(graph);

    // CURSOR
    var chartCursor = new AmCharts.ChartCursor();
    chartCursor.cursorAlpha = 0;
    chartCursor.cursorPosition = "mouse";
    chartCursor.categoryBalloonDateFormat = "YYYY";
    chart.addChartCursor(chartCursor);

    // SCROLLBAR
    var chartScrollbar = new AmCharts.ChartScrollbar();
    chart.addChartScrollbar(chartScrollbar);

    chart.creditsPosition = "bottom-right";

    // WRITE
    chart.write("chartdiv");
});
*/
