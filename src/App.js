import React from "react";
import ReactFC from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import TimeSeries from "fusioncharts/fusioncharts.timeseries";

// Adding the chart and theme as dependency to the core fusioncharts
ReactFC.fcRoot(FusionCharts, TimeSeries);

const dataWithTimeZone = [
    ["2022-03-11T00:00:00-06:00", 53.1814],
    ["2022-03-12T00:00:00-06:00", 50.7],
    ["2022-03-13T00:00:00-06:00", 50.2547],
    ["2022-03-14T00:00:00-05:00", 62.9599],
    ["2022-03-15T00:00:00-05:00", 70.7427],
    ["2022-03-16T00:00:00-05:00", 65.3493]
]

let schema = [
    {
        name: "Time",
        type: "date",
        format: "%Y-%m-%dT%H:%M:%S%Z"
    },
    {
        name: "Value",
        type: "number"
    }
]

const fusionTableWithTimeZone = new FusionCharts.DataStore().createDataTable(dataWithTimeZone, schema)

const dataWithoutTimeZone = dataWithTimeZone.map(datum => [datum[0].slice(0,19), datum[1]]) // eg 2022-03-13T:00:00:00
schema[0].format ="%Y-%m-%dT%H:%M:%S" // remove the "%Z"
const fusionTableWithoutTimeZone = new FusionCharts.DataStore().createDataTable(dataWithoutTimeZone, schema)

const chartConfigs = {
    type: "timeseries", // The chart type
    width: "100%", // Width of the chart
    height: "300", // Height of the chart
    dataSource: {
        data: fusionTableWithTimeZone,
        navigator: {enabled: false},
        xAxis: {
            outputTimeFormat: {
                day: "%Y-%m-%dT%H:%M:%S%Z"
            },
        },
        dataMarker: dataWithTimeZone.map(datum => {
            const date = datum[0].slice(0, 10) // e.g. 2022-03-11

            return {
                series: "Value",
                time: date,
                timeFormat: "%Y-%m-%d",
                // identifier: "A",
                tooltext: `${date} should be ${datum[1]}`
            }
        })
    },
};

const App = () => <>
    <h2>Graph of incorrect results (default parsing)</h2>
    <ReactFC {...chartConfigs} />

    <h2>Graph of expected results (time zones removed)</h2>
    <ReactFC {...chartConfigs} dataSource={{...chartConfigs.dataSource, data: fusionTableWithoutTimeZone}} />

    <h2>Table of expected results</h2>
    <table style={{border: '1px solid black'}}>
        <thead>
        <tr>
            <th>Date</th>
            <th>Value</th>
        </tr>
        </thead>
        <tbody>
        {dataWithTimeZone.map((datum, i) => {

                return <tr key={i}>
                    <td>{datum[0]}</td>
                    <td>{datum[1]}</td>
                </tr>
            }
        )}
        </tbody>
    </table>
</>

export default App;