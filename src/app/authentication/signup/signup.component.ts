import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  //FormArray,
  Validators, // used to make a field required
  //FormControl
} from '@angular/forms';

import { UserService } from '../../shared/services/user.service';
import { Institution } from '../../shared/interfaces/institution';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupServerError: string = '';
  private userData: any;
  public signupForm: FormGroup; // our model driven form

  availableInstitutions: Institution[] = [];
  haveInstitutions: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
    console.log('inside ngOnInit of sign-up');
    this.fetchInstitutions();
    this.initializeForm();
  }

  fetchInstitutions() {
    this.userService.fetchInstitutions().subscribe(
      (institutions: Institution[]) => {
        this.availableInstitutions = institutions;
        console.log('institutions: ', this.availableInstitutions);
        this.haveInstitutions = true;
        this.signupServerError = '';
      },
      error => {
        console.log('there was an error: ', error, typeof error);
        this.signupServerError = error;
      }
    );

  }

  initializeForm() {
    this.createEmptyUserData();// could (conditionally) user supplied userData instead....
    this.signupForm = this.formBuilder.group({
      username: [this.userData.username, [<any>Validators.required]],
      email: [this.userData.email, Validators.compose([<any>Validators.required, this.emailValidator])],
      passwords: this.formBuilder.group({
        password: [this.userData.password, [<any>Validators.required]],
        password2: [this.userData.password, [<any>Validators.required]]
      }, { validator: this.areEqual }),
      firstName: [this.userData.firstName, [<any>Validators.required]],
      lastName: [this.userData.lastName, [<any>Validators.required]],
      institutionId: [this.userData.institutionId, [<any>Validators.required]]
    });

  }

  createEmptyUserData() {
    this.userData = {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      institutionId: null
    }
  }

  areEqual(group) {
    if (group.value.password === group.value.password2) {
      return null;
    } else {
      return { error: 'Passwords must match' };
    }
  }

  
  // if change this in this in the future, make sure to change it in the profile component as well....
  emailValidator(control) {
    //see: http://stackoverflow.com/questions/34072092/generic-mail-validator-in-angular2
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (!EMAIL_REGEXP.test(control.value)) {
      return { invalidEmail: true };
    }
  }

  getPasswordErrorMessage() {
    console.log('inside method; password error', this.signupForm.controls.passwords.errors);//, this.signupForm.controls.passwords.errors);
    return this.signupForm.controls.passwords.errors.error;
    /*
    console.log(this.signupForm.controls.email);
    if (this.signupForm.controls.email.hasError('required')) {
      return 'This field is required';
    }
    return this.signupForm.controls.email.hasError('invalidEmail') ? 'Not a valid email' : '';
    */
  }

  getEmailErrorMessage() {
    //console.log(this.signupForm.controls.email);
    if (this.signupForm.controls.email.hasError('required')) {
      return 'This field is required';
    }
    return this.signupForm.controls.email.hasError('invalidEmail') ? 'Not a valid email' : '';
  }

  onSubmit() {
    console.log(this.signupForm);
    if (this.signupForm.valid) {
      this.signupServerError = null;//reinitialize it....
      this.userService.register(
        this.signupForm.value.username,
        this.signupForm.value.passwords.password,
        this.signupForm.value.email,
        this.signupForm.value.firstName,
        this.signupForm.value.lastName,
        +this.signupForm.value.institutionId
      ).subscribe(
        (result) => {
          this.signupServerError = '';
          this.router.navigate(['/login']);
        },
        (error) => {
          console.log('there was an error: ', error, typeof error);
          this.signupServerError = error;
        });
    }

  }

}
