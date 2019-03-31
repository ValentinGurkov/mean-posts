import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  isLoading = false;
  post: Post;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private postID: string;

  constructor(public postService: PostService, public route: ActivatedRoute) {}

  onSavePost() {
    if (this.form.invalid || typeof this.form.value.image !== 'object') {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      this.postService.updatePost(this.postID, this.form.value.title, this.form.value.content, this.form.value.image);
    }

    this.form.reset();
  }

  onImagePicked(event: Event) {
    const reader = new FileReader();
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: Validators.required, asyncValidators: [mimeType] })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.postID = paramMap.get('id');
        this.isLoading = true;
        this.postService.getPost(this.postID).subscribe(post => {
          this.isLoading = false;
          this.post = { id: post._id, title: post.title, content: post.content, imagePath: post.imagePath, author: post.author };
          this.form.setValue({ title: this.post.title, content: this.post.content, image: this.post.imagePath });
        });
      } else {
        this.mode = 'create';
        this.postID = null;
      }
    });
  }
}
