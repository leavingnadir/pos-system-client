import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {LoadingStatusService} from '../services/loading-status.service';
import {inject} from '@angular/core';
import {catchError, finalize, throwError} from 'rxjs';
import {CookieManagerService} from '../services/cookie-manager.service';

export const httpManagerInterceptor: HttpInterceptorFn = (req, next) => {

  let statusService:LoadingStatusService = inject(LoadingStatusService);
  const cookieManager = inject(CookieManagerService);
  const token = cookieManager.getToken('token');

  // show global loading indicator for every outgoing request
  statusService.status.next(true);

  // attach token if present
  const requestToSend = token ? req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  }) : req;

  return next(requestToSend).pipe(
    catchError((error:HttpErrorResponse)=>{
      // rethrow the error after any custom handling
      return throwError(()=>error)
    }),
    finalize(()=>{
      // hide loading indicator when request completes (success or error)
      statusService.status.next(false);
    })
  )
};
