import {AfterViewInit, Component, OnDestroy, OnInit, HostListener} from '@angular/core';
import {BehaviorSubject, Observable, of, Subscription} from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import {Olympic} from "../../core/models/dtos/Olympic";
import {MyPieChartData} from "../../core/models/rendering/MyPieChartData";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  public olympics$: Observable<Olympic[]> = of([]);
  public olympics: Olympic[] = [];
  public numberOfJOs = 0;
  public pieDatas$= new BehaviorSubject<MyPieChartData[]>([]);
  private pieDatas: MyPieChartData[] = [];
  public pieDataLoaded = false;

  public graphBuilt = false;
  getScreenWidth = 1200;
  getScreenHeight = 0;

  private subscriptions: Subscription[] = [];

  constructor(
    private olympicService: OlympicService,
    public router: Router,
  ) {
    this.onWindowResize();
  }


  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    console.log('this.getScreenWidth : ', this.getScreenWidth)
    console.log('this.getScreenHeight : ', this.getScreenHeight)
  }

  ngOnInit(): void {
    this.pieDataLoaded = false;
    console.log("INITTT")
    this.olympics$ = this.olympicService.getOlympics();
    this.subscriptions.push(this.olympics$.subscribe(val => {
      this.olympics = val;
      this.pieDatas = val.map(v => {return { name: v.country, value: v.participations.map(part => part.medalsCount).reduce((a, b) => a + b, 0)}});
      this.pieDatas$.next(  this.pieDatas);
      this.numberOfJOs = val.flatMap(elem => elem.participations.map(part => part.year)).filter(
        (value, index, array) => {
          return array.indexOf(value) === index;
        }).length;

      this.pieDataLoaded = true;
      // this.viewInit();
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => (sub).unsubscribe());
  }

  ActionOnLegendClick(countryName: string): void {
    this.router.navigate([`country/${countryName}`]);
  }

  ngAfterViewInit(): void {

  }

  viewInit(): void {
    console.log("=======================")
    console.log("GRAPH LOADED")
    console.log("=======================")

    const legendContainer = document.getElementById('medalsPieChart');
    if(legendContainer && this.getScreenWidth>580) {
      console.log("LEGEND CONTAINER : ", legendContainer)
      const rayon = legendContainer.offsetHeight/2;
       const widthOffset = (legendContainer.offsetWidth - legendContainer.offsetHeight)/2;
      const totalMedals = this.pieDatas.map(elem => elem.value).reduce((a, b) => a + b, 0);
      let start = 0;
      let end = 0;


      this.pieDatas.forEach( value => {
        end += value.value;

        console.log('Start : ', start, 'End : ', end);

        const heightOffsetStart = rayon * Math.cos(start/totalMedals * Math.PI*2) * -1;
        const heightOffsetEnd = rayon * Math.cos(end/totalMedals * Math.PI*2) * -1;
        const height = rayon + (heightOffsetStart + heightOffsetEnd)/2;

        const sinStart = Math.sin(start/totalMedals * Math.PI*2);
        const sinEnd = Math.sin(end/totalMedals * Math.PI*2);
        const leftOffset = rayon +  2*rayon * (sinStart + sinEnd)/Math.abs((sinStart + sinEnd)) ;
        const rightOffset = rayon -  2*rayon * (sinStart + sinEnd)/Math.abs((sinStart + sinEnd)) ;

        let listContainer = document.createElement('div');
        listContainer.textContent = value.name;
        listContainer.style.display = 'block';
        listContainer.style.margin = String(rayon);
        listContainer.style.padding = String(0);
        listContainer.style.zIndex = String(999);
        listContainer.style.position = 'absolute';
        listContainer.style.padding = '4px 8px';
        listContainer.style.backgroundColor = 'white';
        listContainer.onclick = () => {
          console.log(this.ActionOnLegendClick( value.name))};

        listContainer.style.cursor = 'pointer';

        let arrowContainer = document.createElement('div');
        arrowContainer.textContent = "";
        arrowContainer.style.backgroundColor = 'black';
        arrowContainer.style.height = '2px';
        arrowContainer.style.position = 'absolute';
        arrowContainer.style.width = String(2*rayon + 2 - Math.abs( Math.sin ( Math.acos((heightOffsetStart + heightOffsetEnd)/2/rayon)  ) ) * rayon) + 'px';
        arrowContainer.style.top = String( height) + 'px';



        if(leftOffset < 0) {
          listContainer.style.left = String(widthOffset + leftOffset) + 'px';
          arrowContainer.style.left = String(widthOffset - rayon) + 'px';
        } else {
          listContainer.style.right = String(widthOffset + rightOffset) + 'px';
          arrowContainer.style.right = String(widthOffset - rayon) + 'px';
        }
        listContainer.style.top = String( height - 12) + 'px';

        start = end;
        legendContainer.appendChild(arrowContainer);
        legendContainer.appendChild(listContainer);
      });
    }
  }


}
