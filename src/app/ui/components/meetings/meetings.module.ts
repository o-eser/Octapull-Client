import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetingsComponent } from './meetings.component';
import { RouterModule } from '@angular/router';
import { DayPilot, DayPilotModule } from '@daypilot/daypilot-lite-angular';



@NgModule({
  declarations: [
    MeetingsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: "", component: MeetingsComponent }
    ]),
    DayPilotModule
  ]
})
export class MeetingsModule { }
