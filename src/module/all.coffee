define (require, exports, module) ->
    "use strict"


    all = {}
    gChart = require("echarts")

    all.init = ->
        all.getData()

    all.getData = ->
        $.ajax {
            type: "get"
            url: "./data/country.json"
            dataType: "json"
            success: (data,status) ->
                all.dataHandle(data)
        }
       
    all.dataHandle = (data) ->
        all.allType = {}
        for item in data
            keys = Object.keys(item)
            for key in keys
                all.allType[key] = all.allType[key] || []
                all.allType[key].push item[key]
        all.dataProcess(all.allType)

    all.dataProcess = (data) ->
        value = $("#J-allnav li.active").attr("value").toString()
        series = []
        item = {
            name: value
            type: 'map'
            mapType: 'china'
            itemStyle:{
                normal:{label:{show:true}},
                emphasis:{label:{show:true}}
                    }
            data: []
        }
        for dataitem, index in data[value]
            obj = {}
            obj.name = data["position_name"][index]
            obj.value = dataitem
            item.data.push obj
        series.push item
        all.initChart(series)


    all.initChart = (data) ->
        console.log data
        @airchart = gChart.init(document.getElementById('airall_chart'))
        option = {
            title : {
                text: '全国气候状况',
                subtext: '数据取自',
            },
            tooltip : {
                trigger: 'item'
            },
            series: data
        }
        @airchart.setOption(option)
                            

    module.exports = all