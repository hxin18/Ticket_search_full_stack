import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SearchService } from '../services/search.service';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {
  userLocation: Object;
  category = 'default';
  searchTerm$ = new Subject<string>();


  form = {
    keyword: '',
    category: 'All',
    distance: 10,
    isUserInput: false,
    location: '',
    measure: 'Miles',
    geoJson: undefined
  };

  options: string[] = [];

  searchTypes = [
    'All',
    'Music',
    'Sports',
    'Arts & Theatre',
    'Film',
    'Miscellaneous'
  ];

  measureTypes = [
    'Miles',
    'Kilometers'
  ];


  constructor(private searchService: SearchService, private cdRef: ChangeDetectorRef, private http: HttpClient) {

  }

  clear_all() {
    this.form = {
      keyword: '',
      category: 'All',
      distance: 10,
      isUserInput: false,
      location: '',
      measure: 'Miles',
      geoJson: undefined
    };
    this.searchService.init();

   this.init();
    return false
  }

  onSubmit() {
    this.searchService.search(this.form);
  };

  auto_complete(word){
    if(word.trim().length==0){
      this.options = [];
    }else{
      this.searchTerm$.next(word)
      this.searchService.search_2(this.searchTerm$);
    }

  };

  ngOnInit() {
    this.init()
  }

  init(){ this.http.get('http://ip-api.com/json').subscribe( data => {
    this.userLocation = {
      lat: data["lat"],
      lng: data["lon"]
    };
    this.form.geoJson = this.userLocation;
    this.searchService.autocomplete.subscribe(value =>{
      this.options = value.map(x=>x.name);
    })
  });}
}

