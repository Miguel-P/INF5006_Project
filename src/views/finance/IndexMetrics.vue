<template>
    <div id="app">
        <div class="loader" v-if="loading">
            <div>
                <circle9></circle9>
            </div>
        </div>
        <div class="horizontal-no-margin">
            <div class="horizontal w100">
                <div class="w20">
                    <model-select
                        :options="indexCodes"
                        v-model="indexCode"
                        placeholder="Select Index">
                    </model-select>
                </div>
                <div class="w20">
                    <model-select 
                        :options="marketProxies"
                        v-model="marketProxy"
                        placeholder="Select Market Proxy">
                    </model-select>
                </div>
                <div class="w20">
                    <model-select 
                        :options="metricTypes"
                        v-model="metricType"
                        placeholder="Select Metric">
                    </model-select>
                </div>
                <div class="w20">
                    <input type="button" value="Get Metrics"  @click="getMetricData()" class="btn btn-info w60"/>
                </div>
            </div>
        </div>

        <div class="horizontal-no-margin">
            <div class="w50 padding-s">
                <zing-grid
                    :caption="metricTableCaption"
                    draggable="columns" 
                    drag-action="reorder" 
                    :data.prop="metricTableData"
                    layout-controls="disabled"
                    layout="row"
                    page-size="7"
                    filter 
                    pager
                    sort>
                    <zg-caption>
                        {{constituentCode+' Total Risk Values'}}
                        <input type="button" value="Export" @click="exportData(totalRiskTableId)" class="btn btn-info right"/>
                    </zg-caption>
                    <zg-colgroup>
                        <zg-column index="Date" filter="disabled"  width="120"></zg-column>
                        <zg-column index="Technology" filter="disabled" cell-class="betaCellFunction" width="100"></zg-column>
                        <zg-column index="Basic Materials" filter="disabled" cell-class="betaCellFunction" width="100"></zg-column>
                        <zg-column index="Oil & Gas" filter="disabled" cell-class="betaCellFunction" width="100"></zg-column>
                        <zg-column index="Utilities" filter="disabled" cell-class="betaCellFunction" width="100"></zg-column>
                        <zg-column index="Health Care" filter="disabled" cell-class="betaCellFunction" width="100"></zg-column>
                        <zg-column index="Industrials" filter="disabled" cell-class="betaCellFunction" width="100"></zg-column>
                        <zg-column index="Consumer Services" filter="disabled" cell-class="betaCellFunction" width="100"></zg-column>
                        <zg-column index="Consumer Goods" filter="disabled" cell-class="betaCellFunction" width="100"></zg-column>
                        <zg-column index="Telecommunications" filter="disabled" cell-class="betaCellFunction" width="100"></zg-column>
                        <zg-column index="Financials" filter="disabled" cell-class="betaCellFunction" width="100"></zg-column>
                    </zg-colgroup>
                </zing-grid>
            </div>

            <div class="w50 top padding-s">
                <div class="w100">
                    <zingchart height="550" :id="metricChartId" :data="metricChartData"></zingchart>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import { ModelSelect } from 'vue-search-select'
    import {Circle9} from 'vue-loading-spinner'

    export default {
        props: {
            data: {
                type: Object
            }
        },
        methods: {
            registerGridMethods(){
                self = this
                var betaCellFunction = function(openValue, cellDOMRef, cellRef){
                    if (self.metricType !== "Beta"){
                        return
                    }

                    var beta = parseFloat(openValue)
                    if (beta > 1){
                        return 'red'
                    }

                    if (beta <= 1 && beta >= 0){
                        return 'green'
                    }

                    return 'orange';
                }

                // set up zinggrid
                this.zinggrid = document.querySelector('zing-grid')
                ZingGrid.registerMethod(betaCellFunction, 'betaCellFunction', this)
            },
            prepareData() {
                this.metricTableData = this.results
                this.metricTableCaption = "Index "+this.metricType+" Metrics"
            },
            plotChartData() {
                var data = this.results

                // This will have industry name as key
                // And values will be industry values for the different quarters
                // eg {'health':[10,20,30,40]} // health industry for q1 to q4
                var industryData = {}

                for(var key in data){
                    var quarterData = data[key]
                    for (var industryKey in quarterData){
                        if (!(industryKey in industryData)){
                            industryData[industryKey] = []
                        }
                        if (industryKey === 'Date') {
                            industryData[industryKey].push(quarterData[industryKey])
                        }else{
                            industryData[industryKey].push(parseFloat(quarterData[industryKey]))
                        }
                    }
                }
                console.log(industryData["Date"])
                var seriesData = []

                for(var key in industryData){
                     if (key !== 'Date') {
                        seriesData.push({
                            values:industryData[key],
                            text:key,
                            tooltipText: 
                                key+": %v<br>"+
                                "Stack Average %stack-average<br>"+
                                "Stack Height: %stack-length<br>"+
                                "Stack Total: %stack-total"
                        })
                    }
                }

                console.log(seriesData)

                this.metricChartData = {
                    plotarea: {
                        marginTop: 5,
                        marginBottom: "15%"
                    },
                    type: "bar",
                    stacked: true,
                    legend: {
                        toggleAction: 'remove',
                        draggable: true
                    },
                    "scale-x":{  
                        values: industryData["Date"],
                        autoFit: 1,
                        layout: "vertical",
                        item: {
                            angle: -90
                        }
                    },
                    plot: {
                        valueBox: {
                            backgroundColor: 'black',
                            rules: [{
                                rule: '%stack-top == 0',
                                visible: 0
                            }]
                        }
                    },
                    series: seriesData
                }
            },
            getMetricData(){
                this.loading = true
                console.log('http://localhost:3000/api'+
                    '/indexes/metrics/'+this.metricType+
                    '/index/'+this.indexCode+
                    '/marketindex/'+this.marketProxy)
                axios.get(
                    'http://localhost:3000/api'+
                    '/indexes/metrics/'+this.metricType+
                    '/index/'+this.indexCode+
                    '/marketindex/'+this.marketProxy)
                .then(response => {
                    this.results = response.data.results
                    this.prepareData()
                    this.plotChartData()
                    this.loading = false
                })
                .catch(e => {
                    this.loading = false
                    console.log(e)
                })
            }
        },
        created () {
            this.registerGridMethods()
            this.getMetricData()
        },
        data() {
            return {
                loading: true,
                results: {},
                metricTableData: {},
                metricChartData: {},
                metricChartId: "metricChart",
                metricTableCaption: "Index Metrics",
                indexCodes: [
                    {value: 'FLED', text: 'FLED'},
                    {value: 'ALSI', text: 'ALSI'},
                    {value: 'LRGC', text: 'LRGC'},
                    {value: 'MIDC', text: 'MIDC'},
                    {value: 'SMLC', text: 'SMLC'},
                    {value: 'TOPI', text: 'TOPI'},
                    {value: 'RESI', text: 'RESI'},
                    {value: 'FINI', text: 'FINI'},
                    {value: 'INDI', text: 'INDI'},
                    {value: 'PCAP', text: 'PCAP'},
                    {value: 'SAPY', text: 'SAPY'},
                    {value: 'ALTI', text: 'ALTI'}
                ],
                marketProxies: [
                    {value: 'J200', text: 'J200'},
                    {value: 'J203', text: 'J203'},
                    {value: 'J250', text: 'J250'},
                    {value: 'J257', text: 'J257'},
                    {value: 'J258', text: 'J258'}
                ],
                metricTypes: [
                    {value: 'Weight', text: 'Weight'},
                    {value: 'Beta', text: 'Beta'},
                    {value: 'SystemVolatility', text: 'System Volatility'},
                    {value: 'SpecificVolatility', text: 'Specific Volatility'}
                ],
                indexCode: 'TOPI',
                marketProxy: 'J203',
                metricType: 'Weight'
            }
        },
        components: {
            ModelSelect,
            Circle9
        }
    }


</script>