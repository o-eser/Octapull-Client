import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Create_Product } from 'src/app/contracts/create_product';
import { HttpErrorResponse } from '@angular/common/http';
import { __values } from 'tslib';
import { List_Product } from '../../../contracts/list_product';
import { Observable, firstValueFrom } from 'rxjs';
import { List_Product_Image } from '../../../contracts/list_product_image_list';



@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClientService: HttpClientService) { }

  create(product: Create_Product, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void) {
    this.httpClientService.post({ controller: "product" }, product).subscribe(result => {
      successCallBack();
    }, (errorResponse: HttpErrorResponse) => {
      const _error: Array<{ key: string, value: Array<string> }> = errorResponse.error;
      let message = "";
      _error.forEach((v, index) => {
        v.value.forEach((_v, _index) => {
          message += `${_v}<br>`;
        });
      });
      errorCallBack(message);
    });
  }

  async read(page: number = 0, size: number = 5, successCallback?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<{ totalCount: number, products: List_Product[] }> {

    const promiseData: Promise<{ totalCount: number, products: List_Product[] }> = this.httpClientService.get<{ totalCount: number, products: List_Product[] }>({
      controller: "product",
      queryString: `page=${page}&size=${size}`
    }).toPromise();

    promiseData.then(d => successCallback())
      .catch((errorResponse: HttpErrorResponse) => errorCallBack(errorResponse.message));

    return await promiseData;
  }

  async delete(id: string) {
    const deleteObservable: Observable<any> = this.httpClientService.delete<any>({ controller: "product" }, id);

    await firstValueFrom(deleteObservable);
  }

  async readImages(id: string, successCallBack?: () => void): Promise<List_Product_Image[]> {
    const getObservable: Observable<List_Product_Image[]> = this.httpClientService.get<List_Product_Image[]>({
      action: "getproductimages",
      controller: "product"
    }, id);
    const images: List_Product_Image[] = await firstValueFrom(getObservable);
    successCallBack();

    return images;
  }

async deleteImage(id: string,imageid:string, successCallBack?: () => void) {
    const deleteObservable: Observable<any> = this.httpClientService.delete<any>({
      action: "deleteproductimage",
      controller: "product",
      queryString: `imageid=${imageid}`
    }, id);

    await firstValueFrom(deleteObservable);
    successCallBack();
  }
}
