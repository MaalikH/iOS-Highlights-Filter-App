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
  selector: '[appCardHighlightColor]',
})
export class CardHighlightColorDirective {
  @Input() appCardHighlightColor = 0;

  constructor(private elRef: ElementRef) {}

  setHighlightColor() {
    let colorCode = this.appCardHighlightColor.toString();
    if (this.appCardHighlightColor !== null) {
      this.elRef.nativeElement.style.border = `3px solid var(--colorCode${colorCode}dark)`;
      this.elRef.nativeElement.style.backgroundColor = `var(--colorCode${colorCode}bg)`;
    }
  }

  ngAfterViewInit(): void {
    this.setHighlightColor();
  }

  ngOnChanges() {
    this.setHighlightColor();
  }
}
