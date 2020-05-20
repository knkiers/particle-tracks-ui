import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  //FormArray,
  Validators, // used to make a field required
  //FormControl
} from '@angular/forms';

import {Subscription} from 'rxjs';

import { UserService } from '../../shared/services/user.service';
import { Institution } from '../../shared/interfaces/institution';

import { User } from '../../shared/models/user';
import { UpdateUserData } from '../../shared/interfaces/update-user-data';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  updateServerError: string = '';
  private userData: any;
  public profileForm: FormGroup; // our model driven form

  currentUser: User = null;
  editUsername: boolean = false;
  editEmail: boolean = false;
  editFirstName: boolean = false;
  editLastName: boolean = false;
  editInstitution: boolean = false;
  editPassword: boolean = false;

  availableInstitutions: Institution[] = [];
  haveInstitutions: boolean = false;

  showInstitutionDropDown: boolean = false;//set to true if user is _not_ staff (staff users cannot change their institution....)

  private subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService) {
    // subscribe to userAnnounced$, just in case we don't have
    // the user in memory in the userService for some reason....
    this.subscription = this.userService.userAnnounced$.subscribe(
      user => {
        this.currentUser = user;
        //console.log('inside profile comp...user updated');
        if (this.currentUser !== null) {// if we already have the user....
          this.initializeForm();
        }
      });
     }

  ngOnInit(): void {
    this.fetchInstitutions();
    this.currentUser = this.userService.fetchCurrentUser();
    console.log('user: ', this.currentUser);
    if (this.currentUser !== null) {// if we already have the user....
      this.initializeForm();
    }
  }

  fetchInstitutions() {
    this.userService.fetchInstitutions().subscribe(
      (institutions: Institution[]) => {
        this.availableInstitutions = institutions;
        console.log('institutions: ', this.availableInstitutions);
        this.haveInstitutions = true;
        this.updateServerError = '';
      },
      error => {
        console.log('there was an error: ', error, typeof error);
        this.updateServerError = error;
      }
    );

  }

  initializeForm() {
    if (this.currentUser.isStaff === false) {
      this.showInstitutionDropDown = true; //only allow non-staff to change institutions
    }
    this.profileForm = this.formBuilder.group({
      username: [this.currentUser.username, [<any>Validators.required]],
      email: [this.currentUser.email, Validators.compose([<any>Validators.required, this.emailValidator])],
      passwords: this.formBuilder.group({
        password: ['', [<any>Validators.required]],
        password2: ['', [<any>Validators.required]]
      }, { validator: this.areEqual }),
      firstName: [this.currentUser.firstName, [<any>Validators.required]],
      lastName: [this.currentUser.lastName, [<any>Validators.required]],
      institutionId: [this.currentUser.institutionId, [<any>Validators.required]],
    });
    this.profileForm.get('username').disable();
    this.profileForm.get('email').disable();
    this.profileForm.get('firstName').disable();
    this.profileForm.get('lastName').disable();
    this.profileForm.get('institutionId').disable();
    this.profileForm.get('passwords').disable();
  }


  // https://netbasal.com/disabling-form-controls-when-working-with-reactive-forms-in-angular-549dd7b42110
  enableField(fieldName: string) {
    switch(fieldName) {
      case 'username': {
        this.profileForm.get('username').enable();
        this.editUsername = true;
        break;
      }
      case 'password': {
        this.profileForm.get('passwords').enable();
        //this.profileForm.controls.passwords.controls.password2.enable();
        this.editPassword = true;
        break;
      }
      case 'email': {
        this.profileForm.get('email').enable();
        this.editEmail = true;
        break;
      }
      case 'firstName': {
        this.profileForm.get('firstName').enable();
        this.editFirstName = true;
        break;
      }
    case 'lastName': {
        this.profileForm.get('lastName').enable();
        this.editLastName = true;
        break;
      }
    case 'institution': {
        this.profileForm.get('institutionId').enable();
        this.editInstitution = true;
        break;
      }
    }
  }

  areEqual(group) {
    if (group.value.password === group.value.password2) {
      return null;
    } else {
      return { error: 'Passwords must match' };
    }
  }

  /*
  // if change this in this in the future, make sure to change it in the profile component as well....
  emailValidator(control) {
    //see: http://stackoverflow.com/questions/34072092/generic-mail-validator-in-angular2
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (!EMAIL_REGEXP.test(control.value)) {
      return { invalidEmail: true };
    }
  }
  */

  getPasswordErrorMessage() {
    console.log('inside method; password error', this.profileForm.controls.passwords.errors);//, this.profileForm.controls.passwords.errors);
    return this.profileForm.controls.passwords.errors.error;
    /*
    console.log(this.profileForm.controls.email);
    if (this.profileForm.controls.email.hasError('required')) {
      return 'This field is required';
    }
    return this.profileForm.controls.email.hasError('invalidEmail') ? 'Not a valid email' : '';
    */
  }

  getEmailErrorMessage() {
    //console.log(this.profileForm.controls.email);
    if (this.profileForm.controls.email.hasError('required')) {
      return 'This field is required';
    }
    return this.profileForm.controls.email.hasError('invalidEmail') ? 'Not a valid email' : '';
  }

  onSubmit() {
    if (this.profileForm.valid){
      let updateUserData: UpdateUserData = {};
      if (this.editUsername) {
        updateUserData.username = this.profileForm.value.username;
      }
      if (this.editPassword) {
        updateUserData.password = this.profileForm.value.passwords.password;
      }
      if (this.editEmail) {
        updateUserData.email = this.profileForm.value.email;
      }
      if (this.editFirstName) {
        updateUserData.first_name = this.profileForm.value.firstName;
      }
      if (this.editLastName) {
        updateUserData.last_name = this.profileForm.value.lastName;
      }
      if (this.editInstitution) {
        updateUserData.institution_id = +this.profileForm.value.institutionId;
      }

      console.log(updateUserData);

      this.updateServerError = '';//reinitialize it....

      this.updateServerError = null;//reinitialize it....
      this.userService.update(updateUserData,this.currentUser.id).subscribe(
        (result) => {
          //this.router.navigate(['/login']);
          // we receive back a new token after updating the user and by this point
          // it has already been stored; now we just need to update the
          // user's data in the user service....
          console.log('successfully updated user: ',result);
          this.userService.setUserData(result.token).subscribe(
            result => {
              this.router.navigate(['/events']);
            }
          );

        },
        (error) => {
          console.log(error);
          this.updateServerError = error;
          //console.log(error.status);
          /*
          if (error.status >= 500) {
            this.updateServerError = error.statusText;
          } else if (error.status >= 400) {
            let errorDict = JSON.parse(error._body);
            for (var key in errorDict) {
              let message = errorDict[key];
              if (Array.isArray(message)) {
                this.updateServerError = message[0];//the text of the error is the only entry in an array....
              } else {
                this.updateServerError = message;
              }
              //console.log(errorDict[key]);
            }
          } else {
            this.updateServerError = error.statusText;
          }
          */
        });
       


    }

  }


  onCancel() {
    this.router.navigate(['/events']);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }



}
