import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostService } from '../posts.service';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  pageSize = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private postSubsciption: Subscription;

  constructor(public postService: PostService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.pageSize, this.currentPage);
    this.postSubsciption = this.postService.getPostUpdateListener().subscribe((postData: { posts: Post[], postCount: number }) => {
      this.isLoading = false;
      this.posts = postData.posts;
      this.totalPosts = postData.postCount;
    });
  }

  ngOnDestroy() {
    this.postSubsciption.unsubscribe();
  }

  onDelete(postID: string) {
    this.isLoading = true;
    this.postService.deletePost(postID).subscribe(() => {
      this.postService.getPosts(this.pageSize, this.currentPage);
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.pageSize = pageData.pageSize;
    this.postService.getPosts(this.pageSize, this.currentPage);
  }
}
