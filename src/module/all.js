// Generated by CoffeeScript 1.9.3
define(function(require, exports, module) {
  "use strict";
  var all, gChart;
  all = {};
  gChart = require("echarts");
  all.init = function() {
    all.getData();
    return all.eventBind();
  };
  all.getData = function() {
    return $.ajax({
      type: "get",
      url: "./data/country.json",
      dataType: "json",
      success: function(data, status) {
        return all.dataHandle(data);
      }
    });
  };
  all.eventBind = function() {
    return $("#J-allnav li").click(function() {
      $(this).parent().find("li").removeClass("active");
      return $(this).addClass("active");
    });
  };
  all.dataHandle = function(data) {
    var i, item, j, key, keys, len, len1;
    all.allType = {};
    for (i = 0, len = data.length; i < len; i++) {
      item = data[i];
      keys = Object.keys(item);
      for (j = 0, len1 = keys.length; j < len1; j++) {
        key = keys[j];
        all.allType[key] = all.allType[key] || [];
        all.allType[key].push(item[key]);
      }
    }
    return all.dataProcess(all.allType);
  };
  all.dataProcess = function(data) {
    var dataitem, i, index, item, itemput, j, len, len1, obj, querycheck, ref, ref1, series, value;
    value = $("#J-allnav li.active").attr("value").toString();
    series = [];
    itemput = {
      name: value,
      type: 'map',
      mapType: 'china',
      hoverable: false,
      roam: true,
      data: [],
      markPoint: {
        symbolSize: 5,
        itemStyle: {
          normal: {
            borderColor: '#87cefa',
            borderWidth: 1,
            label: {
              show: false
            }
          },
          emphasis: {
            borderColor: '#1e90ff',
            borderWidth: 5,
            label: {
              show: false
            }
          }
        },
        data: []
      }
    };
    ref = data[value];
    for (index = i = 0, len = ref.length; i < len; index = ++i) {
      dataitem = ref[index];
      obj = {};
      obj.name = data["area"][index];
      obj.value = dataitem;
      if (obj.value > all.max) {
        all.max = obj.value;
      }
      itemput.markPoint.data.push(obj);
    }
    ref1 = data["area"];
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      item = ref1[j];
      all.ajaxt(item);
      all.flag = data["area"].length;
    }
    querycheck = setInterval((function(_this) {
      return function() {
        if (all.flag !== 0) {
          return;
        }
        itemput.geoCoord = all.geocoord;
        series.push(itemput);
        all.initChart(series);
        return clearInterval(querycheck);
      };
    })(this), 100);
  };
  all.geocoord = {};
  all.max = 0;
  all.ajaxt = function(item) {
    return $.ajax({
      type: "get",
      url: "http://api.map.baidu.com/geocoder/v2/",
      dataType: "jsonp",
      data: {
        output: "json",
        ak: "ZXhtdkazbuOxPmG6xB0609zB",
        address: item
      },
      success: function(data, status) {
        if (data.status === 0) {
          all.geocoord[item] = [];
          all.geocoord[item].push(data.result.location.lng);
          all.geocoord[item].push(data.result.location.lat);
        } else {
          all.geocoord[item].push(0);
          all.geocoord[item].push(0);
        }
        return all.flag--;
      }
    });
  };
  all.initChart = function(data) {
    var option;
    this.airchart = gChart.init(document.getElementById('airall_chart'));
    option = {
      title: {
        text: '全国气候状况',
        subtext: '数据取自'
      },
      dataRange: {
        min: 0,
        max: all.max,
        calculable: true,
        color: ['maroon', 'purple', 'red', 'orange', 'yellow', 'lightgreen']
      },
      tooltip: {
        trigger: 'item'
      },
      series: data
    };
    return this.airchart.setOption(option);
  };
  return module.exports = all;
});
