import { FormControl } from '@angular/forms';
import { Directive, Input, ElementRef, Renderer2, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Directive({
  selector: '[AutocompleteHighlight]'
})
export class AutocompleteHighlightDirective implements OnChanges , OnInit {

  @Input() list: [];
  @Input() termInput:any;
  @Input() textOption: string;
  @Input() highlight?: true;
  colorhighlight = '#56e85b73';

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(){
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.termInput && this.textOption) {
        this.renderer.setProperty(
          this.el.nativeElement,
          'innerHTML',
          this.setText(this.termInput)
        );
    }else{
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.textOption);
    }
  }
  setText(terms) {
    // console.log(this.escapeRegExp(terms));
    const re = new RegExp(this.escapeRegExp(terms), 'gi');
    const match = this.textOption.match(re);
    if (!match) {
        return this.textOption;
    }
    // tslint:disable-next-line: no-shadowed-variable
    return  this.textOption.replace(re, match => `<b style="background-color: ${this.colorhighlight};">${match}</b>`);
  }
  escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,  '\\$&');
  }
}
