/* globals $, d3, anime */

/**
 *  SSE Airtricity OSS
 *  Author: Conor Luddy
 *  Component: D3 usage graph
 *  Requires: D3, AnimeJs
 *
 * ToDo:
 * - Axis labels
 * - Gas lines
 * - Data groups
 * - Background grid
 * - Data
 *
 */

;
(function(window, document, undefined) {
  'use strict';

  var Component = window.Component || function() {};

  var d3UsageGraph = Component.d3UsageGraph = function(el) {
    this.el = el;
    this.$el = $(el);
    this.incomingDateFormat = '%d %b %Y';
    this.outputDateFormat = d3.timeFormat('%d %b %Y');
    this.dateKey = 'date';
    this.usageKey = 'value';
    this.meterId = 'id';
    this.curveType = d3.curveCatmullRom;
    this.chart = {};
    this.dataSeries = [];

    this.colours = {
      elec: '#7DC242',
      elecFaded: '#D8ECC7',
      elecOpaque: 'rgba(125, 194, 66, 0.2)',
      gas: '#004687',
      gasFaded: '#B3C8DA',
      gasOpaque: 'rgba(0, 70, 135, 0.2)',
      axis: '#ECEAE6'
    };


    this.layout = {

      //The actual dimensions of the part the lines go in. Subsection of D3 container.
      graphWidth: 695,
      graphHeight: 230,

      // The space around the graph, where keys, axis labels, and other randon articles reside.
      padding: {
        T: 80,
        B: 50,
        L: 45,
        R: 0
      },

      width: el.offsetWidth || 745, //offsetWidth returns 0 when element hidden (e.g. Inside tab content)
      height: el.offsetHeight || 350 //offsetWidth returns 0 when element hidden (e.g. Inside tab content)

    };

    ////////////////
    this.init(el);
    ////////////////

  };

  /**
   * init
   * @param  {[type]} el - component DOM element
   * @return {[type]}    [description]
   */
  d3UsageGraph.prototype.init = function(el) {
    var dis = this;

    this.data = this.getData(el); //get JSON from the page
    this.data = this.parseReplaceData(this.data); //convert strings to useful types
    this.data = this.sortData(this.dateKey, this.data); //sort the data by date
    this.dataGrouped = this.groupData('id', this.data); //split gas and elec into groups
    this.gasData = this.getGasData();
    this.elecData = this.getElecData();
    this.elecDataSimplified = this.getElecDataSimplified();
    this.gasDataSimplified = this.getGasDataSimplified();
    this.chart = this.createD3Chart(el); //build a chart
    this.hasElec = this.elecData.length ? true : false;
    this.hasGas = this.gasData.length ? true : false;

    this.createChart();

    this.chartTip = this.drawToolTip(this.chart);
    this.chartTipContents = this.drawToolTipContents(this.chartTip);

    this.renderedLegends = this.drawLegend(this.chart);

    this.layout.width = this.layout.graphWidth + this.layout.padding.L + this.layout.padding.R;
    this.layout.height = this.layout.graphHeight + this.layout.padding.T + this.layout.padding.B;

    // create legend listeners and activate first series
    this.createLegendListeners(this.el);
    this.createSeriesLineListeners(this.el);
    this.activateSeries(this.dataSeries[0].id);

    //Animate all the things
    if (el.querySelectorAll) {
      this.pollTilVisible = window.setInterval(function() {
        dis.visibilityCheck();
      }, 500);
    }
  };



  ////////////////////////////////////////////////////////////////////////////
  // Methonds for data manipulation //////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////

  d3UsageGraph.prototype.createChart = function() {

    var me = this;
    var ledge;
    var x = 85;
    var y = 40;

    if(this.hasElec) {
      // create a scale based on all the elec data (1 or many meters)
      this.scaleElec = this.createLinearScale(this.usageKey, this.elecDataSimplified, [this.layout.padding.T, this.layout.graphHeight]);
      this.dateScaleElec = this.createTimeScale(this.dateKey, this.elecDataSimplified, [this.layout.padding.L, this.layout.graphWidth]); //Params to match whatever the JSON data key is. (not using grouped data here, so we can scale from ALL dates in data)
      this.xAxisElec = this.createXAxis(this.dateScaleElec);
      this.yAxisElec = this.createYAxis(this.scaleElec, 'elec');
      this.xAxisElecSvg = this.drawAxis(this.chart, this.xAxisElec, 'translate(0, ' + this.layout.graphHeight + ')', 'x', 'elec');
      this.yAxisElecSvg = this.drawAxis(this.chart, this.yAxisElec, 'translate(' + this.layout.padding.L + ', 0)', 'y', 'elec');
      this.lineGeneratorElec = this.createLineGenerator(this.dateScaleElec, this.dateKey, this.scaleElec, this.usageKey); //xxyy
    }
    if(this.hasGas) {
      this.scaleGas = this.createLinearScale(this.usageKey, this.gasDataSimplified, [this.layout.padding.T, this.layout.graphHeight]); //Params to match whatever the JSON data key is.
      this.dateScaleGas = this.createTimeScale(this.dateKey, this.gasDataSimplified, [this.layout.padding.L, this.layout.graphWidth]); //Params to match whatever the JSON data key is. (not using grouped data here, so we can scale from ALL dates in data)
      this.xAxisGas = this.createXAxis(this.dateScaleGas);
      this.yAxisGas = this.createYAxis(this.scaleGas, 'gas');
      this.xAxisGasSvg = this.drawAxis(this.chart, this.xAxisGas, 'translate(0, ' + this.layout.graphHeight + ')', 'x', 'gas');
      this.yAxisGasSvg = this.drawAxis(this.chart, this.yAxisGas, 'translate(' + this.layout.padding.L + ', 0)', 'y', 'gas');
      this.lineGeneratorGas = this.createLineGenerator(this.dateScaleGas, this.dateKey, this.scaleGas, this.usageKey); //xxyy
    }
    this.hoverCircle = this.drawHoverCircle(this.chart);

    this.dataGrouped.forEach(function(d) {
      // d id grouped by meter id
      var series = {
        'id': d.key,
        'isSelected': false
      };

      if (d.values[0].type.toLowerCase() === 'gas') {
        series.type = 'gas';
        series.points = me.drawPoints(me.chart, d.values, me.dateScaleGas, me.scaleGas, me.colours.gasFaded, 'chart-dots-gas');
        series.lines = me.drawLine(me.chart, d.values, me.lineGeneratorGas, me.colours.gasFaded, 'chart-line-gas');
        series.legend = {
          'x': x,
          'y': y,
          'id': d.key,
          'title': 'Gas usage, m3/day',
          'colour': me.colours.gasFaded,
          'activeColour': me.colours.gas,
          'type': 'gas'
        };
      }
      else {
        series.type = 'elec';
        series.points = me.drawPoints(me.chart, d.values, me.dateScaleElec, me.scaleElec, me.colours.elecFaded, 'chart-dots-elec');
        series.lines = me.drawLine(me.chart, d.values, me.lineGeneratorElec, me.colours.elecFaded, 'chart-line-elec');
        series.legend = {
          'x': x,
          'y': y,
          'id': d.key,
          'title': 'Electricity ' + d.values[0].type + ' usage, kWh/day',
          'colour': me.colours.elecFaded,
          'activeColour': me.colours.elec,
          'type': 'elec'
        };
      }
      me.dataSeries.push(series);
    });

    if(this.hasElec) {
      //Save the animations to play later instead of autoplay. We'll prob have to escape this for IE
      this.lineAnimationsElec = this.animateLines(this.el.querySelectorAll('.chart-line-elec'));
      this.dotAnimationsElec = this.animateDots(this.el.querySelectorAll('.chart-dots-elec'));
      // remove the unwanted axis labels
      this.removeAxisLabels('elec', 'x');
      this.removeAxisLabels('elec', 'y');
    }
    if(this.hasGas) {
      this.lineAnimationsGas = this.animateLines(this.el.querySelectorAll('.chart-line-gas'));
      this.dotAnimationsGas = this.animateDots(this.el.querySelectorAll('.chart-dots-gas'));
      this.removeAxisLabels('gas', 'x');
      this.removeAxisLabels('gas', 'y');
    }

  }

  /**
   * getData
   * @param  {[type]} el - component DOM element
   * @return {[type]}    [description]
   */
  d3UsageGraph.prototype.getData = function(el) {
    var usageData;
    var usageKey = this.usageKey;
    //Check we have data attribute with data
    if ($(el).find('input')) {
      usageData = $(el).find('input').data('usage');
      //Make sure we have what we need
      if (typeof usageData === 'object' && usageData.data && usageData.data.length) {
        //Filter out items that don't have a kwh (e.g. 'pending' or 'rejected');
        //if data from back-end doesn't include this or units then we can drop this.
        return usageData.data.filter(function(d) {
          return d[usageKey].indexOf('kWh') > -1 || d[usageKey].indexOf('m3') > -1;
        });
      }
    }

    ////////////////
    console.warn('You ain\'t got no data...');
    return;
  };


  /**
   * getElecData
   * @param
   * @return {[type]} array - data
   */
  d3UsageGraph.prototype.getElecData = function() {
    var data = [];
    for (var i = 0; i < this.dataGrouped.length; i++) {
      // an electricity meter is any meter that is not gas
      if (this.dataGrouped[i].values[0].type !== 'Gas') {
        data.push(this.dataGrouped[i]);
      }
    }
    return data;
  }

  /**
   * getGasData
   * @param
   * @return {[type]} array - data
   */
  d3UsageGraph.prototype.getGasData = function() {
    var data = [];
    for (var i = 0; i < this.dataGrouped.length; i++) {
      // an electricity meter is any meter that is not gas
      if (this.dataGrouped[i].values[0].type === 'Gas') {
        data.push(this.dataGrouped[i]);
      }
    }
    return data;
  }

  /**
   * getElecDataSimplified
   * @param
   * @return {[type]} array - data
   */
  d3UsageGraph.prototype.getElecDataSimplified = function() {
    var data;
    var values = []
    var dates = [];
    var objs = [];
    for (var i = 0; i < this.elecData.length; i++) {
      var v = this.elecData[i].values;
      for (var j = 0; j < v.length; j++) {
        values.push(v[j].value);
        dates.push(v[j].date);
        objs.push({
          'value': v[j].value,
          'date': v[j].date,
          'type': v[j].type,
          'reading': v[j].reading,
          'reading-type': v[j]['reading-type'],
          'id': v[j].id
        });
      }
    }
    data = {
      values: values,
      dates: dates,
      objects: objs
    }
    return data;
  }

  /**
   * getGasDataSimplified
   * @param
   * @return {[type]} array - data
   */
  d3UsageGraph.prototype.getGasDataSimplified = function() {
    var data;
    var values = []
    var dates = [];
    var objs = [];
    for (var i = 0; i < this.gasData.length; i++) {
      var v = this.gasData[i].values;
      for (var j = 0; j < v.length; j++) {
        values.push(v[j].value);
        dates.push(v[j].date);
        objs.push({
          'value': v[j].value,
          'date': v[j].date,
          'type': v[j].type,
          'reading': v[j].reading,
          'reading-type': v[j]['reading-type'],
          'id': v[j].id
        });
      }
    }
    data = {
      values: values,
      dates: dates,
      objects: objs
    }
    return data;
  }


  /**
   * parseData
   *
   * We need ints and dates instead of strings and strings.
   *
   * @return {[type]} [description]
   */
  d3UsageGraph.prototype.parseReplaceData = function(data) {
    for (var i = 0; i < data.length; i++) {
      if (data[i][this.dateKey]) {
        data[i][this.dateKey] = this.parseTime(data[i][this.dateKey]);
      }
      if (data[i][this.usageKey]) {
        data[i][this.usageKey] = parseInt(data[i][this.usageKey]);
      }
    }

    return data;
  };


  /**
   * parseDate
   * @return {[type]} [description]
   */
  d3UsageGraph.prototype.parseTime = function(timeStr) {
    var parseTime = d3.timeParse(this.incomingDateFormat);
    return parseTime(timeStr);
  };


  /**
   * groupData
   * @param  {[type]} key [description]
   * @return {[type]}     [description]
   */
  d3UsageGraph.prototype.groupData = function(key, data) {
    var sort = d3.nest()
      .key(function(d) {
        return d[key];
      })
      .entries(data);

    return sort;
  };



  /**
   * sortData
   * @param  {[type]} key [description]
   * @return {[type]}     [description]
   */
  d3UsageGraph.prototype.sortData = function(key, data) {
    if (typeof data === 'object') {
      return data.sort(function(a, b) {
        return a[key] - b[key];
      });
    }

    console.warn('Data wasn\'t an array');
    return data;
  };






  ////////////////////////////////////////////////////////////////////////////
  // Methonds to create D3 elements //////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////




  /**
   * createD3Chart
   * @param  {[type]} el - component DOM element
   * @return {[type]}    [description]
   */
  d3UsageGraph.prototype.createD3Chart = function(el) {
    var chart = d3.select($(el).find('.chart')[0]);

    return chart.append('svg:svg')
      .attr('width', this.layout.width)
      .attr('height', this.layout.height);
  };

  /**
   * createXAxis
   * @return {[type]} [description]
   */
  d3UsageGraph.prototype.createXAxis = function(scale) {
    return d3.axisBottom(scale)
      .tickSizeInner(-(this.layout.graphHeight - this.layout.padding.T))
      // .tickArguments([d3.timeMonth.every(3)])
      //.tickArguments([d3.timeMonth])
      .tickFormat(d3.timeFormat('%b\'%y'))
      .tickPadding(10);
  };

  /**
   * createYAxis
   * @return {[type]} [description]
   */
  d3UsageGraph.prototype.createYAxis = function(scale, type) {
    //var frmt = type === 'elec' ? d3.format('.1s') : d3.format('.1s');
    return d3.axisLeft(scale)
      .tickSizeInner(-(this.layout.graphWidth))
      .tickArguments([4])
      //.tickFormat(frmt)
      .tickPadding(10);
  };

  /**
   * createLinearScale
   * @return {[type]} [description]
   */
  d3UsageGraph.prototype.createLinearScale = function(key, data, range) {

    if (key) {

      var min = d3.min(data.values);
      var max = d3.max(data.values);

      var base;
      var maxTh = max.toString().length; //th as in tenTH, hundredTH, thousandTH
      var minTh = min.toString().length; //th as in tenTH, hundredTH, thousandTH
      var roundedUpMax = max;
      var roundedDownMin = min;
      var i;

      //TODO comments :p

      if (typeof max === 'number') {
        base = 1;
        for (i = 1; i < maxTh; i++) {
          base *= 10;
        }
        roundedUpMax = max + (base - (max % base));
      }

      if (typeof min === 'number') {
        base = 1;
        for (i = 1; i < minTh; i++) {
          base *= 10;
        }

        roundedDownMin = min - (min % base);

        if (min % base === 0) {
          roundedDownMin -= base / 10;
        }
      }

      return d3.scaleLinear().domain([roundedUpMax, roundedDownMin]).range(range);

    }

    return;
  };


  /**
   * createTimeScale
   * @return {[type]} [description]
   */
  d3UsageGraph.prototype.createTimeScale = function(key, data, range) {
    var date;
    var min;
    var max;

    if (key) {
      min = new Date(d3.min(data.dates));
      max = new Date(d3.max(data.dates));

      date = d3.scaleTime().domain([min, max]).range(range);

      return date;
    }
    return;
  };

  /**
   * createLineGenerator
   *
   * Make sure you're passing the correct order of params in here.
   *
   * @param  {[type]} xScale [description]
   * @param  {[type]} xKey   [description]
   * @param  {[type]} yScale [description]
   * @param  {[type]} yKey   [description]
   * @return {[type]}        [description]
   */
  d3UsageGraph.prototype.createLineGenerator = function(xScale, xKey, yScale, yKey) {
    return d3.line()
      .x(function(d) {
        return xScale(d[xKey]);
      })
      .y(function(d) {
        return yScale(d[yKey]);
      })
      .curve(this.curveType);
  };








  ////////////////////////////////////////////////////////////////////////////
  // Methods to draw tings     ///////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////








  /**
   * drawAxis
   * @param  {[type]} axis [description]
   * @return {[type]}      [description]
   */
  d3UsageGraph.prototype.drawAxis = function(chart, axis, translation, axisType, chartType) {
    return chart.append('svg:g')
      .attr('class', 'axis ' + axisType + ' ' + chartType)
      .attr('transform', translation ? translation : 'transform(0,0)')
      .call(axis);
  };

  /**
   * removeAxisLabels
   * @param {[type]} chart type (elec or gas)
   * @param {[axis]} x or y
   * @return
   */
  d3UsageGraph.prototype.removeAxisLabels = function(type, axis) {

    var typeToRemove = '.' + type;
    var axisToRemove = '.' + axis;
    var removeSelector = ".axis" + typeToRemove + axisToRemove + " .tick text";

    var removeX = function(sel) {
      d3.selectAll(sel)
        .attr('class', function(d, i) {
          if ((i + 1) % 3 !== 0 || i === 0) {
            d3.select(this).remove();
          }
        });
    };

    if (axis === 'x') {
      removeX(removeSelector);
    }

    if (axis === 'y') {

    }


  };






  /**
   * drawLine
   * @param  {[type]} axis [description]
   * @return {[type]}      [description]
   */
  d3UsageGraph.prototype.drawLine = function(chart, data, lineGenerator, colour, className) {
    return chart.append('path')
      .data([data])
      .attr('d', lineGenerator)
      .attr('stroke', colour)
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('stroke-linecap', 'round')
      .attr('class', className);
  };


  /**
   * drawPoints
   * @param  {[type]} axis [description]
   * @return {[type]}      [description]
   */
  d3UsageGraph.prototype.drawPoints = function(chart, data, xScale, yScale, colour, className) {
    var showTooltip = this.showTooltip.bind(this);

    return chart.selectAll('dot')
      .data(data)
      .enter().append('circle')
      .attr('r', 6)
      .attr('fill', colour)
      .attr('cx', function(d) {
        return xScale(d.date);
      })
      .attr('cy', function(d) {
        return yScale(d.value);
      })
      .attr('class', className)
      .on('mouseover', function(d, i) {
        showTooltip(this, d, i);
      });
  };

  /**
   * drawHoverCircle
   * draws Hover Circle
   * @param  {[type]} chart [description]
   * @return {[type]}       [description]
   */
  d3UsageGraph.prototype.drawHoverCircle = function(chart) {
    return chart.append('g')
      .append('circle')
      .style('opacity', '0')
      .style('stroke-width', '1')
      .attr('class', 'hover-circle')
      .attr('r', 9);
  };

  /**
   * drawToolTip
   * draws ToolTip
   * @param  {[type]} chart [description]
   * @return {[type]}       [description]
   */
  d3UsageGraph.prototype.drawToolTip = function(chart) {
    var tipWrap = chart.append('g').style('opacity', 0);

    //If we return the appended rect, we can't put text into it :)
    tipWrap.append('rect')
      .style('fill', '#f1f1f1')
      .attr('class', 'chart-tip')
      .attr('width', 200)
      .attr('height', 75);

    return tipWrap;
  };




  /**
   * drawToolTipContents
   * draws ToolTip
   * @param  {[type]} chart [description]
   * @return {[type]}       [description]
   */
  d3UsageGraph.prototype.drawToolTipContents = function(tooltip) {
    // https://stackoverflow.com/questions/12922350/why-doesnt-the-text-in-svg-show-up
    var lineHeight = 20;
    var fontSize = '12px';
    var fontWeight = 500;

    tooltip.attr('font-size', fontSize);

    //Labels are 'hardcoded'...
    tooltip.append('text').text('Date:').attr('x', 10).attr('y', lineHeight * 1).attr('font-weight', fontWeight);
    tooltip.append('text').text('Average daily usage:').attr('x', 10).attr('y', lineHeight * 2).attr('font-weight', fontWeight);
    tooltip.append('text').text('Meter reading:').attr('x', 10).attr('y', lineHeight * 3).attr('font-weight', fontWeight);

    //...but values are exposed so we can hook into them
    this.tipText = {
      date: tooltip.append('text').text('x').attr('x', 42).attr('y', lineHeight * 1),
      usage: tooltip.append('text').text('x').attr('x', 124).attr('y', lineHeight * 2),
      reading: tooltip.append('text').text('x').attr('x', 92).attr('y', lineHeight * 3)
    };

    return tooltip;
  };




  /**
   * DrawLegend
   * @param  {[type]} chart [description]
   * @return {[type]}       [description]
   */
  d3UsageGraph.prototype.drawLegend = function(chart) {
    var me = this;
    var lineHeight = 20;
    var fontSize = '14px';
    var fontWeight = 300;
    var container = chart.append('g').style('cursor', 'pointer').attr('class', 'legends').attr('y', 0);
    var spaceFromText = 10;
    var lineWidth = 30;
    var nextOffset = 0;
    var lineCount = 0;
    var xOrigin = this.dataSeries[0].legend.x || 0;
    var x = xOrigin;
    var y = this.dataSeries[0].legend.y || 0;

    var containers = [];

    this.dataSeries.forEach(function(series, i) {
      var legendContainer = container.append('g')
        .attr('class', 'legend')
        .attr('id', 'legend-' + series.id);
      var text = legendContainer.append('text');
      var circle = legendContainer.append('circle');
      var rect = legendContainer.append('rect');

      text.text(series.legend.title)
        .attr('x', x)
        .attr('y', y)
        .attr('font-weight', fontWeight)
        .attr('font-size', fontSize)
        .attr('color', series.legend.colour);

      circle.attr('r', 4)
        .attr('transform', 'translate(' + (x - (spaceFromText + lineWidth / 2)) + ',' + (y - 3.75) + ')')
        .attr('fill', series.legend.colour);

      rect.attr('width', 30)
        .attr('height', 2)
        .attr('transform', 'translate(' + (x - spaceFromText - lineWidth) + ',' + (y - 5) + ')')
        .attr('fill', series.legend.colour);

      var legendEl = document.getElementById('legend-' + series.id);
      var legendRect = legendEl.getBoundingClientRect();

      nextOffset = legendRect.width + 30;

      if ((x + nextOffset - 30) > me.layout.graphWidth && i > 0) {
        x = xOrigin;
        y += lineHeight;
        lineCount ++;

        text.attr('x', x)
          .attr('y', y);
        container.attr('transform', 'translate(0, ' + (lineCount * -10) + ')');
        circle.attr('transform', 'translate(' + (x - (spaceFromText + lineWidth / 2)) + ',' + (y - 3.75) + ')');
        rect.attr('transform', 'translate(' + (x - spaceFromText - lineWidth) + ',' + (y - 5) + ')');

        x += nextOffset;
      } else {
        x += nextOffset;
      }

      series.renderedLegend = {
        'container': legendContainer,
        'circle': circle,
        'rect': rect
      };

      containers.push(container);
    });
    return containers;
  };





  ////////////////////////////////////////////////////////////////////////////
  // Methods to handle events ////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////




  /**
   * createLegendListener
   * @param  {[type]} ledge [description]
   * @return {[type]}       [description]
   */
  d3UsageGraph.prototype.createLegendListeners = function() {
    var me = this;
    this.dataSeries.forEach(function(series) {
      series.renderedLegend.container.on('click', function() {
        me.activateSeries(series.id);
      });
    });
  };

  /**
   * createSeriesLineListeners
   * @param  {[type]} ledge [description]
   * @return {[type]}       [description]
   */
  d3UsageGraph.prototype.createSeriesLineListeners = function() {
    var me = this;
    this.dataSeries.forEach(function(series) {
      series.lines.on('click', function() {
        me.activateSeries(series.id);
      });
      series.points.on('click', function() {
        me.activateSeries(series.id);
      });
    });
  };

  d3UsageGraph.prototype.activateSeries = function(id) {
    var me = this;
    this.dataSeries.forEach(function(series) {
      if (series.id == id) {
        // Turn it on
        // Change axis
        if (series.type == 'gas') {
          me.xAxisElecSvg.style('display', 'none');
          me.yAxisElecSvg.style('display', 'none');
          me.xAxisGasSvg.style('display', 'inherit');
          me.yAxisGasSvg.style('display', 'inherit');
          me.hoverCircle.style('fill', me.colours.gasOpaque)
            .style('stroke', me.colours.gas);
        } else {
          me.xAxisGasSvg.style('display', 'none');
          me.yAxisGasSvg.style('display', 'none');
          me.xAxisElecSvg.style('display', 'inherit');
          me.yAxisElecSvg.style('display', 'inherit');
          me.hoverCircle.style('fill', me.colours.elecOpaque)
            .style('stroke', me.colours.elec);
        }

        series.renderedLegend.circle.attr('fill', series.legend.activeColour);
        series.renderedLegend.rect.attr('fill', series.legend.activeColour);
        series.points.attr('fill', series.legend.activeColour);
        series.lines.attr('stroke', series.legend.activeColour);

        series.isSelected = true;
      } else {
        // Turn it off
        series.renderedLegend.circle.attr('fill', series.legend.colour);
        series.renderedLegend.rect.attr('fill', series.legend.colour);
        series.points.attr('fill', series.legend.colour);
        series.lines.attr('stroke', series.legend.colour);

        series.isSelected = false;
      }
    });
  };

  d3UsageGraph.prototype.mouseMoveElec = function(rect) {
    this.mouseMove(rect, 'elec');
  }

  d3UsageGraph.prototype.mouseMoveGas = function(rect) {
    this.mouseMove(rect, 'gas');
  }

  /**
   * showTooltip
   * @param  {[type]} element returned from svg click event
   * @return {[type]}
   */
  d3UsageGraph.prototype.showTooltip = function(el, data, index) {

    // default to elec
    var unit = 'kWh';

    // should only show tooltip if the clicked point is of the active meter
    var gasIsActive = this.activeType === 'gas';
    var isClickable = (gasIsActive && data.type === 'Gas') || (!gasIsActive && data.type !== 'Gas');

    if (gasIsActive) {
      unit = 'm3';
    }

    // if this fule type isn't active, do nothing
    if (!isClickable)
      return;

    // else do all this stuff
    this.chartTip.style('opacity', 'inherit');
    this.hoverCircle.style('opacity', 'inherit');

    var xPos = el.cx.baseVal.value;
    var yPos = el.cy.baseVal.value;

    var diffPointX = parseInt(this.hoverCircle.node().dataset.xpos) !== Math.round(xPos);
    var diffPointY = parseInt(this.hoverCircle.node().dataset.ypos) !== Math.round(yPos);

    var diffPoint = diffPointX && diffPointY;

    //Tooltip coordinates
    var tipX = xPos < 200 ? xPos : xPos - 200;
    var tipY = yPos;

    // //Position our circle.
    this.hoverCircle
      .attr('transform', 'translate(' + xPos + ', ' + yPos + ')');


    //Animation. Should work fine without this if you need to skip it for a broswer etc.
    if (diffPoint) {
      this.hoverCircle.attr('r', 0);

      anime({
        targets: this.hoverCircle.node(),
        r: 9,
        duration: 1000,
        delay: 20,
        loop: false,
        elasticity: 100,
        easing: 'easeOutCirc',
        autoplay: true
      });
    }

    //Position our tooltip (if it's close to the left edge make it sit to the right of the circle)
    this.chartTip.attr('transform', 'translate(' + tipX + ',' + tipY + ')');

    this.tipText.date.text(this.outputDateFormat(data.date));
    this.tipText.usage.text(data.value + ' (' + unit + ')');
    this.tipText.reading.text(data.reading + ' (' + data['reading-type'] + ')');

    if (diffPoint) {
      var tip = this.tipText;
      var aniVals = {
        usage: 0,
        reading: 0
      };
      var JSobjectProp = anime({
        targets: aniVals,
        usage: data.value,
        reading: data.reading,
        easing: 'easeOutExpo',
        duration: 500,
        round: 1,
        update: function() {
          tip.usage.text(aniVals.usage + ' (' + unit + ')');
          tip.reading.text(aniVals.reading + ' (' + data['reading-type'] + ')');
        }
      });
    }

  }


  /**
   * animateDots
   * @param  {[type]} lines [description]
   * @return {[type]}       [description]
   */
  d3UsageGraph.prototype.animateDots = function(dots) {
    var dotAnim = [];

    for (var i = 0; i < dots.length; i++) {

      dots[i].setAttribute('r', 0);

      //Should be able to just not run this for shit browsers and graph will be static
      dotAnim.push(
        anime({
          targets: dots[i],
          r: 6,
          duration: Math.floor(Math.random() * 2000) + 1,
          delay: Math.floor(Math.random() * 2000) + 1,
          loop: false,
          easing: 'easeInSine',
          autoplay: false
        })
      );

    }

    return dotAnim;
  };




  /**
   * animateLines
   * animates Lines
   * @param  {[type]} lines [description]
   * @return {[type]}       [description]
   */
  d3UsageGraph.prototype.animateLines = function(lines) {
    var lineAnims = [];

    for (var i = 0; i < lines.length; i++) {

      //Should be able to just not run this for shit browsers and graph will be static
      lineAnims.push(
        anime({
          targets: lines[i],
          strokeDashoffset: [anime.setDashoffset, 0],
          duration: 3000,
          delay: 500,
          loop: false,
          easing: 'easeInOutSine',
          autoplay: false
        })
      );

    }


    return lineAnims;

  };




  /**
   * visibilityCheck
   * Wait for graph to be visible before animating it.
   * @return {[type]} [description]
   */
  d3UsageGraph.prototype.visibilityCheck = function() {
    if (this.el.offsetHeight && (this.el.getBoundingClientRect().top < window.innerHeight)) {
      var i;
      var ani = [];
      window.clearInterval(this.pollTilVisible);

      if (this.hasGas) {
        ani = ani.concat(this.lineAnimationsGas);
        ani = ani.concat(this.dotAnimationsGas);
      }
      if (this.hasElec) {
        ani = ani.concat(this.lineAnimationsElec);
        ani = ani.concat(this.dotAnimationsElec);
      }

      for (i = 0; i < ani.length; i++) {
        ani[i].play();
      }

    }
  };


  window.Component = Component;

})(this.window, this.document);
/**







                                __,__
                       .--.  .-'     '-.  .--.
                      / .. \/  .-. .-.  \/ .. \
                     | |  '|  /   Y   \  |'  | |
                     | \   \  \ 0 | 0 /  /   / |
                      \ '- ,\.-'`` ``'-./, -' /
                       `'-' /_   ^ ^   _\ '-'`
                       .--'|  \._ _ _./  |'--.
                     /`    \   \.-.  /   /    `\
                    /       '._/  |-' _.'       \
                   /          ;  /--~'   |       \
                  /        .'\|.-\--.     \       \
                 /   .'-. /.-.;\  |\|'~'-.|\       \
                 \       `-./`|_\_/ `     `\'.      \
                  '.      ;     ___)        '.`;    /
                    '-.,_ ;     ___)          \/   /
                     \   ``'------'\       \   `  /
                      '.    \       '.      |   ;/_
               jgs  ___>     '.       \_ _ _/   ,  '--.
                  .'   '.   .-~~~~~-. /     |--'`~~-.  \
                 // / .---'/  .-~~-._/ / / /---..__.'  /
                ((_(_/    /  /      (_(_(_(---.__    .'
                          | |     _              `~~`
                          | |     \'.
                           \ '....' |
                            '.,****/
