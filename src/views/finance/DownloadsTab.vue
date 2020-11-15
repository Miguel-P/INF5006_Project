<template>
    <div id="app">
        <div class="loader" v-if="loading">
            <div>
                <circle9></circle9>
            </div>
        </div>
        <div id="app-container">
            <div class="horizontal-no-margin">
                    <div class="horizontal w100">
                        <div class="w20">
                            <b-form-select
                                disabled-field="notEnabled"
                                :options="tables"
                                v-model="table"
                                placeholder="Select Table">
                            </b-form-select>
                        </div>
                        <div class="w20" v-if="index_codes_req">  
                            <b-form-select
                                    :options="index_codes"
                                    v-model="index_code"
                                    placeholder="Select Index Code">
                            </b-form-select>
                        </div>
                        <div class="w20">  
                            <b-form-select 
                                :options="marketProxies"
                                v-model="marketProxy"
                                placeholder="Select Market Proxy">
                            </b-form-select>
                        </div>
                        <div class="w20" v-if="share_codes_req"> 
                            <b-form-select 
                                :options="share_codes"
                                v-model="share_code"
                                placeholder="Select Share Code">
                            </b-form-select>
                        </div>
                        <div class="w20">
                            <b-form-select 
                                :options="dates"
                                v-model="date"
                                placeholder="Select Date">
                            </b-form-select>
                        </div>

                        <div class="w20">
                            <b-form-select 
                                :options="periods"
                                v-model="period"
                                placeholder="Select Period">
                            </b-form-select>
                        </div>
                    </div>
                    <div class="w100 margined">
                        <div class="w20">
                            <input type="button" value="Create Table"  @click="createTable()" class="btn btn-info w60"/>
                        </div>
                        <div class="w20">
                                <!-- <button type="submit" onclick="window.open('file.csv')">Download!</button> -->
                                <input type="button" value="Download Table"  @click="downloadTable()" class="btn btn-info w60"/>
                        </div>
                    </div>
                    <b-form-group class = "margined" label="Add/Remove Columns:" v-show='loaded'>
                        <b-form-checkbox-group
                          id="checkbox-group-1"
                          v-model="selected_columns"
                          :options="possible_columns"
                        ></b-form-checkbox-group>
                    </b-form-group>
                <zing-grid id="downloads_table" :data.prop="gridData" filter sort pager>
                </zing-grid>
             </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import { ModelSelect } from 'vue-search-select'
    import Navbar from '@/components/Navbar'
    import Sidebar from '@/components/Sidebar'
    import {Circle9} from 'vue-loading-spinner'

    // const ZG = document.querySelector('#downloads_table');
    // ZG.registerMethod('tooltips', renderTooltip);

    export default {
        components: {
            ModelSelect,
            Navbar,
            Sidebar,
            Circle9
        },
        methods: {
            renderTooltip: function() {

                let zgRef = document.querySelector('#downloads_table');

                if (this.table == "sharesMetrics"){
                   var tooltip_data = this.share_metrics_tooltips

                }
                else if (this.table == "portfMetrics") {
                    var tooltip_data =  this.portfolio_metrics_tooltips


                }
                else if (this.table == "indusPortfMetrics"){
                    var tooltip_data =  this.industry_portfolio_metrics_tooltips
                }

                for (var i = 0; i < tooltip_data.length; i++) {
                    console.log(tooltip_data[i].column_name)
                    let zgColumn = zgRef.querySelector('zg-column[index="'+tooltip_data[i].column_name+'"]');
                    zgColumn.setAttribute('header-tooltip-text', tooltip_data[i].description)
                    zgColumn.setAttribute('header-tooltip-trigger', "text")
                }
            },
            downloadTable: function() {
                console.log("Downloading table")
                const data = downloads_table.getData({
                                csv: true,
                                headers: true,
                                cols: "visible",
                                rows: "visible" 
                              });                
                var hiddenElement = document.createElement('a');
                hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(data);
                hiddenElement.target = '_blank';
                hiddenElement.download = this.table+"_"+this.date+"_period"+this.period+'.csv';
                hiddenElement.click();
            },

            arrayToCSV: function(objArray) {
                const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
                let str = `${Object.keys(array[0]).map(value => `"${value}"`).join(",")}` + '\r\n';

                return array.reduce((str, next) => {
                    str += `${Object.values(next).map(value => `"${value}"`).join(",")}` + '\r\n';
                    return str;
                    }, str);
            },
            makeColumnSelectors: function(response) {
                console.log("Making column selectors...")
                this.possible_columns = []
                this.selected_columns = []
                // fetch the column names from the returned data:
                for (var item in response.data.message[0]){
                    this.possible_columns.push(item)
                }
                this.selected_columns = this.possible_columns
                // now display the check box item
                this.loaded = true
            },
            getSharesMetrics: async function() {
                if (this.share_code == "View All") {
                    var share_code = ""
                }
                else {
                    var share_code = "share_code/" + this.share_code + "/"
                }
                let response = await axios.get(
                            'http://localhost:3000/api/downloads/'+
                            this.table+ '/' +
                            this.index_code+ "/" +
                            this.marketProxy + "/" +
                            share_code +
                            'date/'+this.date+
                            '/period/'+this.period
                )
                return await response
            },
            getSharesMetricsTooltips: async function() {
                let response = await axios.get(
                            'http://localhost:3000/api/tooltips/shares_metrics'
                )
                return await response
            },
            getPortfMetrics: async function() {
                let response = await axios.get(
                            'http://localhost:3000/api/downloads/'+
                            this.table+ '/' +
                            this.marketProxy + "/" +
                            'date/'+this.date+
                            '/period/'+this.period
                )
                return await response
            },
            getPortfMetrics_tooltips: async function() {
                let response = await axios.get(
                            'http://localhost:3000/api/tooltips/portfolio_metrics'
                )
                return await response
            },
            getIndustryPortfMetrics_tooltips: async function() {
                let response = await axios.get(
                            'http://localhost:3000/api/tooltips/industry_portfolio'
                )
                return await response
            },
            getIndusPortfMetrics: async function() {
                let response = await axios.get(
                            'http://localhost:3000/api/downloads/'+
                            this.table+ '/' +
                            'index/' + this.index_code+ "/" +
                            'mkt_index/' + this.marketProxy + "/" +
                            'date/' + this.date+
                            '/period/'+this.period
                )
                return await response
            },
            getStandardTables: async function() {
                let response = await axios.get(
                            'http://localhost:3000/api/downloads/'+
                            this.table+'/'+
                            this.marketProxy+
                            '/date/'+this.date+
                            '/period/'+this.period
                )
                return await response
            },
            createTable: function(){
                // first check the invariants and return if false
                if (this.table == null) {
                    alert("Please select all of the options before creating the table.")
                    return
                }
                
                this.loading = true
                this.loaded = false

                if (this.table == "sharetable" | this.table == "indextable"){
                    // check that all of the data we need to request the table is present
                    // if not, create an alert and exit gracefully.
                    if (this.marketProxy == null | this.date == null | this.period == null){
                        alert("Please select all of the options before creating the table.")
                        this.loading = false
                        return
                    }
                    // if everything fine, fetch the data and create the table.
                    this.getStandardTables()
                    .then(response => {
                        this.loading = false
                        console.log("Table data = ", response.data.message[0])
                        this.gridData = response.data.message
                        this.makeColumnSelectors(response)
                    })
                    .catch(e => {
                        console.log(e)
                    })
                }
                else if (this.table == "sharesMetrics"){
                    if (this.index_code == null | this.marketProxy == null | this.share_code == null |
                        this.date == null | this.period == null){
                        alert("Please select all of the options before creating the table.")
                        this.loading = false
                        return
                    }
                    this.getSharesMetrics()
                    .then(response => {
                        this.loading = false
                        console.log("Table data = ", response.data.message[0])
                        this.gridData = response.data.message
                        this.makeColumnSelectors(response)
                        this.getSharesMetricsTooltips()
                        .then(response => {
                            this.share_metrics_tooltips = response.data["message"]
                        })
                        .then(
                            this.renderTooltip()
                        )
                    })
                    .catch(e => {
                        console.log(e)
                    })
                }
                else if (this.table == "portfMetrics"){
                    if (this.marketProxy == null | this.date == null | this.period == null){
                        alert("Please select all of the options before creating the table.")
                        this.loading = false
                        return
                    }
                    this.getPortfMetrics()
                    .then(response => {
                        this.loading = false
                        console.log("Table data = ", response.data.message[0])
                        this.gridData = response.data.message
                        this.makeColumnSelectors(response)
                        this.getPortfMetrics_tooltips()
                        .then(response => {
                            this.portfolio_metrics_tooltips = response.data["message"]
                        })
                        .then(
                            console.log(this.portfolio_metrics_tooltips),
                            this.renderTooltip()
                        )
                    })
                    .catch(e => {
                        console.log(e)
                    })
                }
                else {
                    if (this.index_code == null | this.marketProxy == null |
                        this.date == null | this.period == null){
                        alert("Please select all of the options before creating the table.")
                        this.loading = false
                        return
                    }
                    this.getIndusPortfMetrics()
                    .then(response => {
                        this.loading = false
                        console.log("Table data = ", response.data.message[0])
                        this.gridData = response.data.message
                        this.makeColumnSelectors(response)
                        this.getIndustryPortfMetrics_tooltips()
                        .then(response => {
                            this.industry_portfolio_metrics_tooltips = response.data["message"]
                        })
                        .then(
                            this.renderTooltip()
                        )
                    })
                    .catch(e => {
                        console.log(e)
                    })
                }
            }
        },
        created () {
            // get info for drop down selectors
            // get dates
            axios.get('http://localhost:3000/api/downloads/dates')
            .then(response => {
                console.log("Fetching dates")
                // console.log("response", response)
                // since the message is packed with stringify, the output/json obj is an array!
                var dateArray = response.data["message"]
                // this.dates = Object.values(dateArray)
                for (var i=0; i <dateArray.length; i++) {
                    var date = dateArray[i].Date.substring(0,10)
                    this.dates.push({ value: date, text: date })
                }
            })
            .catch(e => {
                console.log(e)
            })
            // get the share codes
            axios.get('http://localhost:3000/api/downloads/share_codes')
            .then(response => {
                console.log("Fetching share codes")
                // console.log("response", response)
                var shareCodesArray = response.data["message"]
                for (var i=0; i <shareCodesArray.length; i++) {
                    var share_code = shareCodesArray[i].share_code
                    this.share_codes.push({ value: share_code, text: share_code })
                }
            })
            .catch(e => {
                console.log(e)
            })
            // get the index codes
            axios.get('http://localhost:3000/api/downloads/index_codes')
            .then(response => {
                console.log("Fetching index codes")
                // console.log("response", response)
                var indexCodesArray = response.data["message"]
                for (var i=0; i <indexCodesArray.length; i++) {
                    var index_code = indexCodesArray[i].index_code
                    this.index_codes.push({ value: index_code, text: index_code })
                }
            })
            .catch(e => {
                console.log(e)
            })
        },
        data() {
            return {
                loading: false,
                gridData: {},
                results: {},
                loaded: false,
                tables: [
                    {value: null, text: 'Please Select Table' , notEnabled: true},
                    {value: 'sharetable', text: 'Share Table'},
                    {value: 'indextable', text: 'Index Table'},
                    {value: 'indusPortfMetrics', text: 'Industry Portfolio Table'},
                    {value: 'sharesMetrics', text: 'Share Metrics Table'},
                    {value: 'portfMetrics', text: 'Portfolio Metrics Table'}
                ],
                table: null,
                marketProxies: [
                    {value: null, text: 'Please Select Market Proxy', notEnabled: true },
                    {value: 'J200', text: 'J200'},
                    {value: 'J203', text: 'J203'},
                    {value: 'J250', text: 'J250'},
                    {value: 'J257', text: 'J257'},
                    {value: 'J258', text: 'J258'}
                ],
                marketProxy: null,
                dates: [
                    {value: null, text: 'Please Select Date', notEnabled: true }
                ],
                date: null,
                periods: [
                    {value: null, text: 'Please Select Period', notEnabled: true},
                    {value: '1', text: '1 month'},
                    {value: '6', text: '6 months'},
                    {value: '12', text: '1 year'},
                    {value: '60', text: '5 years'},
                    {value: '120', text: '10 years'},
                ],
                period: null,
                share_codes: [
                    {value: null, text: 'Please Select Share Code', notEnabled: true},
                    {value: "View All", text: "View All"}
                ],
                share_code: null,
                index_codes: [
                    {value: null, text: 'Please Select Index Code', notEnabled: true},
                ],
                index_code: null,
                selected_columns: [],
                possible_columns: [],
                share_codes_req: false,
                index_codes_req: false,
                portfolio_metrics_tooltips: null,
                industry_portfolio_metrics_tooltips: null,
                share_metrics_tooltips: null
            }
        },
        watch: {
            selected_columns: function () {
                var diff = this.possible_columns.filter(x => !this.selected_columns.includes(x) );
                for (var i = 0; i < diff.length; i++) {
                    downloads_table.hideColumn(diff[i])
                }
                for (var i = 0; i < this.selected_columns.length; i++) {
                    downloads_table.showColumn(this.selected_columns[i])
                }
            },
            table: function () {
                if (this.table == "sharesMetrics") {
                    this.share_codes_req = true
                    this.index_codes_req = true
                    this.marketProxy = null
                    this.date = null
                    this.share_code = null
                    this.index_code = null
                    this.period = null
                }
                else if (this.table == "indusPortfMetrics") {
                    this.share_codes_req = false
                    this.index_codes_req = true
                    this.marketProxy = null
                    this.date = null
                    this.share_code = null
                    this.index_code = null
                    this.period = null
                }
                else {
                    this.share_codes_req = false
                    this.index_codes_req = false
                }
            },
            portfolio_metrics_tooltips: function () {
                this.renderTooltip();
            },
            industry_portfolio_metrics_tooltips: function () {
                this.renderTooltip();
            }, 
            share_metrics_tooltips: function () {
                this.renderTooltip();
            }
        }
    }
</script>

