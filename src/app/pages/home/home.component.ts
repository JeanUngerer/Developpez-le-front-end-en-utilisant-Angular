import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, of, Subscription} from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import {Olympic} from "../../core/models/dtos/Olympic";
import {PieData} from "../../core/models/rendering/PieData";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  public olympics$: Observable<Olympic[]> = of([]);
  public olympics: Olympic[] = [];
  public pieDatas$= new BehaviorSubject<PieData[]>([]);
  private pieDatas: PieData[] = [];
  public pieDataLoaded = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private olympicService: OlympicService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.subscriptions.push(this.olympics$.subscribe(val => {
      this.olympics = val;
      this.pieDatas = val.map(v => {return { name: v.country, value: v.participations.map(part => part.medalsCount).reduce((a, b) => a + b, 0)}});
      this.pieDatas$.next(  this.pieDatas);
      console.log(this.pieDatas$.value);
      this.pieDataLoaded = true;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => (sub).unsubscribe());
  }

  ActionOnLegendClick(countryName: string): void {
    console.log(countryName);
    this.router.navigate([`country/${countryName}`]);
  }

  ngAfterViewInit(): void {
    const legendContainer = document.getElementById('medalsPieChart');
    console.log(legendContainer);
    if(legendContainer) {
      const rayon = legendContainer.offsetHeight;
      console.log('Rayon : ', rayon)
      console.log('Values : ', this.pieDatas)
      const totalMedals = this.pieDatas.map(elem => elem.value).reduce((a, b) => a + b, 0);
      console.log('Total Medals : ', totalMedals);
      let start = 0;
      let end = 0;


      this.pieDatas.forEach( value => {
        end += value.value;

        console.log('Start : ', start, 'End : ', end);

        const heightOffsetStart = 150 * Math.cos(start/totalMedals * Math.PI*2) * -1;
        const heightOffsetEnd = 150 * Math.cos(end/totalMedals * Math.PI*2) * -1;
        const height = 150 + (heightOffsetStart + heightOffsetEnd)/2;

        const sinStart = Math.sin(start/totalMedals * Math.PI*2);
        const sinEnd = Math.sin(end/totalMedals * Math.PI*2);
        const leftOffset = 150 +  300 * (sinStart + sinEnd)/Math.abs((sinStart + sinEnd)) ;
        const rightOffset = 150 -  300 * (sinStart + sinEnd)/Math.abs((sinStart + sinEnd)) ;

        let listContainer = document.createElement('div');
        listContainer.textContent = value.name;
        listContainer.style.display = 'block';
        listContainer.style.margin = String(rayon);
        listContainer.style.padding = String(0);
        listContainer.style.zIndex = String(999);
        listContainer.style.position = 'absolute';
        listContainer.style.padding = '4px 8px';
        listContainer.style.backgroundColor = 'white';
        listContainer.click = () => {
          console.log('plop')};


        let arrowContainer = document.createElement('div');
        arrowContainer.textContent = "";
        arrowContainer.style.backgroundColor = 'black';
        arrowContainer.style.height = '2px';
        arrowContainer.style.position = 'absolute';
        arrowContainer.style.width = String(302 - Math.abs( Math.sin ( Math.acos((heightOffsetStart + heightOffsetEnd)/2/150)  ) ) * 150) + 'px';
        arrowContainer.style.top = String( height) + 'px';



        if(leftOffset < 0) {
          listContainer.style.left = String(leftOffset) + 'px';
          arrowContainer.style.left = String(-150) + 'px';
        } else {
          listContainer.style.right = String(rightOffset) + 'px';
          arrowContainer.style.right = String(-150) + 'px';
        }
        listContainer.style.top = String( height - 12) + 'px';

        start = end;
        legendContainer.appendChild(arrowContainer);
        legendContainer.appendChild(listContainer);
      });
    }
  }


}
