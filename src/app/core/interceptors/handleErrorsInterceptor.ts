import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {HandleErrorService} from "../services/handle-error.service";


@Injectable()
export class HandleErrorsInterceptor implements HttpInterceptor {

  constructor(
    private handleErrorService: HandleErrorService
  ) {
  }
  // intercept function
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return new Observable((observer) => {
      // subscribing to requests
      next.handle(req).subscribe(
        // success
        (res) => {
          if (res instanceof  HttpResponse) {
            // continuing the http cycle
            observer.next(res);
          }
        },
        (err) => {
          // handling Errors
          this.handleErrorService.handleError(err);
          console.log(err);
        }
      )
    });
  }




}
