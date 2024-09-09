import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';
import { interval } from 'rxjs';
@Component({
  selector: 'sit-btn-scroll-top',
  templateUrl: './sit-btn-scroll-top.component.html',
  styleUrls: ['./sit-btn-scroll-top.component.scss'],
})
export class SitBtnScrollTopComponent implements OnInit,AfterViewInit {
  windowScroll = true;
  requestId;
  isScrolling;
  constructor(private ngZone: NgZone , private scrollDispatcher: ScrollDispatcher) {}
  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
        window.addEventListener('scroll', (ele: any) => {
          if (window.scrollY > 0) {
            document.getElementById('sit-top').classList.add('sit-show-scrolltop');
          } else if (window.scrollY === 0) {
            document.getElementById('sit-top').classList.remove('sit-show-scrolltop');
          }
      });
    });

  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      document.getElementById('btntotop').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }
  // scrollToTop() {

  //   console.log('ggez');
  //   window.scrollTo({ top: 0, behavior: 'smooth' });
  // }
  // animationScroll() {
  //   const performAnimation = () => {
  //     const currentScroll =
  //     document.documentElement.scrollTop || document.body.scrollTop;
  //     if (currentScroll > 0) {
  //       this.requestId = requestAnimationFrame(performAnimation);
  //       console.log(this.requestId);
  //       // animate
  //       window.scrollTo(0, currentScroll - currentScroll / 8);
  //     }
  //   };
  //   requestAnimationFrame(performAnimation);
  // }
}
