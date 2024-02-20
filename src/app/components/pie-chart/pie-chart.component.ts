import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MyPieChartData} from "../../core/models/rendering/MyPieChartData";
import {Chart, ChartEvent, LegendElement, LegendItem} from "chart.js/auto";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {Observable, of, Subscription} from "rxjs";

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit, OnDestroy, AfterViewInit {

  public myChart?: Chart;

  private subscriptions: Subscription[] = [];
  @Input() pieDatas$: Observable<MyPieChartData[]> = of([]);

  pieDatas!: MyPieChartData[];
  @Input() chartId!: string
  @Input() customLegend = false;

  @Input() legendClickActionGivenLegendText!: Function;
  @Output() legendClick = new EventEmitter<string>();
  @Output() graphClick = new EventEmitter<string>();
  @Output() loadedGraph = new EventEmitter<string>();
  fullChartId: string = 'pieChart';
  hoveredLabel = '';

  constructor(
  ) {

  }

  ngOnInit(): void {
    console.log("INNIIIIIT PIEE")
    //this.ngAfterViewInit();
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(this.pieDatas$.subscribe( value => {
      this.pieDatas = value;
      if (this.chartId){
        this.fullChartId += this.chartId;
      }
      this.displayGraph()

      console.log('nexted piedatas: ', value)
      }));
  }

  ngOnDestroy(): void {
    console.log("DESTROY PIEE")
    this.subscriptions.forEach(sub => (sub).unsubscribe());
    this.myChart?.destroy();
  }


  /**
   * Display the graphic with our object we just received.
   */
  displayGraph(): void {
    console.log("GRAPH PIEE, datas : ", this.pieDatas)
    if (this.pieDatas.length == 0) {
      return;
    }
    //this.myChart?.destroy();
    let canvas = document.getElementById('fullPieChartId') as HTMLCanvasElement;
    let ctx = canvas.getContext('2d');

    console.log("CANVAS : ", canvas)
    console.log("CTX : ", ctx)
    if (this.myChart != null){
      this.myChart.destroy();
      canvas = document.getElementById('fullPieChartId') as HTMLCanvasElement;
      ctx = canvas.getContext('2d');
      console.log("CANVAS IN : ", canvas)
      console.log("CTX IN : ", ctx)
    }

    if (ctx != null) {

      this.myChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.pieDatas.map(data => {return data.name}),
          datasets: [{
            data: this.pieDatas.map(data => {return data.value}),
          }]
        },
        plugins: [ChartDataLabels],
        options: {
          onClick: (e: ChartEvent) => {
            this.graphClick.emit(this.hoveredLabel);
          },
          animation: false,
          plugins: {
            legend: {
              onClick: this.newLegendClickHandler,
              display: !this.customLegend,
              position: 'bottom',
            },
            tooltip: {
              callbacks: {
                footer: (tooltipItems: any) => {
                  this.hoveredLabel = tooltipItems[0].label;
                  return "" }
              }
            }
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
    this.loadedGraph.emit('loaded');
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
