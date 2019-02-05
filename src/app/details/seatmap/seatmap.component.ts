import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-seat',
  templateUrl: './seatmap.component.html'
})
export class SeatmapComponent {
  @Input() url;
  constructor(public activeModal: NgbActiveModal) {}
}
