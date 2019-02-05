import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {SearchService} from '../services/search.service';

@Component({
  selector: 'app-res-table',
  templateUrl: './res-table.component.html',
  styleUrls: ['./res-table.component.css']
})
export class ResTableComponent implements OnInit {
  @Input()
  public tabledata: any;
  @Input()
  public hasresult;
  @Input()
  public favourite;
  @Input()
  public failed;
  @Output() favStatusChange = new EventEmitter();

  @Input() childStatus;
  @Output() childStatusChange = new EventEmitter();

  @Input() cur_event
  @Output() cur_eventChange = new EventEmitter();

  get_abbv(string){
    if(string.length>35){
      return string.substring(0, 35)+'...';
    }
    return string;
  }

  trackByFn = (index: number, item: any) => item.id;
  constructor(private searchService: SearchService) { }
  add_fav(item){
    let idx = this.favourite.map(i => i.id).indexOf(item.id);
    if(idx === -1){
      this.favourite.push(item);
    } else{
      this.favourite.pop(item);
    }
    this.favStatusChange.emit(this.favourite);
    return item;
  }
  like(item){
    let idx = this.favourite.map(i => i.id).indexOf(item.id);
    if(idx==-1){
      return "star_border";
    }
    return "star"
  }

  search_detail(id){
    this.childStatus = 'left';
    this.childStatusChange.emit(this.childStatus);
    this.searchService.search_detail(id);
    for(let e of this.tabledata){
      if(e.id == id){
        this.cur_event = e;
        this.cur_eventChange.emit(this.cur_event);
        console.log(this.cur_event);
      }
    }

    // console.log(this.slide)
    // return false;
  }

  move_to(){
    this.childStatus = 'left';
    this.childStatusChange.emit(this.childStatus);

  }
  ngOnInit() {

  }


}
