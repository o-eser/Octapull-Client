import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(private httpClient: HttpClient, @Inject("baseUrl") private baseUrl: string) {
  }
  private url(requesParameters: Partial<RequestParameters>): string {
    return `${requesParameters.baseUrl ? requesParameters.baseUrl : this.baseUrl}/${requesParameters.controller}${requesParameters.action ? `/${requesParameters.action}` : ""}`;
  }

  get<T>(requesParameters: Partial<RequestParameters>, id?: string): Observable<T> {
    let url: string = "";

    if (requesParameters.fullEndPoint)
      url = requesParameters.fullEndPoint;
    else
      url = `${this.url(requesParameters)}${id ? `/${id}` : ""}${requesParameters.queryString ? `?${requesParameters.queryString}` : ""}`;

    return this.httpClient.get<T>(url, { headers: requesParameters.headers })
  }

  post<T>(requesParameters: Partial<RequestParameters>, body: Partial<T>): Observable<T> {
    let url: string = "";

    if (requesParameters.fullEndPoint)
      url = requesParameters.fullEndPoint;
    else
      url = `${this.url(requesParameters)}${requesParameters.queryString ? `?${requesParameters.queryString}` : ""}`;


    return this.httpClient.post<T>(url, body, { headers: requesParameters.headers });
  }

  put<T>(requesParameters: Partial<RequestParameters>, body: Partial<T>): Observable<T> {

    let url: string = "";

    if (requesParameters.fullEndPoint)
      url = requesParameters.fullEndPoint;
    else
      url = `${this.url(requesParameters)}${requesParameters.queryString ? `?${requesParameters.queryString}` : ""}`;

    return this.httpClient.put<T>(url, body, { headers: requesParameters.headers });
  }

  delete<T>(requesParameters: Partial<RequestParameters>, id: string): Observable<T> {
    let url: string = "";

    if (requesParameters.fullEndPoint)
      url = requesParameters.fullEndPoint;
    else
      url = `${this.url(requesParameters)}/${id}${requesParameters.queryString ? `?${requesParameters.queryString}` : ""}`;

    return this.httpClient.delete<T>(url, { headers: requesParameters.headers })
  }
}


export class RequestParameters {
  controller?: string;
  action?: string;
  queryString?: string;

  headers?: HttpHeaders;
  baseUrl?: string;
  fullEndPoint?: string
}
