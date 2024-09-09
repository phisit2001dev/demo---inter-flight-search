import { Injectable } from '@angular/core';
import { environment } from '@evn/environment';
import { SessionStorageService } from './session-storage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthLoginUtilService {

    constructor(private sessionStorageService: SessionStorageService){}

    base64URLEncode(str) {
        return str.toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }

    crateCodeVerify(){
      const verifier = crypto.randomUUID();
      this.sessionStorageService.setCvy(verifier);
      return verifier;
    }

    // #AUTH 2 add func
    async hashFromString(string) {
      const hash = await crypto.subtle.digest("SHA-256", (new TextEncoder()).encode(string))
      return btoa(String.fromCharCode(...new Uint8Array(hash)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    }

    // #AUTH 3 chg code Challenge
    async createCodeChallenge(verifier){
      const challenge = await this.hashFromString(verifier);
      return challenge;
   }

    createState(){
      const stateToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      this.sessionStorageService.setState(stateToken);
    }

    encode(message: string) {
        return window.crypto.subtle.digest('SHA-256', this.strToUint(message));
    }

    strToUint(str: string) {
        var buf = new ArrayBuffer(str.length);
        var bufView = new Uint8Array(buf);
        for (var i=0, strLen=str.length; i < strLen; i++) {
           bufView[i] = str.charCodeAt(i);
        }
        return bufView;
    }

    toHexString(value: ArrayBuffer):string{
        const hashArray = Array.from(new Uint8Array(value));                     // convert buffer to byte array
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
        return hashHex;
    }

  initLogin(){
      let verifier = this.crateCodeVerify();
      this.createState();
      this.createCodeChallenge(verifier).then( codeChallenge => this.checkForRedirect(codeChallenge));
  }

  checkForRedirect(codeChallenge: string){
    // window.location.href = environment.serverUrl+'internal_authenticate?response_type=code&client_id='+environment.clientId+'&redirect_url='+encodeURIComponent(environment.redirectUri)+'&code_challenge='+codeChallenge+'&state='+this.sessionStorageService.getState();
    this.login(codeChallenge);
  }


    // checkForRedirect(codeChallenge: string){
    //     window.location.href = environment.serverUrl+'internal_authenticate?response_type=code&client_id='+environment.clientId+'&redirect_url='+encodeURIComponent(environment.redirectUri)+'&code_challenge='+codeChallenge+'&state='+this.sessionStorageService.getState();
    // }
    // login(codeChallenge: string) {
    //   window.location.href =
    //   'https://csc.png-iapi.net/csc-auth-dev-temp/oauth2/authorize?'
    //   + 'response_type=code'
    //   + '&client_id=client-test-2'// + environment.clientId
    //   + '&state=' + this.sessionStorageService.getState()
    //   + '&scope=ALL'
    //   + '&redirect_uri=' + encodeURIComponent(environment.redirectUri)
    //   + '&code_challenge=' + this.sessionStorageService.getCvy()
    //   + '&code_challenge_method=S256'
    // }

    login(codeChallenge: string) {
      window.location.href =
      environment.authen.authorizeUrl +'?'
      + 'response_type=code'
      + '&client_id=' + environment.authen.clientId
      + '&state=' + this.sessionStorageService.getState()
      + '&scope=ALL'
      + '&redirect_uri=' + encodeURIComponent(environment.authen.redirectUri)
      + '&code_challenge=' + codeChallenge
      + '&code_challenge_method=S256'
    }
}
