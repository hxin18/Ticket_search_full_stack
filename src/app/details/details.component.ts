import {Component, EventEmitter, Input, OnInit, Output,OnChanges} from '@angular/core';
import {SearchService} from '../services/search.service';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {SeatmapComponent} from './seatmap/seatmap.component';
import {animate, group, query, stagger, state, style, transition, trigger} from '@angular/animations';
import {getMatIconFailedToSanitizeLiteralError} from '@angular/material';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
    animations: [
      trigger('listAnimation', [
        transition('* => *', [ // each time the binding value changes
          query(':leave', [
            style({ opacity: 1, height:'100%' }),
            stagger(-50, [
              animate('0.01s', style({ opacity: 0, height:'0%' }))
            ])
          ], { optional: true }),
          query(':enter', [
            style({ opacity: 0, height:'0%' }),
            stagger(50, [
              animate('0.01s', style({ opacity: 1, height:'100%' }))
            ])
          ], { optional: true })
        ])
      ]),
      trigger('show', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate(1000, style({ opacity: 1 }))
        ]),
        transition(':leave', [
          style({ opacity: 1 }),
          animate(200, style({ opacity: 0 }))
        ])
      ])
    ]
}





)
export class DetailsComponent implements OnInit,OnChanges {

  @Input()
  loader
  selected = 'event';
  detail: any;
  images: any;
  venue: any;
  comming: any;
  comming_keep:any
  zoom = 15;
  artists: any;
  url_base = "https://twitter.com/intent/tweet?text=";
  url = "https://twitter.com/intent/tweet?text=Hello%20world&hashtags=CSCI571EventSearch";
  selectedType: number = 0;
  mode:number=0
  type="Default"
  show="More"
  short_display:any
  comming_display = []
  displayWidth = window.screen.width;
  detailErr = false;
  venueErr = false;

  orderby = ["Default","Event Name","Time","Artist","Type"]

  way = ["Ascending","Descending"]
  @Input() childStatus;
  @Output() childStatusChange = new EventEmitter();

  @Input() cur_event;
  @Output() cur_eventChange = new EventEmitter();

  @Input()
  private favourite;
  @Output() favStatusChange = new EventEmitter();

  ngOnChanges(){

    this.displayWidth = window.screen.width;
  }
  constructor(private searchService: SearchService, private modalService: NgbModal) { }
  change_show(){
    if(this.show == "More"){
      this.show = "Less"
      this.comming_display = this.comming.slice(5);
    }
    else{
      this.show = "More"
      this.comming_display = []
    }
  }

  setOrder(i){
    let ii = parseInt(i)
    this.selectedType = ii;
    console.log(ii)
    this.type = this.orderby[ii];

    switch(ii) {
      case 1:
        this.comming.sort((a,b)=>{
          if (a.displayName < b.displayName)
            return -1;
          if (a.displayName > b.displayName)
            return 1;
          return 0;
        })
        break;
      case 2:
        this.comming.sort((a,b)=>{
          if (new Date(a.date.date).getTime() < new Date(b.date.date).getTime())
            return -1;
          if (new Date(a.date.date).getTime() > new Date(b.date.date).getTime())
            return 1;
          return 0;
        })
        break;
      case 3:
        this.comming.sort((a,b)=>{
          if (a.artists[0] < b.artists[0])
            return -1;
          if (a.artists[0] > b.artists[0])
            return 1;
          return 0;
        })
        break;
      case 4:
        this.comming.sort((a,b)=>{
          if (a.type < b.type)
            return -1;
          if (a.type > b.type)
            return 1;
          return 0;
        })
        break;
      default:
        this.comming = this.comming_keep
    }

    if (this.mode == 1 && this.selectedType>0){
      this.comming = this.comming.reverse()
    }
    this.short_display= this.comming.slice(0, 5);
    if(this.show == "Less"){
      this.comming_display = this.comming.slice(5);
    } else{
      this.comming_display = []
    }
  }
  setmode(i){
    this.mode = i
    this.type = this.way[i];
    this.comming = this.comming.reverse()
    this.short_display= this.comming.slice(0, 5);
    if(this.show == "Less"){
      this.comming_display = this.comming.slice(5);
    } else{
      this.comming_display = []
    }
  }
  ngOnInit() {
    this.searchService.setline.subscribe(result=>{
      this.selected='event'
    })

    this.searchService.figureErr.subscribe(result=>{
      this.venueErr = result;
    })
    this.searchService.detailErr.subscribe(
      result =>{
        this.detailErr = result;

      }
    )
    this.searchService.initial.subscribe(result=>{
      this.selected='event'

    })
    this.searchService.detail.subscribe(result => {
      this.detail= result;
      let name = result.name.replace(/\s+/g, '%20');
      let venues = result.venue[0].replace(/\s+/g, '%20');
      let web = result.url;
      // this.searchService.get_images(result["attractions"])
      // this.searchService.get_venues(this.detail['venue']);
      // this.searchService.get_up_coming(this.detail['venue']);
      this.url = this.url_base+"Check%20out%20"+name+"%20At%20"+venues+"%20Website:"+web+"&hashtags=CSCI571EventSearch";
    })
    this.searchService.figure.subscribe(result => {
      this.images = result;

      // console.log(this.images)
    })
    this.searchService.stadium.subscribe(result => {
      this.venue = result;
      // console.log(this.venue);
    })
    this.searchService.comming.subscribe(result => {
      this.comming = result;
      this.comming_keep = this.comming;
      this.short_display= this.comming.slice(0, 5);

    })
    this.searchService.artist_sp.subscribe(result =>{
      this.artists = result;
    })
  }
  open() {
    const modalRef = this.modalService.open(SeatmapComponent);
    modalRef.componentInstance.url = this.detail.seat_map;
  }
  back_to_list(){
    this.childStatus = 'right'
    this.childStatusChange.emit(this.childStatus);
  }

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
    if(!item){return "star"}
    let idx = this.favourite.map(i => i.id).indexOf(item.id);
    if(idx==-1){
      return "star_border";
    }
    return "star"
  }


}
