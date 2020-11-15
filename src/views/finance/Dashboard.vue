<template>
    <div id="app">
        <div class="loader" v-if="loading">
            <div>
                <circle9></circle9>
            </div>
        </div>
        
        <div class="horizontal-no-margin">
            <div class="w60">
                <div class="horizontal w100">
                    <div class="w20">
                        <model-select
                            id="selectIndex"
                            :options="indexCodes"
                            v-model="indexCode"
                            placeholder="Select Index">
                        </model-select>
                        <b-tooltip 
                            target="selectIndex" 
                            placement="left"
                            title="select index to analyze">
                        </b-tooltip>
                    </div>

                    <div class="w20">
                        <model-select 
                            id="selectConstituent"
                            :options="constituentCodes"
                            v-model="constituentCode"
                            placeholder="Select Instrument">
                        </model-select>
                        <b-tooltip 
                            target="selectConstituent" 
                            placement="left"
                            title="select index constituent to analyze">
                        </b-tooltip>
                    </div>

                    <div class="w20">
                        <model-select 
                            id="selectDate"
                            :options="dates"
                            v-model="date"
                            placeholder="Select Date">
                        </model-select>
                        <b-tooltip 
                            target="selectDate" 
                            placement="left"
                            title="select beta calculation date">
                        </b-tooltip>
                    </div>

                    <div class="w20">
                        <model-select 
                            id="selectPeriod"
                            :options="periods"
                            v-model="period"
                            placeholder="Select Period">
                        </model-select>
                        <b-tooltip 
                            target="selectPeriod" 
                            placement="left"
                            title="select length of period for returns">
                        </b-tooltip>
                    </div>

                    <div class="w20">
                        <input type="button" value="Filter"  @click="filter()" class="btn btn-info w60"/>
                    </div>

                    <div class="w20">
                        <input type="button" value="Reset"  @click="plotConstituentData(true)" class="btn btn-info w60"/>
                    </div>
                </div>

                <div class="w100">
                    <zingchart :id="equityChartId" :data="equityChartData"></zingchart>
                </div>
            </div>

            <div class="w40 h100 top">
                <div class="horizontal w100 margined-s">
                    <input 
                        type="button" 
                        value="Pie Chart"  
                        @click="showTable(pieChartId)" 
                        class="btn btn-info margined-s"/>
                    <input 
                        type="button" 
                        value="Beta"  
                        @click="showTable(betasTableId)" 
                        class="btn btn-info margined-s"/>
                    <input 
                        type="button" 
                        value="Alpha"  
                        @click="showTable(alphasTableId)" 
                        class="btn btn-info margined-s"/>
                    <input 
                        type="button" 
                        value="Unique Risk"  
                        @click="showTable(uniqueRiskTableId)" 
                        class="btn btn-info margined-s"/>
                    <input 
                        type="button" 
                        value="Total Risk"  
                        @click="showTable(totalRiskTableId)" 
                        class="btn btn-info margined-s"/>
                </div>

                <transition name="fade">
                    <div v-if="showPieChart" class="horizontal w100 border">
                        <zingchart :plotid="capChartId" :data="capChartData"></zingchart>
                    </div>
                </transition>

                <transition name="fade">
                    <div v-if="showBetas" class="horizontal w100 border">
                        <zing-grid
                            :id="betasTableId"
                            :data.prop="constituentBetaData"
                            layout-controls="disabled"
                            layout="row"
                            filter 
                            pager
                            page-size="7"
                            sort>
                            <zg-caption>
                                {{loadedConstituentCode+' Beta Values'}}
                                <input type="button" value="Export" @click="exportData(betasTableId)" class="btn btn-info right"/>
                            </zg-caption>
                            <zg-colgroup>
                                <zg-column index="Date" filter="disabled"></zg-column>
                                <zg-column index="J200_BT" filter="disabled" cell-class="cellFunction"></zg-column>
                                <zg-column index="J203_BT" filter="disabled" cell-class="cellFunction"></zg-column>
                                <zg-column index="J250_BT" filter="disabled" cell-class="cellFunction"></zg-column>
                                <zg-column index="J257_BT" filter="disabled" cell-class="cellFunction"></zg-column>
                                <zg-column index="J258_BT" filter="disabled" cell-class="cellFunction"></zg-column>
                            </zg-colgroup>
                        </zing-grid>
                    </div>
                </transition>

                <transition name="fade">
                    <div v-if="showAlphas" class="horizontal w100 border">
                        <zing-grid
                            :id="alphasTableId"
                            :data.prop="constituentBetaData"
                            layout-controls="disabled"
                            layout="row"
                            filter 
                            pager
                            page-size="7"
                            sort>
                            <zg-caption>
                                {{loadedConstituentCode+' Alpha Values'}}
                                <input type="button" value="Export" @click="exportData(alphasTableId)" class="btn btn-info right"/>
                            </zg-caption>
                            <zg-colgroup>
                                <zg-column index="Date" filter="disabled"></zg-column>
                                <zg-column index="J200_AL" filter="disabled" cell-class="cellFunction"></zg-column>
                                <zg-column index="J203_AL" filter="disabled" cell-class="cellFunction"></zg-column>
                                <zg-column index="J250_AL" filter="disabled" cell-class="cellFunction"></zg-column>
                                <zg-column index="J257_AL" filter="disabled" cell-class="cellFunction"></zg-column>
                                <zg-column index="J258_AL" filter="disabled" cell-class="cellFunction"></zg-column>
                            </zg-colgroup>
                        </zing-grid>
                    </div>
                </transition>

                <transition name="fade">
                    <div v-if="showUniqueRisk" class="horizontal w100 border">
                        <zing-grid
                            :id="uniqueRiskTableId"
                            :data.prop="constituentBetaData"
                            layout-controls="disabled"
                            layout="row"
                            filter 
                            pager
                            page-size="7"
                            sort>
                            <zg-caption>
                                {{loadedConstituentCode+' Unique Risk Values'}}
                                <input type="button" value="Export" @click="exportData(uniqueRiskTableId)" class="btn btn-info right"/>
                            </zg-caption>
                            <zg-colgroup>
                                <zg-column index="Date" filter="disabled"></zg-column>
                                <zg-column index="J200_UR" filter="disabled"></zg-column>
                                <zg-column index="J203_UR" filter="disabled"></zg-column>
                                <zg-column index="J250_UR" filter="disabled"></zg-column>
                                <zg-column index="J257_UR" filter="disabled"></zg-column>
                                <zg-column index="J258_UR" filter="disabled"></zg-column>
                            </zg-colgroup>
                        </zing-grid>
                    </div>
                </transition>

                <transition name="fade">
                    <div v-if="showTotalRisk" class="horizontal w100 border">
                        <zing-grid
                            :id="totalRiskTableId"
                            :data.prop="constituentBetaData"
                            layout-controls="disabled"
                            layout="row"
                            filter
                            pager
                            page-size="7"
                            sort>
                            <zg-caption>
                                {{loadedConstituentCode+' Total Risk Values'}}
                                <input type="button" value="Export" @click="exportData(totalRiskTableId)" class="btn btn-info right"/>
                            </zg-caption>
                            <zg-colgroup>
                                <zg-column index="Date" filter="disabled"></zg-column>
                                <zg-column index="J200_TR" filter="disabled"></zg-column>
                                <zg-column index="J203_TR" filter="disabled"></zg-column>
                                <zg-column index="J250_TR" filter="disabled"></zg-column>
                                <zg-column index="J257_TR" filter="disabled"></zg-column>
                                <zg-column index="J258_TR" filter="disabled"></zg-column>
                            </zg-colgroup>
                        </zing-grid>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { ModelSelect } from 'vue-search-select'
    import {Circle9} from 'vue-loading-spinner'

    export default {
        props: {
            data: {
                type: Object
            }
        },
        methods: {
            exportData(gridId){
                const zgRef = document.getElementById(gridId);
                const gridData = zgRef.getData({
                    csv: true,
                    headers: true,
                    cols: "visible"
                });
                var hiddenElement = document.createElement('a');
                hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(gridData);
                hiddenElement.target = '_blank';
                hiddenElement.download = gridId+'.csv';
                hiddenElement.click();
            },
            showTable(gridId) {
                if (gridId == this.pieChartId){
                    this.showPieChart=true
                }else{
                    this.showPieChart=false
                }

                if (gridId == this.betasTableId){
                    this.showBetas=true
                }else{
                    this.showBetas=false
                }
                
                if (gridId == this.uniqueRiskTableId){
                    this.showUniqueRisk=true
                }else{
                    this.showUniqueRisk=false
                }
                
                if (gridId == this.totalRiskTableId){
                    this.showTotalRisk=true
                }else{
                    this.showTotalRisk=false
                }
                
                if (gridId == this.alphasTableId){
                    this.showAlphas=true
                }else{
                    this.showAlphas=false
                }
            },
            prepareConstituentData(constituentData){
                var constituentCode = constituentData["alpha"]
                console.log("** new constituent "+constituentCode)
                this.results["constituents"][constituentCode] = constituentData
            },
            getEquityPlotData() {
                var plotData = {
                    type: 'line',
                    legend: {
                        'draggable': true,
                        header: {
                            text: 
                                "* Drag to reposition"+
                                "\n* Click items to hide"
                        }
                    },
                    'crosshair-x': {},
                    "plot": {
                        tooltip: {
                            visible: false
                        },
                        marker:{
                            visible:false,
                            size: '2px'
                        },
                        animation: {
                            delay: 100,
                            effect: "ANIMATION_UNFOLD_HORIZONTAL",
                            speed: "10"
                        }
                    },
                    scaleX: {
                        label: {
                            text: 'Date',
                            fontSize: 16
                        }
                    },
                    scaleY: {
                        label: {
                            text: 'Returns',
                            fontSize: 16
                        }
                    },
                    "title": {
                        text: this.indexCode+': Constituent and Index Returns',
                        padding: '15px',
                        fontColor: '#1E5D9E',
                        fontFamily: 'Lato',
                        fontSize: '20px'
                    },
                    series: []
                }

                return plotData
            },
            fillConstituentInfo() {
                var data = this.results
                let indexCode = data["code"]

                var key = this.constituentCode
                let constituent = data["constituents"][key]

                let monthNames = [
                    "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ];

                let betaData = constituent["Beta"]
                this.constituentBetaData = constituent["Beta"]
                this.loadedConstituentCode = this.constituentCode

                if (betaData !== null) {
                    let alpha = parseFloat(betaData["Alpha"]).toFixed(2)
                    let beta = parseFloat(betaData["Beta"]).toFixed(2)
                    let totalRisk = parseFloat(betaData["TotalRisk"]).toFixed(5)
                    let uniqueRisk = parseFloat(betaData["UniqueRisk"]).toFixed(5)

                    let startDate = new Date(betaData["StartDate"])
                    let endDate = new Date(betaData["Date"])
                    let sm = monthNames[startDate.getMonth()]
                    let em = monthNames[endDate.getMonth()]
                    let sy = startDate.getFullYear().toString().substr(-2);
                    let ey = endDate.getFullYear().toString().substr(-2);

                    this.items.push({ Code: key, Beta: beta, total_risk: totalRisk, unique_risk: uniqueRisk})
                }
            },
            plotConstituentData(reset) {
                var data = this.results
                let indexCode = data["code"]

                var key = this.constituentCode
                let constituent = data["constituents"][key]

                let equityData = constituent["EquityData"][this.date]
                let indexData = constituent["IndexEquityData"][this.date]

                let equitySeries = [], indexSeries = []

                let betaData = constituent["Beta"]
                let seriesText = key+' - Beta: Not Found'

                if (betaData !== null){
                    this.fillConstituentInfo()
                    seriesText = key
                }

                console.log("consituent: "+key)
                for (var i=equityData.length-1; i >= 0; i--) {
                    let equityReturn = parseFloat(equityData[i]["Return"])
                    let indexReturn = parseFloat(indexData[i]["Return"])

                    let equityDate = equityData[i]["Date"]
                    let indexDate = indexData[i]["Date"]

                    equitySeries.push([equityDate,equityReturn])
                    indexSeries.push([indexDate,indexReturn])
                }
                
                var series = this.equityChartData["series"]

                // First time being plotted
                if (!series || reset){
                    series = []
                }

                series.push({ 
                    values: equitySeries, 
                    text: seriesText
                })
                
                if (series.length == 1){
                    series.push({ 
                        values: indexSeries, 
                        text: indexCode
                    })
                }

                // Redraw so that multiple plots can be done
                this.equityChartData = this.getEquityPlotData()
                this.equityChartData["series"] = series
            },
            prepareIndexData() {
                var data = this.results
                
                var constituents = data["constituents"]
                var constituentCodes = []
                var firstKey = ""
                for (var key in constituents) {
                    if (!firstKey) firstKey = key
                    var constituent = constituents[key]
                    constituentCodes.push({ value: constituent["alpha"], text: constituent["Instrument"] })
                }
                this.constituentCodes=constituentCodes;

                // Set the selected instrument defaults to the top one for now
                this.constituentCode = firstKey
                
                //console.log("** top constituent "+firstKey)
                var indexes = data["alternateCodes"]
                var indexCodes = []
                for (var indexCode in indexes) {
                    var index = indexes[indexCode]
                    indexCodes.push({ value: indexCode, text: indexCode+" - "+index })
                }
                this.indexCodes=indexCodes;

                if (!this.indexCode){
                    // Set the selected index defaults to the top one for now
                    this.indexCode = indexCodes[0].value
                }

                // This is to do with range for showing equity returns data
                this.period = ''+data["period"]

                var betaPeriods = data["dates"]
                var dates = []
                for (var i=0; i <betaPeriods.length; i++) {
                    var period = betaPeriods[i]
                    dates.push({ value: period["Date"], text: period["Date"] })
                }
                this.dates=dates;

                if (!this.date){
                    // Set the selected date defaults to the top one for now
                    this.date=dates[0].value
                }
            },
            registerChartEvents(){
                var self = this
                zingchart.node_click = function(data){
                    var alpha = data["text"]
                    if (alpha in self.detached){
                        delete self.detached[alpha];
                    }else {
                        self.detached[alpha] = true
                        self.constituentCode = alpha
                        self.filter()
                    }
                }
                var cellFunction = function(openValue, cellDOMRef, cellRef){
                    var value = parseFloat(openValue)
                    if (this.showBetas){
                        if (value > 1){
                            return 'red'
                        }

                        if (value <= 1 && value >= 0){
                            return 'green'
                        }

                        return 'orange';
                    }else if (this.showAlphas){
                        if (value > 0){
                            return 'green'
                        }

                        if (value < 0){
                            return 'red'
                        }
                    }
                }

                // set up zinggrid
                this.zinggrid = document.querySelector('zing-grid')
                ZingGrid.registerMethod(cellFunction, 'cellFunction', this)
            },
            plotIndexData(){
                var data = this.results
                
                var constituents = data["constituents"]
                var constituentValues = []
                //for(var key in constituents) constituentValues[i] = parseInt(constituents[key], 10);
                constituentValues = Object.values(constituents)
                constituentValues.sort((a, b) => (parseFloat(a["weight"]) > parseFloat(b["weight"])) ? -1 : 1);
        
                let weightSeries = []
                for (var i=0; i < constituentValues.length; i++){
                    var constituent = constituentValues[i]
                    var weight = parseFloat(constituent["weight"])
                    weightSeries.push({ 
                        values: [weight], 
                        text: constituent["alpha"],
                        tooltipText: constituent["alpha"]
                    }) 
                }
                
                this.capChartData = { 
                    graphset: [{
                        type: 'navpie',
                        others: {
                            backgroundColor: "#8b0000"
                        },
                        options: {
                            threshold: "1%",
                            slice: 0.65,
                            back: {
                                padding: 10,
                                fontWeight: "bold",
                                color: "#fff",
                                fontSize: 12,
                                border: "3px solid #47a",
                                borderRadius: 9,
                                backgroundColor: "#369",
                                shadow: true,
                                shadowAlpha: 0.5
                            }
                        },
                        plot: {
                            borderColor: "#2B313B",
                            borderWidth: 2,
                            valueBox: {
                                placement: 'out',
                                text: '%t\n%npv%',
                                fontFamily: "Open Sans"
                            }
                        },
                        title: {
                            text: "Index Capitalisation",
                            padding: '15px',
                            fontColor: '#1E5D9E',
                            fontFamily: 'Lato',
                            fontSize: '20px'
                        },
                        series: weightSeries
                    }]
                }
            }, 
            filter: function(){
                var data = this.results

                console.log("* selects: "+this.indexCode+" "+this.date+" "+this.period )
                console.log("* actual: "+data["code"]+" "+data["date"]+" "+data["period"] )
                if (this.indexCode !== data["code"] || 
                    this.date !== data["date"] || 
                    this.period !== ""+data["period"])
                {
                    // Clear the plot first because new index data
                    this.equityChartData = this.getEquityPlotData()
                    this.getIndexData()
                    return;
                }
                
                console.log("** selected constituent "+this.constituentCode)
                var constituent = data["constituents"][this.constituentCode]
                var equityData = constituent["EquityData"]
                if (!equityData){
                    this.getConstituentData();
                }
            },
            getIndexData(){
                this.loading = true
                console.log("getting index data "+this.indexCode+" "+this.date)
                axios.get(
                        'http://localhost:3000/api'+
                        '/indexes/'+this.indexCode+
                        '/date/'+this.date+
                        '/period/'+this.period
                )
                .then(response => {
                    //console.log("got index data")
                    this.results = response.data.results
                    this.prepareIndexData()
                    this.plotConstituentData(true)
                    this.plotIndexData()
                    this.loading = false
                })
                .catch(e => {
                    this.loading = false
                    console.log(e)
                })
            },
            getConstituentData(){
                this.loading = true
                //console.log("getting constituent data")
                axios.get(
                        'http://localhost:3000/api'+
                        '/index_constituents/'+this.constituentCode+
                        '/index/'+this.indexCode+
                        '/date/'+this.date+
                        '/period/'+this.period
                )
                .then(response => {
                    this.prepareConstituentData(response.data.results)
                    this.plotConstituentData(false)
                    this.loading = false
                })
                .catch(e => {
                    this.loading = false
                    console.log(e)
                })
            }
        },
        created () {
            this.loading = true
            axios.get('http://localhost:3000/api/indexes')
            .then(response => {
                this.results = response.data.results
                this.prepareIndexData()
                this.plotConstituentData(true)
                this.plotIndexData()
                this.registerChartEvents()
                this.loading = false
            })
            .catch(e => {
                this.loading = false
                console.log(e)
            })
        },
        data() {
            return {
                loading: false,
                showPieChart: true,
                showBetas: false,
                showUniqueRisk: false,
                showTotalRisk: false,
                showAlphas: false,
                pieChartId: "pieChart",
                betasTableId: "betasGrid",
                alphasTableId: "alphasGrid",
                uniqueRiskTableId: "uniqueRiskGrid",
                totalRiskTableId: "totalRiskGrid",
                showBetasText: "Show Beta Table",
                equityChartData: {},
                equityChartId: 'equityChart',
                capChartData: {},
                capChartId: 'capChart',
                gridData: {},
                results: {},
                indexCodes: [],
                constituentCodes: [],
                dates: [],
                periods: [
                    {value: '1', text: '1 month'},
                    {value: '6', text: '6 months'},
                    {value: '12', text: '1 year'},
                    {value: '60', text: '5 years'},
                    {value: '120', text: '10 years'},
                ],
                items: [],
                detached: {},
                constituentBetaData: {},
                indexCode: '',
                constituentCode: '',
                loadedConstituentCode: '',
                date: '',
                period: ''
            }
        },
        components: {
            ModelSelect,
            Circle9
        }
    }
</script>