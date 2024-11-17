// lib/types.ts

export interface User {
  login_id: string;
  password: string;
}

export interface ZipCodeRecord {
  zip_code: string;
  prefecture: string;
  city: string;
  town: string;
}
