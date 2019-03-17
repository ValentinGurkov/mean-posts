import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postsUpdated: Subject<Post[]> = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http.get<{ message: string; posts: Post[] }>('http://localhost:3000/api/posts').subscribe(res => {
      this.posts = res.posts;
      this.postsUpdated.next([...this.posts]);
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
      .subscribe(res => {
        const post: Post = { id: res.id, title, content, imagePath: res.imagePath };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
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
    this.http.patch<{ message: string; imagePath: string }>('http://localhost:3000/api/posts/' + id, postData).subscribe(res => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
      const post: Post = { id, title, content, imagePath: res.imagePath };
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next();
      this.router.navigate(['/']);
    });
  }

  deletePost(postID: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postID).subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== postID);
      this.postsUpdated.next([...this.posts]);
    });
  }
}
