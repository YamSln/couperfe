import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { concatMap, finalize, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  
  constructor() { }

  displayLoadingUntil<T>(observable$: Observable<T>): Observable<T>
  {
    let loadingFinished = false;
    // Return an observable 
    return of(null)
      .pipe(
        tap(() => {
          setTimeout(() => {
            if(!loadingFinished)
            { // Wait before actually displaying loading indication
              this.displayLoading();
            }
          }, 500)
        }), // Handle each subscription at a time
        concatMap(() => observable$),
        finalize(() => {
          // Hide loading again after subscription returned
          loadingFinished = true;
          this.hideLoading()
          })
      );
  }

  displayLoading()
  {
    this.loadingSubject.next(true);
  }

  hideLoading()
  {
    this.loadingSubject.next(false);
  }

}
