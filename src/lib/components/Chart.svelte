<script lang="ts">
  let {
    data,
    sumChart
  }: {
    data: { artistName: string; scoresByHour: number[]; selected: boolean }[];
    sumChart: boolean;
  } = $props();

  /**
   * Convert a numeric hour to human readable format e.g. 1am, 2pm
   */
  function hourToLabel(hour: number): string {
    return hour < 12 ? `${hour}am` : hour === 12 ? '12pm' : `${hour - 12}pm`;
  }

  /*
  I chose amCharts because I've used them before and I understand their interface,
  and I chose a radar chart because time is a continuous axis, which wouldn't be
  conveyed well by a line or bar chart, whereas a radar chart is perfect.
  */

  import { onMount } from 'svelte';
  import * as am5 from '@amcharts/amcharts5?client';
  import * as am5xy from '@amcharts/amcharts5/xy?client';
  import * as am5radar from '@amcharts/amcharts5/radar?client';
  import am5themes_Animated from '@amcharts/amcharts5/themes/Animated?client';
  import am5themes_Dark from '@amcharts/amcharts5/themes/Dark?client';

  let chartdiv: HTMLDivElement;
  onMount(() => {
    // Create the chart root element and set styles
    let root = am5.Root.new(chartdiv);
    root.setThemes([am5themes_Animated.new(root), am5themes_Dark.new(root)]);
    let chart = root.container.children.push(am5radar.RadarChart.new(root, {}));

    // Create the circular axis for the hours
    let hourAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'time',
        renderer: am5radar.AxisRendererCircular.new(root, {})
      })
    );
    // Generate the hour labels
    hourAxis.data.setAll(
      Array.from({ length: 24 }, (_, i) => {
        return { time: hourToLabel(i) };
      })
    );

    // Create the radial axis for the engagement scores
    let engagementAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5radar.AxisRendererRadial.new(root, {})
      })
    );

    let allSeries = [];
    let legend = chart.children.push(am5.Legend.new(root, {}));

    $effect(() => {
      while (chart.series.length) {
        chart.series.removeIndex(0).dispose();
      }

      if (sumChart) {
        // Create a series for the sum of all artists
        let sumSeries = chart.series.push(
          am5radar.RadarLineSeries.new(root, {
            name: 'Sum',
            xAxis: hourAxis,
            yAxis: engagementAxis,
            valueYField: 'value',
            categoryXField: 'time'
          })
        );
        sumSeries.data.setAll(
          Array.from({ length: 24 }, (_, hour) => {
            return {
              time: hourToLabel(hour),
              value: data.reduce(
                (sum, artist) =>
                  sum + (artist.selected ? artist.scoresByHour[hour] : 0), // Only sum selected artists
                0
              )
            };
          })
        );
      } else {
        for (let artistID = 0; artistID < data.length; artistID++) {
          if (
            typeof data[artistID] === 'undefined' ||
            !Object.hasOwn(data[artistID], 'artistName') ||
            !Object.hasOwn(data[artistID], 'scoresByHour') ||
            data[artistID].scoresByHour.length !== 24 ||
            data[artistID].selected == false
          ) {
            continue;
          }

          // Create a series for each artist
          const series = chart.series.push(
            // am5radar.SmoothedRadarLineSeries.new(root, { // Use this for a smoothed line
            am5radar.RadarLineSeries.new(root, {
              name: data[artistID].artistName,
              xAxis: hourAxis,
              yAxis: engagementAxis,
              valueYField: 'value',
              categoryXField: 'time'
            })
          );
          series.data.setAll(
            data[artistID].scoresByHour.map((score, hour) => {
              return {
                time: hourToLabel(hour),
                value: score
              };
            })
          );

          allSeries.push(series);
        }
      }

      // Update the legend with the series
      legend.data.setAll(chart.series.values);
    });

    return () => {
      root.dispose();
    };
  });
</script>

<div class="chart" bind:this={chartdiv}></div>

<style>
  .chart {
    width: 100%;
    height: 500px;
  }
</style>
