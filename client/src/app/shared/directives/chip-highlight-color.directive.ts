import {
  Directive,
  ElementRef,
  Host,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  OnChanges,
} from '@angular/core';

@Directive({
  selector: '[appChipHighlightColor]',
})
export class ChipHighlightColorDirective {
  @Input() filterName: any;
  @Input() filterType: string;
  @Input() selectedHighlight: boolean;

  constructor(private elRef: ElementRef, private renderer: Renderer2) {
    this.filterName = 0;
    this.filterType = '';
    this.selectedHighlight = true;
  }

  ngOnInit() {
    // this.changeHighlightColor()
  }

  @HostListener('click', ['$event.target']) onClick(btn: any) {
    //this.setHighlightColor();
  }

  setHighlightColor() {
    if (this.filterType === 'colorCode' && this.selectedHighlight) {
      //this.renderer.removeClass(this.elRef.nativeElement, `color-code-${this.filterName}-unselected`);
      //this.renderer.addClass(this.elRef.nativeElement, `color-code-${this.filterName}-selected`);
      //sets styles inline, won't override original theme styles
      this.elRef.nativeElement.style.border = `3px solid var(--colorCode${this.filterName}dark)`;
      this.elRef.nativeElement.style.backgroundColor = `var(--colorCode${this.filterName}light)`;
    } else if (this.filterType === 'colorCode' && !this.selectedHighlight) {
      //this.renderer.removeClass(this.elRef.nativeElement, `color-code-${this.filterName}-selected`);
      //this.renderer.addClass(this.elRef.nativeElement, `color-code-${this.filterName}-unselected`);
      //sets styles inline, won't override original theme styles
      this.elRef.nativeElement.style.border = `3px solid var(--colorCode${this.filterName}dark)`;
      this.elRef.nativeElement.style.backgroundColor = `var(--cardBackground)`;
    }
  }

  ngAfterViewInit(): void {
    this.setHighlightColor();
  }

  ngOnChanges() {
    this.setHighlightColor();
  }
}
