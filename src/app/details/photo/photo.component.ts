import { Component, OnChanges, Input } from '@angular/core';
@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css']
})
export class PhotoComponent implements OnChanges {

  @Input() photos: any;

  private displayWidth: number;

  private col1 = [];
  private col2 = [];
  private col3 = [];

  constructor() {}

  ngOnChanges() {
    if(!this.photos) {
      return;
    }
    this.displayWidth = window.screen.width;
    if(this.displayWidth > 600) {
      this.displayWidth = Math.round(this.displayWidth/3);
    }

    for (let i = 0; i < this.photos.length; i++) {
      if(i%3==0){
        this.col1.push(this.photos[i]);
      }
      if(i%3==1){
        this.col2.push(this.photos[i]);
      }
      if(i%3==2){
        this.col3.push(this.photos[i]);
      }
    }
  }

}
