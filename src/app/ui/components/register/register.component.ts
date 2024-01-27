import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Create_User } from 'src/app/contracts/users/create_user';
import { User } from 'src/app/entities/user';
import { UserService } from 'src/app/services/common/models/user.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private userService: UserService, private toastService: CustomToastrService) { }

  frm: FormGroup;
  submitted: boolean = false;

  ngOnInit(): void {
    this.frm = this.formBuilder.group({
      name: ["", [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(3)
      ]],
      surname: ["", [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(3)
      ]],
      userName: ["", [
        Validators.required,
      ]],
      email: ["", [
        Validators.required,
        Validators.maxLength(50),
        Validators.email
      ]],
      phone: ["", [
        Validators.required,
      ]],
      password: ["", [
        Validators.required,
      ]],
      passwordAgain: ["", [
        Validators.required,
      ]]
    }, {
      validators: (group: AbstractControl): ValidationErrors | null => {
        let password = group.get("password").value;
        let passwordAgain = group.get("passwordAgain").value;
        return password === passwordAgain ? null : { notSame: true };
      }
    });
  }

  get component() {
    return this.frm.controls;
  }

  async onSubmit(user: User) {
    this.submitted = true;
    if (this.frm.invalid)
      return;
    const result: Create_User = await this.userService.register(user);
    if (result.succeeded)
      this.toastService.message(result.message, "Kayıt Başarılı", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      })
    else
      this.toastService.message(result.message, "Kayıt Hatası", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      })
  }
}
