import { Component, ElementRef, ViewChild } from '@angular/core';
import { GifsService } from '../../services/gifs.service';

@Component({
  selector: 'gift-search-box',
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.css'
})
export class SearchBoxComponent {
  @ViewChild("txtTagInput")
  public tagInput!:ElementRef<HTMLInputElement>;
constructor(private gifsService:GifsService){

}
searchTag(){
  let newTag=this.tagInput.nativeElement.value;
  this.gifsService.searchTag(newTag);
  this.tagInput.nativeElement.value="";
}
}
