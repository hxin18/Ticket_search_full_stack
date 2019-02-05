import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SearchService} from '../services/search.service';

@Component({
  selector: 'app-fav-table',
  templateUrl: './fav-table.component.html',
  styleUrls: ['./fav-table.component.css']
})
export class FavTableComponent implements OnInit {
  @Input()
  public favourite;
  @Output() favStatusChange = new EventEmitter();
  constructor(private searchService: SearchService) { }

  @Input() childStatus;
  @Output() childStatusChange = new EventEmitter();

  @Input() cur_event
  @Output() cur_eventChange = new EventEmitter();

  ngOnInit() {
  }
  del_fav(item){
    let idx = this.favourite.map(i => i.id).indexOf(item.id);
    console.log(idx);
    if(idx !== -1){
      this.favourite.pop(item);
    }
    this.favStatusChange.emit(this.favourite);
  }

  get_abbv(string){
    if(string.length>35){
      return string.substring(0, 35)+'...';
    }
    return string;
  }
  search_detail(id){
    this.childStatus = 'left';
    this.childStatusChange.emit(this.childStatus);
    this.searchService.search_detail(id);
    for(let e of this.favourite){
      if(e.id == id){
        this.cur_event = e;
        this.cur_eventChange.emit(this.cur_event);
        console.log(this.cur_event);
      }
    }
  }
  move_to(){
    this.childStatus = 'left';
    this.childStatusChange.emit(this.childStatus);

  }

}
