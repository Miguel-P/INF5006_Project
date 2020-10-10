<template>
    <div id="app">
        <Navbar/>
        <Sidebar/>
        <div id="app-container">
            <div class="horizontal-no-margin">
                <div class="w60">
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
                                :options="constituentCodes"
                                v-model="constituentCode"
                                placeholder="Select Instrument">
                            </model-select>
                        </div>

                        <div class="w20">
                            <model-select 
                                :options="dates"
                                v-model="date"
                                placeholder="Select Date">
                            </model-select>
                        </div>

                        <div class="w20">
                            <model-select 
                                :options="periods"
                                v-model="period"
                                placeholder="Select Period">
                            </model-select>
                        </div>

                        <div class="w20">
                            <input type="button" value="Filter"  @click="filter()" class="btn btn-info w60"/>
                        </div>
                    </div>

                    <div class="w100">
                        <zingchart :data="equityChartData"></zingchart>
                    </div>
                </div>
                <div class="w40">
                    <zingchart :data="capChartData"></zingchart>
                </div>
             </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import { ModelSelect } from 'vue-search-select'
    import Navbar from '@/components/Navbar'
    import Sidebar from '@/components/Sidebar'

    export default {
        components: {
            ModelSelect,
            Navbar,
            Sidebar
        },
        methods: {
            prepareConstituentData(constituentData){
                var constituentCode = constituentData["alpha"]
                console.log("** new constituent "+constituentCode)
                this.results["constituents"][constituentCode] = constituentData
            },
            getEquityPlotData(){
                var plotData = {
                    type: 'line',
                    legend: {
                        /*header: {
                            text: "Beta: "+beta+
                            "\nAlpha: "+alpha+
                            "\nTotal Risk: "+totalRisk+
                            "\nUnique Risk: "+uniqueRisk
                        }*/
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
                    series: [
                        //{ values: equitySeries, text: key+' Returns'},
                        //{ values: indexSeries, text:  indexCode+' Returns'}
                    ]
                }

                return plotData
            },
            registerChartEvents(){
                zingchart.node_click = function(data){ 
                    console.log(data)
                }
            },
            plotConstituentData(){
                var data = this.results
                let indexCode = data["code"]

                var key = this.constituentCode
                let constituent = data["constituents"][key]

                let equityData = constituent["EquityData"][this.date]
                let indexData = constituent["IndexEquityData"][this.date]

                let equitySeries = [], indexSeries = []

                let monthNames = [
                    "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ];

                let betaData = constituent["Beta"]
                let seriesText = key+' - Beta: Not Found'

                if (betaData !== null){
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

                    seriesText = key+' - Beta: '+beta +' ( '+sm+' '+sy+' - '+em+' '+ey+' )'
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
                if (!series){
                    series = []
                }

                series.push({ 
                    values: equitySeries, 
                    text: seriesText
                })
                
                if (series.length == 1){
                    series.push({ 
                        values: indexSeries, 
                        text: indexCode+' - Beta: 1'
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
                    constituentCodes.push({ value: constituent["alpha"], text: constituent["alpha"] })
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
            plotIndexData(){
                var data = this.results
                
                var constituents = data["constituents"]
                var constituentValues = []
                //for(var key in constituents) constituentValues[i] = parseInt(constituents[key], 10);
                constituentValues = Object.values(constituents)
                constituentValues.sort((a, b) => (parseFloat(a["weight"]) > parseFloat(b["weight"])) ? -1 : 1);
        
                let weightSeries = []
                let totalWeight = 0
                // Show top 10 index contributors and the rest group them up
                for (var i=0; i < Math.min(constituentValues.length,20); i++) {
                    var constituent = constituentValues[i]
                    var weight = parseFloat(constituent["weight"])
                    totalWeight += weight
                    weightSeries.push({ values: [weight], text: constituent["alpha"]}) 
                }
                weightSeries.push({ values: [100 - totalWeight], text: "Other" })
                
                this.capChartData = {
                    type: 'pie',
                    scaleX: {
                        zooming: true //sets zooming along scaleX
                    },
                    scaleY: {
                        zooming: true //sets zooming along scaleY
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
                    this.plotConstituentData()
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
                    this.plotConstituentData()
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
                this.plotConstituentData()
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
                indexCode: '',
                constituentCode: '',
                date: '',
                period: ''
            }
        }
    }
</script>

<style>
    .w100 {
        width: 100%;
    }

    .w60 {
        width: 60%;
    }

    .w40 {
        width: 40%;
    }

    .w20 {
        width: 20%;
    }

    .horizontal div {
        display: inline-block;
        margin: 2px;
    }

    .horizontal-no-margin div {
        display: inline-block;
    }
</style>
