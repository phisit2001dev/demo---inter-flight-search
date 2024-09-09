import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { TranslateLoader } from '@ngx-translate/core';
import { SessionStorageService } from '../core/services/session-storage.service';
import { inject } from '@angular/core';
import { Profile } from '../core/models/profile';

export interface IOwTranslateLoader {
  prefix: string;
  suffix: string;
}
export class OwnTranslateLoader implements TranslateLoader {
  sessionStorageService: SessionStorageService;
  constructor(
    private http: HttpClient,
    private resource: IOwTranslateLoader[]
  ) {
    // Inject service
    this.sessionStorageService = inject(SessionStorageService);

    this.resource.push({ prefix: 'assets/bundle/common/', suffix: '.json' });

  }
  public getTranslation(lang: string): Observable<any> {
    const rq = this.resource.map((reso) => {
      // console.log(reso.prefix + lang + reso.suffix);
      return this.http.get(reso.prefix + lang + reso.suffix);
    });

    // Get msg alert from storage
    const msg = this.getBundleMsgAlert();
    
    if(msg){
      rq.push(msg);
    }

    // console.log('rq', rq);
    return forkJoin(rq).pipe(
      map((response) =>
        response.reduce((a, b) => {
          // console.log(a, b);
          return Object.assign(a, b);
        })
      )
    );
  }
  //    return forkJoin(rq).pipe(map(response => {

  //    }));
  // }

   /**
   * Get Msg alert form storage
   * @param msg 
   * @returns
   */
   private getBundleMsgAlert(){
    const json = this.sessionStorageService.getProfile();
      if (json) {
        const profile: Profile = JSON.parse(json);
        if(profile?.msgAlert){
          return of(profile.msgAlert);
        }else{
          return null;
        }
    }
  }
}
