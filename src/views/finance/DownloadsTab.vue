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
                    <div class="w100">
                        <div class="w20">
                            <input type="button" value="Create Table"  @click="createTable()" class="btn btn-info w60"/>
                        </div>
                        <div class="w20">
                                <!-- <button type="submit" onclick="window.open('file.csv')">Download!</button> -->
                                <input type="button" value="Download Table"  @click="downloadTable()" class="btn btn-info w60"/>
                        </div>
                    </div>
                    <b-form-group label="Add/Remove Columns:" v-show='loaded'>
                        <b-form-checkbox-group
                          id="checkbox-group-1"
                          v-model="selected_columns"
                          :options="possible_columns"
                        ></b-form-checkbox-group>
                    </b-form-group>
                <zing-grid id="downloads_table" :data.prop="gridData" filter sort pager></zing-grid>
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
                    this.loaded = false
                    this.possible_columns = []
                    this.selected_columns = []
                    console.log("Table data = ", response.data.message[0])
                    this.gridData = response.data.message
                    // fetch the column names from the returned data:
                    for (var item in response.data.message[0]){
                        this.possible_columns.push(item)
                    }
                    this.selected_columns = this.possible_columns
                    // now display the check box item
                    this.loaded = true
                    // This should work, but doesn't. In any case, it's not that intuitive.
                    // downloads_table.setDraggable('columns');
                    // downloads_table.setDragAction('remove');
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
            })
            .catch(e => {
                console.log(e)
            })
        },
        data() {
            return {
                gridData: {},
                results: {},
                loaded: false,
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
                period: '',
                selected_columns: [],
                possible_columns: []
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
            }
        }
    }
</script>

