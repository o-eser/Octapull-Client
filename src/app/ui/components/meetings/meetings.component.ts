import { Component, ViewChild } from '@angular/core';
import { DayPilot, DayPilotCalendarComponent, DayPilotMonthComponent, DayPilotNavigatorComponent } from '@daypilot/daypilot-lite-angular';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { CreateMeeting } from 'src/app/contracts/create-meeting';
import { MeetingService } from 'src/app/services/common/models/meeting.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';

@Component({
  selector: 'app-meetings',
  templateUrl: `./meetings.component.html`,
  styleUrls: ['./meetings.component.scss']
})
export class MeetingsComponent extends BaseComponent {


  constructor(spinner: NgxSpinnerService, private meetingService: MeetingService, private toastrService: CustomToastrService) {
    super(spinner)
    this.viewWeek();
  }

  @ViewChild("day") day!: DayPilotCalendarComponent;
  @ViewChild("week") week!: DayPilotCalendarComponent;
  @ViewChild("month") month!: DayPilotMonthComponent;
  @ViewChild("navigator") nav!: DayPilotNavigatorComponent;


  events: DayPilot.EventData[] = [];

  date = DayPilot.Date.today();

  contextMenu = new DayPilot.Menu({
    items: [
      {
        text: "Sil",
        onClick: args => {
          const event = args.source;
          const dp = event.calendar;
          dp.events.remove(event);
        }
      },
      {
        text: "Düzenle...",
        onClick: async args => {
          const event = args.source;
          const dp = event.calendar;

          const modal = await DayPilot.Modal.prompt("Açıklamayı giriniz:", event.data.text);
          dp.clearSelection();
          if (!modal.result) { return; }
          event.data.text = modal.result;
          dp.events.update(event);
        }
      },
      // {
      //   text: "-"
      // },
      // {
      //   text: "Red",
      //   onClick: args => {
      //     const event = args.source;
      //     const dp = event.calendar;
      //     // event.data.backColor = DataService.colors.red;
      //     dp.events.update(event);
      //   }
      // },
      // {
      //   text: "Green",
      //   onClick: args => {
      //     const event = args.source;
      //     const dp = event.calendar;
      //     // event.data.backColor = DataService.colors.green;

      //     dp.events.update(event);
      //   }
      // },
      // {
      //   text: "Blue",
      //   onClick: args => {
      //     const event = args.source;
      //     const dp = event.calendar;
      //     // event.data.backColor = DataService.colors.blue;

      //     dp.events.update(event);
      //   }
      // },
      // {
      //   text: "Yellow",
      //   onClick: args => {
      //     const event = args.source;
      //     const dp = event.calendar;
      //     // event.data.backColor = DataService.colors.yellow;

      //     dp.events.update(event);
      //   }
      // },

      // {
      //   text: "Gray",
      //   onClick: args => {
      //     const event = args.source;
      //     const dp = event.calendar;
      //     // event.data.backColor = DataService.colors.gray;

      //     dp.events.update(event);
      //   }
      // }
    ]
  });

  configNavigator: DayPilot.NavigatorConfig = {
    showMonths: 3,
    cellWidth: 25,
    cellHeight: 25,
    onVisibleRangeChanged: args => {
      this.loadEvents();
    }
  };

  selectTomorrow() {
    this.date = DayPilot.Date.today().addDays(1);
  }

  changeDate(date: DayPilot.Date): void {
    this.configDay.startDate = date;
    this.configWeek.startDate = date;
    this.configMonth.startDate = date;
  }

  configDay: DayPilot.CalendarConfig = {
    durationBarVisible: false,
    contextMenu: this.contextMenu,
    onTimeRangeSelected: this.onTimeRangeSelected.bind(this),
    onBeforeEventRender: this.onBeforeEventRender.bind(this),
    onEventClick: this.onEventClick.bind(this),
  };

  configWeek: DayPilot.CalendarConfig = {
    viewType: "Week",
    durationBarVisible: false,
    contextMenu: this.contextMenu,
    onTimeRangeSelected: this.onTimeRangeSelected.bind(this),
    onBeforeEventRender: this.onBeforeEventRender.bind(this),
    onEventClick: this.onEventClick.bind(this),
  };

  configMonth: DayPilot.MonthConfig = {
    contextMenu: this.contextMenu,
    eventBarVisible: false,
    onTimeRangeSelected: this.onTimeRangeSelected.bind(this),
    onEventClick: this.onEventClick.bind(this),
  };



  ngAfterViewInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    const from = this.nav.control.visibleStart();
    const to = this.nav.control.visibleEnd();
    // this.ds.getEvents(from, to).subscribe(result => {
    //   this.events = result;
    // });
  }

  viewDay(): void {
    this.configNavigator.selectMode = "Day";
    this.configDay.visible = true;
    this.configWeek.visible = false;
    this.configMonth.visible = false;
  }

  viewWeek(): void {
    this.configNavigator.selectMode = "Week";
    this.configDay.visible = false;
    this.configWeek.visible = true;
    this.configMonth.visible = false;
  }

  viewMonth(): void {
    this.configNavigator.selectMode = "Month";
    this.configDay.visible = false;
    this.configWeek.visible = false;
    this.configMonth.visible = true;
  }

  onBeforeEventRender(args: any) {
    const dp = args.control;
    args.data.areas = [
      {
        top: 3,
        right: 3,
        width: 20,
        height: 20,
        symbol: "assets/icons/daypilot.svg#minichevron-down-2",
        fontColor: "#fff",
        toolTip: "Show context menu",
        action: "ContextMenu",
      },
      {
        top: 3,
        right: 25,
        width: 20,
        height: 20,
        symbol: "assets/icons/daypilot.svg#x-circle",
        fontColor: "#fff",
        action: "None",
        toolTip: "Delete event",
        onClick: async (args: any) => {
          dp.events.remove(args.source);
        }
      }
    ];

    args.data.areas.push({
      bottom: 5,
      left: 5,
      width: 36,
      height: 36,
      action: "None",
      image: `https://picsum.photos/36/36?random=${args.data.id}`,
      style: "border-radius: 50%; border: 2px solid #fff; overflow: hidden;",
    });
  }

  async onTimeRangeSelected(args: any) {
    const form = [
      { name: "Toplantı Adı", id: "text" },
      { name: "Açıklama", id: "description" },
      // Diğer form öğeleri...
    ];

    const modal = await DayPilot.Modal.form(form);
    console.log(modal.result.description);
    if (modal.canceled) {
      return;
    }

    const dp = args.control;



    this.showSpinner(SpinnerType.BallAtom);

    this.meetingService.create({
      description: modal.result.description,
      meetingName: modal.result.meetingName,
      startTime: args.start,
      endTime: args.end,
      organizerId: ''
    },
      () => {
        this.hideSpinner(SpinnerType.BallAtom);
        dp.events.add({
          start: args.start,
          end: args.end,
          id: DayPilot.guid(),
          text: modal.result.meetingName,
          data: {
            description: modal.result.description
          }
        });
        this.toastrService.message("Kayıt başarılı bir şekilde tamamlandı.", "Kayıt Mesajı", {
          position: ToastrPosition.TopRight,
          messageType: ToastrMessageType.Success
        });
      }, errorMessage => {
        this.hideSpinner(SpinnerType.BallAtom);
        this.toastrService.message(errorMessage, "Kayıt Hatası", {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight
        })
      }
    );
  }

  async onEventClick(args: any) {
    const form = [
      { name: "Toplantı Adı", id: "text" },
      { name: "Başlangıç", id: "start", dateFormat: "MM/dd/yyyy", type: "datetime" },
      { name: "Bitiş", id: "end", dateFormat: "MM/dd/yyyy", type: "datetime" },
      { name: "Açıklama", id: "description" },
      // Diğer form öğeleri...
    ];

    const data = args.e.data;

    const modal = await DayPilot.Modal.form(form, data);
    if (modal.canceled) {
      return;
    }

    const dp = args.control;

    dp.events.update({
      start: modal.result.start,
      end: modal.result.end,
      id: args.e.id(),
      text: modal.result.text,
      data: {
        description: modal.result.data.description
      }
    });
  }
}
