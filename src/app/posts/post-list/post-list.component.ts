import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  posts = [{title: "First post", content: "First post content"},
  {title: "Second post", content: "Second post content"},
  {title: "Third post", content: "Third post content"},
  {title: "Fourth post", content: "Fourth post content"}];

  constructor() { }

  ngOnInit() {
  }

}
