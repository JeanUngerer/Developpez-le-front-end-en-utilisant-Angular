import { Injectable } from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";


@Injectable({
  providedIn: 'root'
})
export class HandleErrorService {

  constructor(
    private toaster: ToastrService,
  ) { }

  public handleError(err: HttpErrorResponse) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response.
      errorMessage = `Something went wrong`;
    }
    this.toaster.error(errorMessage);
    console.error(errorMessage);
  }
}
