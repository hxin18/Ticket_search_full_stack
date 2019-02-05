import { Component, OnInit } from '@angular/core';
import {SearchService} from '../services/search.service';
import { trigger, style, transition, animate, state } from '@angular/animations';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
    animations: [

      trigger('detailsAnimation', [
        transition('left => right', [
          style({transform: 'translateX(100%)'}),
          animate(250)
        ]),
        transition('right => left', [
          style({transform: 'translateX(-100%)'}),
          animate(250)
        ])
      ]),
    ]
}
)
export class ResultComponent implements OnInit {

  initial = true;
  loader = false;
  isShowResult = true;
  searchResult: any;
  hasResult = false;
  num_result = 0;
  active = 'right';
  cur_event: any;
  favourite = [];


  constructor( private searchService: SearchService) {
  }

  ngOnInit() {

    this.searchService.initial.subscribe(
      value =>{
        this.initial = value;
        if(this.initial){
          this.cur_event = undefined
          this.active ='right';
          this.showResult()
        }

      }
    )

    this.searchService.fire.subscribe(value =>{
      this.loader = value;

    });

    this.searchService.counter.subscribe(value =>{
      let sum = 0;
      for (let i = 0; i < value.length; i++) {
        sum += value[i]
      }
      console.log(value)
      this.loader = sum < 4;

    })
    this.searchService.jsonData.subscribe(value =>{
      this.cur_event = undefined;
      this.searchResult = value;
      if(value.hasOwnProperty('_embedded')){
        this.num_result = value['_embedded']['events'].length;
      }
      else{
        this.num_result= 0;
      }
    });
    this.searchService.getresult.subscribe(value =>{
      this.hasResult = value;
      this.initial = false;
    });

  }





  showResult() {

    this.isShowResult = true;
    console.log(this.cur_event);

  }

  showFavorite() {
    this.isShowResult = false;
  }

  getData() {
    let datas = [];
    if(this.hasResult && this.num_result>0){
      let events = this.searchResult._embedded.events;
      for(let i in events){
        let id = events[i].id
        let date = events[i].dates.start.localDate;
        let name = events[i].name;
        let url = "";
        let genre = events[i].classifications[0].genre.name;
        let type = events[i].classifications[0].segment.name;
        let venue = events[i]._embedded.venues[0].name;
        datas.push(
          {
            "date": date,
            "name": name,
            "url": url,
            "genre":genre,
            "type":type,
            "venue":venue,
            "id": id
          }
        )
      }
    }
    return datas;
  }







}
