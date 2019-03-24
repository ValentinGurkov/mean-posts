import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const query = `?size=${postsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string; maxPosts: number; posts: Post[] }>('http://localhost:3000/api/posts' + query).subscribe(res => {
      this.posts = res.posts;
      this.postsUpdated.next({ posts: [...this.posts], postCount: res.maxPosts });
    });
  }

  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string; imagePath: string }>('http://localhost:3000/api/posts/' + id);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ message: string; id: string; title: string; content: string; imagePath: string }>('http://localhost:3000/api/posts', postData)
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: FormData | Post;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = { id, title, content, imagePath: null };
    }
    this.http.patch<{ message: string; imagePath: string }>('http://localhost:3000/api/posts/' + id, postData).subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  deletePost(postID: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + postID);
  }
}
