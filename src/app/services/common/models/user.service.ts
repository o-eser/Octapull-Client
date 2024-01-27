import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { User } from 'src/app/entities/user';
import { Create_User } from 'src/app/contracts/users/create_user';
import { Observable, firstValueFrom } from 'rxjs';
import { LoginUser } from 'src/app/contracts/users/login_user';
import { TokenResponse } from 'src/app/contracts/Token/token-response';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { Token } from 'src/app/contracts/Token/token';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClientService: HttpClientService, private toastrService: CustomToastrService) { }

  async register(user: User): Promise<Create_User> {
    const observable: Observable<Create_User | User> = this.httpClientService.post<Create_User | User>({
      controller: "Account"
    }, user);

    return await firstValueFrom(observable) as Create_User;
  }

  async login(login_user: LoginUser): Promise<any> {
    const observable: Observable<LoginUser | Token> = this.httpClientService.post<LoginUser | Token>({ controller: "Account", action: "Login" }, login_user);
    const tokenResponse: Token = await firstValueFrom(observable) as Token;
    if (tokenResponse) {
      debugger;
      localStorage.setItem("accessToken", tokenResponse.accessToken);
      this.toastrService.message("Kullanıcı girişi başarıyla sağlanmıştır.", "Giriş Başarılı", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      });
    }
  }
}
