import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginUser } from 'src/app/contracts/users/login_user';
import { UserService } from 'src/app/services/common/models/user.service';
import { CustomToastrService } from 'src/app/services/ui/custom-toastr.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private userService: UserService, private toastService: CustomToastrService) { }

  frm: FormGroup;
  submitted: boolean = false;

  ngOnInit(): void {
    this.frm = this.formBuilder.group({
      userNameorEmail: ["", [
        Validators.required,
      ]],
      password: ["", [
        Validators.required,
      ]]
    });
  }

  get component() {
    return this.frm.controls;
  }

  async onSubmit(loginUser: LoginUser) {
    this.submitted = true;
    if (this.frm.invalid)
      return;
    await this.userService.login(loginUser);
  }

}
