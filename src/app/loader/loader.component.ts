import { Component, OnInit } from '@angular/core';
import {SearchService} from '../services/search.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  show = false;
  constructor(public loadService:  SearchService) {
    this.loadService = loadService;
  }


  ngOnInit() {
    this.loadService.fire.subscribe(value =>{
      this.show = value;
    })
    this.loadService.counter.subscribe(value =>{
      let sum = 0;
      for (let i = 0; i < value.length; i++) {
        sum += value[i]
      }
      this.show = sum < 4;
      console.log(this.show)
    })
  }

}
