import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Chart, ChartEvent, LegendElement, LegendItem} from "chart.js/auto";
import {Observable, of, Subscription} from "rxjs";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {MyLineChartData} from "../../core/models/rendering/MyLineChartData";

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, OnDestroy, AfterViewInit {

  public myChart?: Chart;

  private subscriptions: Subscription[] = [];
  @Input() lineDatas$: Observable<MyLineChartData[]> = of([]);

  lineDatas!: MyLineChartData[];
  @Input() chartId!: string

  @Input() lineLabel = '';

  @Input() legendClickActionGivenLegendText!: Function;
  @Input() customLegend = false;
  @Input() customLegendClick = false;
  @Output() legendClick = new EventEmitter<string>();
  @Output() graphClick = new EventEmitter<string>();
  @Output() loadedGraph = new EventEmitter<string>();
  fullChartId: string = 'pieChart';
  hoveredLabel = '';

  constructor(
  ) {
  }

  ngOnInit(): void {


  }

  ngAfterViewInit(): void {
    this.subscriptions.push(this.lineDatas$.subscribe( value => {
      this.lineDatas = value;
      if (this.chartId){
        this.fullChartId += this.chartId;
      }
      this.displayGraph()
      this.loadedGraph.emit('loaded');
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => (sub).unsubscribe());
    this.myChart?.destroy();
  }


  /**
   * Display the graphic with our object we just received.
   */
  displayGraph(): void {
    if (this.lineDatas.length == 0) {
      return;
    }
    this.myChart?.destroy();
    const canvas = document.getElementById('fullLineChartId') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (ctx != null) {
      if (this.myChart != null){
        this.myChart.destroy();
      }
      this.myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.lineDatas.map(data => {return data.xValue}),
          datasets: [{
            label: this.lineLabel,
            data: this.lineDatas.map(data => {return data.yValue}),
          }]
        },
        plugins: [ChartDataLabels],
        options: {
          onClick: (e: ChartEvent) => {
            this.graphClick.emit(this.hoveredLabel);
          },
          animation: false,
          plugins: {
            legend: this.customLegendClick ? {
              onClick: this.newLegendClickHandler,
              display: !this.customLegend,
              position: 'bottom',
            } : {
              display: !this.customLegend,
              position: 'bottom',
            },
            tooltip: {
              callbacks: {
                footer: (tooltipItems: any) => {
                  this.hoveredLabel = tooltipItems[0].label;
                  return String(tooltipItems) }
              }
            }
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  }


  newLegendClickHandler = (e: ChartEvent, legendItem: LegendItem, legend: LegendElement<any>) => {
    const index = legendItem.datasetIndex;
    //@ts-ignore
    const type = legend.chart.config.type;
    let ci = legend.chart;

    this.legendClick.emit(legendItem.text);

    //this.legendClickActionGivenLegendText(legendItem.text);


  };

}
