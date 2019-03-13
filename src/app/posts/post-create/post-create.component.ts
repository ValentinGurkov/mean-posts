import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  isLoading = false;
  post: Post ;
  private mode = 'create';
  private postID: string;

  constructor(public postService: PostService, public route: ActivatedRoute) { }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost(form.value.title, form.value.content);
    } else {
      this.postService.updatePost(this.postID, form.value.title, form.value.content);
    }

    form.resetForm();
  }

  ngOnInit() {
    this.route.paramMap.subscribe( (paramMap: ParamMap) => {
        if (paramMap.has('id')) {
          this.mode = 'edit';
          this.postID = paramMap.get('id');
          this.isLoading = true;
          this.postService.getPost(this.postID).subscribe(post => {
            this.isLoading = false;
            this.post = { id: post._id, title: post.title, content: post.content };
          });
        } else {
          this.mode = 'create';
          this.postID = null;
        }
    });
  }

}
