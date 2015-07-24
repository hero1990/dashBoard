// Generated by CoffeeScript 1.9.3
define(function(require, exports, module) {
  "use strict";
  var gChart, map;
  map = {};
  gChart = require("echarts");
  map.init = function() {
    map.maping();
    map.getData();
    return map.eventBind();
  };
  map.maping = function() {
    return this.mapCity = {
      "SH": "上海",
      "BJ": "北京",
      "GZ": "广州"
    };
  };
  map.getData = function() {
    return $.ajax({
      type: "get",
      url: "./data/test.json",
      dataType: "json",
      success: function(data, status) {
        var chart, i, index, item, len, ref;
        chart = {
          "NAME": ["SH", "BJ", "GZ"],
          "SH": [],
          "BJ": [],
          "GZ": [],
          "DATE": []
        };
        ref = data.Sheet1;
        for (index = i = 0, len = ref.length; i < len; index = ++i) {
          item = ref[index];
          chart.SH.push(parseFloat(item.上海));
          chart.BJ.push(parseFloat(item.北京));
          chart.GZ.push(parseFloat(item.广州));
          chart.DATE.push(item.日期);
        }
        return map.initChart(chart);
      },
      error: function(data, status) {
        return console.log(status);
      }
    });
  };
  map.eventBind = function() {
    return $("#J-nav li").click(function() {
      $(this).parent().find("li").removeClass("active");
      $(this).addClass("active");
      return map.getData();
    });
  };
  map.initChart = function(data) {
    var i, item, legendData, len, option, ref, series, seriesitem;
    this.airchart = gChart.init(document.getElementById('air_chart'));
    series = [];
    legendData = [];
    ref = data.NAME;
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      seriesitem = {};
      seriesitem.name = map.mapCity[item];
      seriesitem.type = $("#J-nav li.active").attr("value").toString();
      seriesitem.smooth = true;
      seriesitem.data = data[item];
      seriesitem.markPoint = {
        data: [
          {
            type: 'max',
            name: '最大值'
          }, {
            type: 'min',
            name: '最小值'
          }
        ]
      };
      seriesitem.markLine = {
        data: [
          {
            type: 'average',
            name: '平均值'
          }
        ]
      };
      legendData.push(map.mapCity[item]);
      series.push(seriesitem);
    }
    option = {
      title: {
        text: '北京，上海，广州三城市空气质量图',
        subtext: '部分数据'
      },
      tooltip: {
        show: true,
        trigger: "axis"
      },
      legend: {
        data: legendData
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          axisTick: {
            show: true,
            interval: 0
          },
          data: data.DATE
        }
      ],
      yAxis: [
        {
          type: 'value'
        }, {
          type: 'value'
        }
      ],
      series: series
    };
    return this.airchart.setOption(option);
  };
  return module.exports = map;
});
