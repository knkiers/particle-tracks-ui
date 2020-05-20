import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // see: https://github.com/auth0-blog/angular2-authentication-sample
  //      https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.vwfc7gq9v
  //      https://scotch.io/tutorials/using-angular-2s-model-driven-forms-with-formgroup-and-formcontrol

  public loginForm: FormGroup; // model driven form
  signinServerError: String = '';
  public loginInvalid: boolean = false;

  constructor(private userService: UserService,
              private router: Router,
              private fb: FormBuilder,) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [<any>Validators.required]],
      password: ['', [<any>Validators.required]]
    });

  }

  onSubmit() {
    //console.log('submitted!');
    if (this.loginForm.valid){
      this.loginInvalid = false;
      this.signinServerError = '';//reinitialize it....
      console.log('submitted!', this.loginForm.value.username,this.loginForm.value.password);
      
      this.userService.login(
        this.loginForm.value.username,
        this.loginForm.value.password).subscribe(
        (result) => {
          console.log('back in the login component! ', result);
          
          this.userService.setUserData(result.token).subscribe(
            (result) => {
              this.router.navigate(['/events']);
            },
            (errorMessage) => {
              console.log('back in the login component...there was an error!', errorMessage, typeof errorMessage);
              this.signinServerError = errorMessage;
              this.loginInvalid = true;
            });
        },
        (errorMessage) => {
          console.log('back in the login component...there was an error!', errorMessage, typeof errorMessage);
          this.signinServerError = errorMessage;
          this.loginInvalid = true;
        });
    }
  }

}
