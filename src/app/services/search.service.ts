import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {debounceTime, delay, distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import {forkJoin, Observable} from 'rxjs';


@Injectable()
export class SearchService {
  url = "http://localhost:4600";
  // private url= 'http://hxserverhw8.us-west-1.elasticbeanstalk.com';
  @Output() fire: EventEmitter<any> = new EventEmitter();
  @Output() jsonData: EventEmitter<any> = new EventEmitter();
  @Output() getresult: EventEmitter<any> = new EventEmitter();
  @Output() autocomplete: EventEmitter<any> = new EventEmitter();
  @Output() detail: EventEmitter<any> = new EventEmitter();
  @Output() detailErr: EventEmitter<any> = new EventEmitter();
  @Output() figure: EventEmitter<any> = new EventEmitter();
  @Output() figureErr: EventEmitter<any> = new EventEmitter();
  @Output() stadium: EventEmitter<any> = new EventEmitter();
  @Output() comming: EventEmitter<any> = new EventEmitter();
  @Output() artist_sp: EventEmitter<any> = new EventEmitter();
  @Output() counter: EventEmitter<any> = new EventEmitter();
  @Output() initial: EventEmitter<any> = new EventEmitter();
  @Output() setline: EventEmitter<any> = new EventEmitter();
  constructor(private http: HttpClient) { }
  counters = [1, 1, 1, 1];
  init(){
    this.initial.emit(true);
  }

  search(form) {
    this.setline.emit(true);
    this.fire.emit(true);
    let location = form.location;
    if (!location) {
      location = "New York";
    }


    let params = new HttpParams().set("keyword", form.keyword)
        .set("category", form.category || "ALL")
        .set("distance", form.distance || "10")
        .set("isUserInput", form.isUserInput || false)
        .set("location", location)
        .set("geoJson", JSON.stringify(form.geoJson)).set("unit",form.measure);

      let completeUrl = this.url+"/search";
      console.log(completeUrl,params.toString());
      this.http.get(completeUrl,{params:params}).subscribe( result => {
         // console.log(data);
        this.fire.emit(false);
        this.jsonData.emit(result);
        this.getresult.emit(true);
        },
        error => {
          this.fire.emit(false);
          this.getresult.emit(false);
        },
      );
    }


  search_2(terms: Observable<string>) {
    terms.pipe(distinctUntilChanged()).subscribe(res=>{ this.complete(res)})
  }

    complete(word) {
      let completeUrl = this.url+"/autocomplete";
      let params = new HttpParams().set("word",word);

      this.http.get(completeUrl,{params:params}).subscribe(result => {

        this.autocomplete.emit(result);
      },
      error =>{
        console.log(error);
        });
    }

    search_detail(id){
      this.setline.emit(true);
      this.counters = [0,0,0,0]
      this.counter.emit(this.counters);
      let completeUrl = this.url+"/details";
      let i = 1
      let params = new HttpParams().set("id",id)
      this.http.get(completeUrl,{params:params}).subscribe(result =>{
        this.detail.emit(result);
          this.get_images(result["attractions"])
          this.get_venues(result['venue']);
          this.get_up_coming(result['venue']);
        if(result["category"][1]=="Music"){
          this.search_music(result["attractions"]);
        }
        else{
          this.counters[2] = 1
        }
          this.detailErr.emit(false);
      },
      err =>{
        this.detailErr.emit(true);
      });
    }

    get_images(name){
      let req = []
      for (let n of name){
        let param = new HttpParams().set("name",n)
        req.push(this.http.get(this.url+'/pic',{params: param}).pipe(map(response => response)));
      }
      forkJoin(req)
        .subscribe(
          results => {
            this.figure.emit(results);
            this.counters[3] = 1
            this.counter.emit(this.counters)
          },
          error => {
            this.figure.emit([]);
            this.counters[3] = 1
            this.counter.emit(this.counters)
          });
    }
    get_venues(venue){
      let completeUrl = this.url+"/venue";
      let params = new HttpParams().set("name",venue)
      this.http.get(completeUrl,{params:params}).subscribe(result =>{
        this.stadium.emit(result);
        this.counters[0] = 1
        this.counter.emit(this.counters)
          this.figureErr.emit(false)
        // console.log(result);
      },
        error => {
          console.log(error);
          this.stadium.emit({})
          this.counters[0] = 1
          this.counter.emit(this.counters)
          this.figureErr.emit(true)
        }
        );
    }
    get_up_coming(venue){
      let completeUrl = this.url+"/comming";
      let params = new HttpParams().set("name",venue)
      console.log(completeUrl)
      this.http.get(completeUrl,{params:params}).subscribe(result =>{
        // this.stadium.emit(result);

        this.comming.emit(result["comming"]);
        this.counters[1] = 1
        this.counter.emit(this.counters)
      },
        error => {
          this.comming.emit([]);
          console.error(error);
          this.counters[1] = 1
          this.counter.emit(this.counters)
        }
        );
    }
    search_music(name){
      let req = []
      for (let n of name){
        let param = new HttpParams().set("name",n)
        req.push(this.http.get(this.url+'/artist',{params: param}).pipe(map(response => response)));
      }
      forkJoin(req)
        .subscribe(
          results => {
            this.artist_sp.emit(results);
            this.counters[2] = 1
            this.counter.emit(this.counters)
            // console.log(results);
          },
          error => {
            console.error(error);
            this.artist_sp.emit({});
            this.counters[2] = 1
            this.counter.emit(this.counters)
          });
    }
}
