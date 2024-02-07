import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PieData} from "../../core/models/rendering/PieData";
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
  @Input() pieDatas$: Observable<PieData[]> = of([]);

  pieDatas!: PieData[];
  @Input() chartId!: string

  @Input() legendClickActionGivenLegendText!: Function;
  @Output() legendClick = new EventEmitter<string>();

  @Output() loadedGraph = new EventEmitter<string>();
  fullChartId: string = 'pieChart'

  constructor(
  ) {
  }

  ngOnInit(): void {

    this.subscriptions.push(this.pieDatas$.subscribe( value => {
      this.pieDatas = value;
      if (this.chartId){
        this.fullChartId += this.chartId;
      }
      this.displayGraph()
      this.loadedGraph.emit('loaded');
      console.log('nexted : ', value)
    }));
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => (sub).unsubscribe());
    this.myChart?.destroy();
  }


  /**
   * Display the graphic with our object we just received.
   */
  displayGraph(): void {
    if (this.pieDatas.length == 0) {
      return;
    }
    this.myChart?.destroy();
    const canvas = document.getElementById('fullChartId') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (ctx != null) {
      if (this.myChart != null){
        this.myChart.destroy();
      }
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
            console.log('CHART EVENT')
            console.log(e);
          },
          animation: false,
          plugins: {
            legend: {
              onClick: this.newLegendClickHandler,
              display: false,
              position: 'bottom',

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
    console.log('LEGEND EVENT : ', e)
    console.log('LegendItem : ', legendItem)
    console.log('LegendElement : ', legend)

    this.legendClick.emit(legendItem.text);

    //this.legendClickActionGivenLegendText(legendItem.text);


  };




}
