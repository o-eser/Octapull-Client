import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';


export class BaseComponent {
  constructor(private spinner: NgxSpinnerService) {
  }
  showSpinner(spinnerNemaType: SpinnerType) {
    this.spinner.show(spinnerNemaType);

    /*setTimeout(() => this.hideSpinner(spinnerNemaType), 5000);*/
  }

  hideSpinner(spinnerNemaType: SpinnerType) {
    this.spinner.hide(spinnerNemaType);

  }
}

export enum SpinnerType {
  BallAtom = "s1",
  BallScaleMultiple = "s2",
  BallSpinClockwiseFadeRotating = "s3"
}

