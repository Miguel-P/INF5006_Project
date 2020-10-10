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
                        :options="dates"
                        v-model="date"
                        placeholder="Select Period">
                    </model-select>
                </div>
                <div class="w20">
                    <input type="button" value="Get Data"  @click="getBetaData()" class="btn btn-info w60"/>
                </div>
            </div>
            <zing-grid 
                caption="Share Betas"
                draggable="columns" 
                drag-action="reorder" 
                :data.prop="sharesBetaData" 
                filter 
                pager
                sort>
                <zg-colgroup>
                    <zg-column index="InstrumentCode" filter="disabled" sort="disabled"></zg-column>
                    <zg-column index="FirstTrade" filter="disabled" sort="disabled" width="150"></zg-column>
                    <zg-column index="LastTrade" filter="disabled" sort="disabled" width="150"></zg-column>
                    <zg-column index="J200" filter="disabled" cell-class="betaCellFunction"></zg-column>
                    <zg-column index="J203" filter="disabled" cell-class="betaCellFunction"></zg-column>
                    <zg-column index="J250" filter="disabled" cell-class="betaCellFunction"></zg-column>
                    <zg-column index="J257" filter="disabled" cell-class="betaCellFunction"></zg-column>
                    <zg-column index="J258" filter="disabled" cell-class="betaCellFunction"></zg-column>
                    <zg-column index="Industry" sort="disabled" width="200" type="select" :type-select-options="industries"></zg-column>
                    <zg-column index="SuperSector" sort="disabled" width="250" type="select" :type-select-options="superSectors"></zg-column>
                    <zg-column index="Sector" sort="disabled" width="300" type="select" :type-select-options="sectors"></zg-column>
                    <zg-column index="SubSector" sort="disabled" width="350" type="select" :type-select-options="subSectors"></zg-column>
                </zg-colgroup>
            </zing-grid>
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
            prepareData() {
                var data = this.results

                var betaCellFunction = function(openValue, cellDOMRef, cellRef){
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

                var betaPeriods = data["dates"]
                var dates = []
                for (var i=0; i <betaPeriods.length; i++) {
                    var period = betaPeriods[i]
                    dates.push({ value: period["Date"], text: period["Date"] })
                }
                this.dates=dates;
                if (!this.date){
                    this.date=dates[0].value
                }

                this.sharesBetaData = data["betas"]

                // Get Industry Array
                let industryValues = this.sharesBetaData.map(a => a["Industry"])
                let uniqueIndustries = Array.from(new Set(industryValues))
                this.industries = JSON.stringify(uniqueIndustries)

                let superSectorValues = this.sharesBetaData.map(a => a["SuperSector"])
                let uniqueSuperSectors = Array.from(new Set(superSectorValues))
                this.superSectors = JSON.stringify(uniqueSuperSectors)

                let sectorValues = this.sharesBetaData.map(a => a["Sector"])
                let uniqueSectors = Array.from(new Set(sectorValues))
                this.sectors = JSON.stringify(uniqueSectors)

                let subSectorValues = this.sharesBetaData.map(a => a["SubSector"])
                let uniqueSubSectors = Array.from(new Set(subSectorValues))
                this.subSectors = JSON.stringify(uniqueSubSectors)
            },
            getBetaData(){
                this.loading = true
                axios.get(
                    'http://localhost:3000/api'+
                    '/index_constituents'+
                    '/betas'+
                    '/date/'+this.date
                )
                .then(response => {
                    this.results = response.data.results
                    this.prepareData()
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
            axios.get('http://localhost:3000/api/index_constituents/betas')
            .then(response => {
                this.results = response.data.results
                this.prepareData()
                this.loading = false
            })
            .catch(e => {
                this.loading = false
                console.log(e)
            })
        },
        data() {
            return {
                loading: true,
                results: {},
                industries: '',
                superSectors: '',
                sectors: '',
                subSectors: '',
                sharesBetaData: {},
                dates: [],
                date: ''
            }
        },
        components: {
            ModelSelect,
            Circle9
        }
    }


</script>