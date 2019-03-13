import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Post } from './post.model';


@Injectable( {providedIn: 'root'} )
export class PostService {
  private posts: Post[] = [];
  private postsUpdated: Subject<Post[]> = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts').subscribe(res => {
      this.posts = res.posts;
      this.postsUpdated.next([...this.posts]);
      console.log(this.posts);
    });
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + id);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title, content};
    this.http.post<{message: string, id: string}>('http://localhost:3000/api/posts', post).subscribe(res => {
      post.id = res.id;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id, title, content };
    this.http.patch('http://localhost:3000/api/posts/' + id, post)
      .subscribe(() => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next();
        this.router.navigate(['/']);
      });
  }

  deletePost(postID: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postID)
      .subscribe(() => {
        this.posts = this.posts.filter(post => post.id !== postID);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
