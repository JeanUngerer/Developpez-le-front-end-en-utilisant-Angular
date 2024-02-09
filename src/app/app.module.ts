import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { CountryDetailsComponent } from './pages/country-details/country-details.component';
import { BannerComponent } from './components/banner/banner.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import {HandleErrorsInterceptor} from "./core/interceptors/handleErrorsInterceptor";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastrModule} from "ngx-toastr";

@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent, PieChartComponent, CountryDetailsComponent, BannerComponent, LineChartComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: "toast-bottom-right",
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HandleErrorsInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
