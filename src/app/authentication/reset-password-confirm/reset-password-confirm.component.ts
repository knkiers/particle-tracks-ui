import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  //FormArray,
  Validators, // used to make a field required
  //FormControl
} from '@angular/forms';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-reset-password-confirm',
  templateUrl: './reset-password-confirm.component.html',
  styleUrls: ['./reset-password-confirm.component.scss']
})
export class ResetPasswordConfirmComponent implements OnInit {

  token: string = null;
  tokenReceived: boolean = false;
  private sub: any;
  showResetPasswordButton: boolean = false;

  resetPasswordServerError: string = null;

  public resetPasswordForm: FormGroup; // our model driven form

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    //https://angular-2-training-book.rangle.io/handout/routing/query_params.html
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.token = params['token'] || null;
        console.log('here is the token! ', this.token);
        if (this.token === null) {
          this.tokenReceived = false;
        } else {
          this.tokenReceived = true;
        }
      });
    this.initializeForm();
  }

  initializeForm(){
    this.resetPasswordForm = this.formBuilder.group({
      passwords: this.formBuilder.group({
        password: ['', [<any>Validators.required]],
        password2: ['', [<any>Validators.required]]
      }, {validator: this.areEqual})
    });

  }

  areEqual(group) {
    if (group.value.password === group.value.password2) {
      return null;
    } else {
      return {error: 'Passwords must match.'};
    }
  }

  getPasswordErrorMessage() {
    console.log('inside method; password error', this.resetPasswordForm.get('passwords').errors);//, this.signupForm.controls.passwords.errors);
    return this.resetPasswordForm.get('passwords').errors.error;
    /*
    console.log(this.signupForm.controls.email);
    if (this.signupForm.controls.email.hasError('required')) {
      return 'This field is required';
    }
    return this.signupForm.controls.email.hasError('invalidEmail') ? 'Not a valid email' : '';
    */
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ResetPasswordConfirmDialog, {
      width: '60%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.redirect();
    });
  }

  userIsLoggedIn() {
    return this.userService.isLoggedIn();
  }

  signOut() {
    this.userService.logout();
  }

  signIn() {
    this.router.navigate(['/login']);
  }

  redirect() {
    this.router.navigate(['/']);
  }

  onSubmit() {

    if (this.resetPasswordForm.valid){
      this.resetPasswordServerError = null;//reinitialize it....
      this.userService.resetPasswordConfirm(
        this.token,
        this.resetPasswordForm.value.passwords.password,
      ).subscribe(
        (result) => {
          console.log('here is the result! ', result);
          this.showResetPasswordButton = false;
          this.openDialog();
          //this.router.navigate(['/login']);
        },
        (error) => {
          if (error === 'not-found') {
            this.showResetPasswordButton = true;
            this.resetPasswordServerError = null;
          } else {
            this.resetPasswordServerError = error;
          }
        });
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}

@Component({
  selector: 'reset-password-confirm-dialog',
  templateUrl: 'reset-password-confirm-dialog.html',
})
export class ResetPasswordConfirmDialog {
  constructor(public dialogRef: MatDialogRef<ResetPasswordConfirmDialog>) {}

  onClose(): void {
    this.dialogRef.close();
  }

}
