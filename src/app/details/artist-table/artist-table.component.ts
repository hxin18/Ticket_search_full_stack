import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-artist-table',
  templateUrl: './artist-table.component.html',
  styleUrls: ['./artist-table.component.css']
})
export class ArtistTableComponent implements OnInit {
  @Input()
  public artist:any;

  constructor() { }

  ngOnInit() {
  }

}
