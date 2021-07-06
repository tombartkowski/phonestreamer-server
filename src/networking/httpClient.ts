import axios, { AxiosResponse } from 'axios';
import resolve from '../core/resolve';

const instance = axios.create();

const responseBody = (response: AxiosResponse) => response.data;

export const get = async (url: string): Promise<any> =>
  resolve(instance.get(url).then(responseBody));

export const post = (url: string, body: {}): Promise<any> =>
  resolve(instance.post(url, body).then(responseBody));

export const put = (url: string, body: {}): Promise<any> =>
  resolve(instance.put(url, body).then(responseBody));
export const delete_ = (url: string): Promise<any> =>
  resolve(instance.delete(url).then(responseBody));

const HTTP = {
  get,
  post,
  put,
  delete: delete_,
};

export default HTTP;
