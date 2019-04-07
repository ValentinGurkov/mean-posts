import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiURL + '/posts/';
@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const query = `?size=${postsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string; maxPosts: number; posts: Post[] }>(BACKEND_URL + query).subscribe(res => {
      this.posts = res.posts;
      this.postsUpdated.next({ posts: [...this.posts], postCount: res.maxPosts });
    });
  }

  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string; imagePath: string; author: string }>(BACKEND_URL + id);
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
      .post<{ message: string; id: string; title: string; content: string; imagePath: string }>(BACKEND_URL, postData)
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
      postData = { id, title, content, imagePath: null, author: null };
    }
    this.http.patch<{ message: string; imagePath: string }>(BACKEND_URL + id, postData).subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  deletePost(postID: string) {
    return this.http.delete(BACKEND_URL + postID);
  }
}
