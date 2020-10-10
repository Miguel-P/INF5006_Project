<template>
    <div id="app">
        <Navbar/>
        <Sidebar/>
        <div id="app-container">
            <div class="horizontal-no-margin">
                    <div class="horizontal w100">
                        <div class="w20">
                            <model-select
                                :options="tables"
                                v-model="table"
                                placeholder="Select Table">
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
                    </div>
                    <div class="w20">
                            <input type="button" value="Create Table"  @click="createTable()" class="btn btn-info w60"/>
                    </div>
                <zing-grid :data.prop="gridData" filter sort pager></zing-grid>
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
            
            createTable: function(){
                axios.get(
                            'http://localhost:3000/api/downloads/'+
                            this.table+'/'+
                            this.marketProxy+
                            '/date/'+this.date+
                            '/period/'+this.period
                    )
                .then(response => {
                    this.gridData = null
                    console.log("Table data = ", response.data.message)
                    this.gridData = response.data.message
                })
                .catch(e => {
                    this.errors.push(e)
                })
            },
            getIndexData(){
                console.log("getting index data "+this.indexCode+" "+this.date)
                axios.get(
                        'http://localhost:3000/api'+
                        '/indexes/'+this.indexCode+
                        '/date/'+this.date+
                        '/period/'+this.period
                )
                .then(response => {
                    console.log("got index data")
                    this.results = response.data.results
                    this.prepareIndexData()
                    this.plotReturns()
                    this.plotCapData()
                })
                .catch(e => {
                    console.log(e)
                })
            },
            getConstituentData(){
                console.log("getting constituent data")
                axios.get(
                        'http://localhost:3000/api'+
                        '/index_constituents/'+this.constituentCode+
                        '/index/'+this.indexCode+
                        '/date/'+this.date+
                        '/period/'+this.period
                )
                .then(response => {
                    console.log("got constituent data")
                    this.prepareConstituentData(response.data.results)
                    this.plotReturns()
                })
                .catch(e => {
                    console.log(e)
                })
            }
        },
        created () {
            axios.get('http://localhost:3000/api/downloads/dates')
            .then(response => {
                console.log("Fetching dates")
                console.log("response", response)
                // since the message is packed with stringify, the output/json obj is an array!
                var dateArray = response.data["message"]
                // this.dates = Object.values(dateArray)
                for (var i=0; i <dateArray.length; i++) {
                    var date = dateArray[i].Date.substring(0,10)
                    this.dates.push({ value: date, text: date })
                }
                // dates.push({ value: period["Date"], text: period["Date"] })
                // for(var i in response["message"]) {
                //     console.log(i.Date)
                //     this.dates.push(i.Date)
                // }
            })
            .catch(e => {
                console.log(e)
            })
        },
        data() {
            return {
                gridData: {},
                results: {},
                tables: [
                    {value: 'sharetable', text: 'Share Table'},
                    {value: 'indextable', text: 'Index Table'}
                ],
                table: '',
                marketProxies: [
                    {value: 'J200', text: 'J200'},
                    {value: 'J203', text: 'J203'},
                    {value: 'J250', text: 'J250'},
                    {value: 'J257', text: 'J257'},
                    {value: 'J258', text: 'J258'}
                ],
                marketProxy: '',
                dates: [],
                date: '',
                periods: [
                    {value: '1', text: '1 month'},
                    {value: '6', text: '6 months'},
                    {value: '12', text: '1 year'},
                    {value: '60', text: '5 years'},
                    {value: '120', text: '10 years'},
                ],
                period: ''
            }
        }
    }
</script>

