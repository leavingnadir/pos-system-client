import {Injectable, OnDestroy, NgZone} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingStatusService implements OnDestroy {
  public status = new BehaviorSubject<boolean>(false);

  constructor(private ngZone: NgZone) {}

  setLoading(isLoading: boolean) {
    this.ngZone.run(() => {
      setTimeout(() => {
        this.status.next(isLoading);
      });
    });
  }

  ngOnDestroy() {
    this.status.complete();
  }
}
