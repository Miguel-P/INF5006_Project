<template>
    <div id="app">
        <ul v-if="errors && errors.length">
        <li v-for="error of errors"  v-bind:key="error">
            {{error.message}}
        </li>
        </ul>
        <zing-grid :data.prop="gridData" filter sort pager></zing-grid>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        props: {
            data: {
                type: Object
            }
        },
        methods: {
            plotData() {
                //this.gridData = this.data.AutomobileData
            }
        },
        created () {
            axios.get('http://localhost:3000/api/index_constituents')
            .then(response => {
                this.gridData = null
                console.log(response.data.data)
                this.gridData = response.data.results
            })
            .catch(e => {
                this.errors.push(e)
            })
        },
        data() {
            return {
                chartData: {},
                gridData: {}
            }
        }
    }
</script>
