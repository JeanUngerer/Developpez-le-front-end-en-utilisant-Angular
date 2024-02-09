import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {OlympicService} from "../../core/services/olympic.service";
import {Olympic} from "../../core/models/dtos/Olympic";
import {MyLineChartData} from "../../core/models/rendering/MyLineChartData";
import {BehaviorSubject} from "rxjs";
import {MyPieChartData} from "../../core/models/rendering/MyPieChartData";

@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.component.html',
  styleUrls: ['./country-details.component.scss']
})
export class CountryDetailsComponent implements OnInit {

  countryName: string ='';
  olympic: Olympic | undefined;
  totalMedals = 0;
  totalAthletes = 0;

  public lineChartDatas$= new BehaviorSubject<MyLineChartData[]>([]);
  lineChartDatas: MyLineChartData[] = [];
  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService,
  ) { }

  ngOnInit(): void {
    const countryName = this.route.snapshot.params['country'];
    this.countryName = countryName;
    this.olympicService.getOlympics().subscribe(val => {
      this.olympic = val.find(elem => elem.country === this.countryName);
      console.log('Olympic : ', this.olympic);
      if (this.olympic) {
        this.lineChartDatas = this.olympic.participations.map(part => {
          return {name: part.city, xValue: part.year, yValue: part.medalsCount};
        })
        this.lineChartDatas$.next(this.lineChartDatas)
        this.totalMedals = this.olympic.participations.map(elem => elem.medalsCount).reduce((a, b) => a + b, 0);
        this.totalAthletes = this.olympic.participations.map(elem => elem.athleteCount).reduce((a, b) => a + b, 0);
      }
    });


  }

}
