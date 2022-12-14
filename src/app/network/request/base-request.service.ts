import {
  HttpClient,
  HttpContext,
  HttpHeaders,
  HttpParams,
  HttpParamsOptions,
} from '@angular/common/http';
import { ClassConstructor, classToPlain } from 'class-transformer';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { PagedList } from 'src/app/models/page.model';
import { HowellResponse } from 'src/app/models/response.model';

import { IParams } from './IParams.interface';
import { ServiceHelper } from './service-helper';

export class BaseRequestService {
  constructor(public http: HttpClient) {}
  async get<T>(url: string, type: ClassConstructor<T>) {
    let response = await firstValueFrom(this.http.get<HowellResponse<T>>(url));
    return ServiceHelper.ResponseProcess(response, type);
  }
  async put<T>(url: string, type: ClassConstructor<T>, model: T | IParams) {
    let data = classToPlain(model) as T;
    let response = await firstValueFrom(
      this.http.put<HowellResponse<T>>(url, data)
    );
    return ServiceHelper.ResponseProcess(response, type);
  }
  async post<T>(url: string): Promise<T>;
  async post<T>(
    url: string,
    type: ClassConstructor<T>,
    params?: IParams
  ): Promise<T>;

  async post<T>(url: string, type: ClassConstructor<T>, model?: T): Promise<T>;

  async post<T>(
    url: string,
    type?: ClassConstructor<T>,
    args?: T | IParams | string
  ) {
    if (type === undefined) {
      let observable = this.http.post<T>(url, undefined);
      return firstValueFrom(observable);
    } else {
      let data = classToPlain(args) as T | IParams;
      let response = await firstValueFrom(
        this.http.post<HowellResponse<T>>(url, data)
      );
      return ServiceHelper.ResponseProcess(response, type);
    }
  }

  public postString<T = any, R = HowellResponse<T>>(
    url: string,
    base64: string,
    params?: HttpParams
  ): Promise<R> {
    const httpOptions = {
      params: params,
      'Content-Type': 'text/plain',
    };
    let response = this.http.post<R>(url, base64, httpOptions);
    let promise = firstValueFrom(response);
    return promise;
  }

  async base64<T>(url: string, type: ClassConstructor<T>, base64: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json-patch+json', //'application/json',
    });
    let response = await firstValueFrom(
      this.http.post<HowellResponse<T>>(url, `\"` + base64 + `\"`, {
        headers: headers,
      })
    );
    return ServiceHelper.ResponseProcess(response, type);
  }
  async delete<T>(url: string, type: ClassConstructor<T>) {
    let response = await firstValueFrom(
      this.http.delete<HowellResponse<T>>(url)
    );
    return ServiceHelper.ResponseProcess(response, type);
  }
  async array<T>(url: string, type: ClassConstructor<T>, params?: IParams) {
    let data: IParams | undefined;
    if (params) {
      data = classToPlain(params) as IParams;
    }
    let response = await firstValueFrom(
      this.http.get<HowellResponse<Array<T>>>(url, data)
    );

    return ServiceHelper.ResponseProcess(response!, type);
  }
  async paged<T>(url: string, type: ClassConstructor<T>, params: IParams) {
    let data = classToPlain(params) as IParams;
    let response = await firstValueFrom(
      this.http.post<HowellResponse<PagedList<T>>>(url, data)
    );
    return ServiceHelper.ResponseProcess(response, type);
  }

  type<T>(type: ClassConstructor<T>): BaseTypeRequestService<T> {
    return new BaseTypeRequestService<T>(this, type);
  }
}

export class BaseTypeRequestService<T> {
  constructor(
    private _service: BaseRequestService,
    private type: ClassConstructor<T>
  ) {}

  async get(url: string) {
    return this._service.get(url, this.type);
  }
  async put(url: string, model: T) {
    return this._service.put(url, this.type, model);
  }
  async post(url: string, model?: T): Promise<T>;
  async post(url: string, params?: IParams): Promise<T>;
  async post(url: string, base64?: string): Promise<T>;
  async post(url: string, args?: T | IParams | string) {
    return this._service.post(url, this.type, args);
  }
  async delete(url: string) {
    return this._service.delete(url, this.type);
  }
  async array(url: string, params?: IParams) {
    return this._service.array(url, this.type, params);
  }
  async paged(url: string, params: IParams) {
    return this._service.paged(url, this.type, params);
  }
  async base64(url: string, base64: string) {
    return this._service.base64(url, this.type, base64);
  }
}
