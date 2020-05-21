import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  //FormArray,
  Validators // used to make a field required
  //FormControl
} from '@angular/forms';

import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordServerError: string = '';

  public resetPasswordForm: FormGroup; // our model driven form

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private userService: UserService) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm(){
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', Validators.compose([<any>Validators.required, this.emailValidator])],
    });
  }

  // if change this in this in the future, make sure to change it in the profile component as well....
  emailValidator(control) {
    //see: http://stackoverflow.com/questions/34072092/generic-mail-validator-in-angular2
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (!EMAIL_REGEXP.test(control.value)) {
      return {invalidEmail: true};
    }
  }

  /*
  userIsLoggedIn() {
    return this.userService.isLoggedIn();
  }
  */

  signOut() {
    this.userService.logout();
  }

  redirect() {
    this.router.navigate(['/']);
  }

  getEmailErrorMessage() {
    //console.log(this.signupForm.controls.email);
    if (this.resetPasswordForm.controls.email.hasError('required')) {
      return 'This field is required';
    }
    return this.resetPasswordForm.controls.email.hasError('invalidEmail') ? 'Not a valid email' : '';
  }

  onSubmit() {
    if (this.resetPasswordForm.valid){
      this.resetPasswordServerError = '';//reinitialize it....
      this.userService.resetPassword(
        this.resetPasswordForm.value.email
      ).subscribe(
        (result) => {
          //this.openModal();
          console.log('back in the component; here is the result: ', result);

          /**
           * emit snack-bar....
           */

          //console.log('here is the result! ', result);
          //this.router.navigate(['/login']);
        },
        (error) => {
          console.log(error);
          this.resetPasswordServerError = error;
          
        });
    }
  }


}
