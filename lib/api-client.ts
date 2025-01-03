import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

interface RequestConfig extends AxiosRequestConfig {
  requiresAuth?: boolean;
}

export interface ApiResponse<T> extends AxiosResponse {
  data: T;
  status: number;
  message?: string;
}


export class ApiClient {
  private client: AxiosInstance;
  baseURL: string;
  private authToken?: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.response.use(
      this.handleSuccess,
      this.handleError
    );
  }

  public setAuthToken(token: string): void {
    this.authToken = token;
  }

  public clearAuthToken(): void {
    this.authToken = undefined;
  }

  // GET request
  public async get<T>(path: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>({ 
      method: 'GET', 
      url: path, 
      ...config 
    });
  }

  // POST request
  public async post<T>(
    path: string, 
    data?: unknown, 
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ 
      method: 'POST', 
      url: path, 
      data, 
      ...config 
    });
  }

  // PUT request
  public async put<T>(
    path: string, 
    data?: unknown, 
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ 
      method: 'PUT', 
      url: path, 
      data, 
      ...config 
    });
  }

  // DELETE request
  public async delete<T>(path: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>({ 
      method: 'DELETE', 
      url: path, 
      ...config 
    });
  }

  // PATCH request
  public async patch<T>(
    path: string, 
    data?: unknown, 
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ 
      method: 'PATCH', 
      url: path, 
      data, 
      ...config 
    });
  }

  private async request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    try {
      if (config.requiresAuth && this.authToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${this.authToken}`,
        };
      }

      const response = await this.client.request<T>(config);
      return this.handleSuccess(response);
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  private handleSuccess<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      data: response.data,
      status: response.status,
      message: 'Request successful',
      statusText: response.statusText,
      config:response.config,
      headers: response.headers
    };
  }

  private handleError(error: AxiosError): Error {
      //const status =  error.response?.status;
      const message = error.message;

      throw new Error(`${message}`);
    }


  public async uploadFile<T>(
    path: string,
    file: File,
    onProgress?: (progress: number) => void,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<T>({
      method: 'POST',
      url: path,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
      ...config,
    });
  }
}