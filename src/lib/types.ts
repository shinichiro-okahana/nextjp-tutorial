// lib/types.ts

import { z } from "zod";

export interface User {
  login_id: string
  password: string
}

export interface SignupUser extends User {
  confirm_password: string
  unknown_error?: string
  message?: string
}

export interface ZipCodeRecord {
  zip_code: string;
  prefecture: string;
  city: string;
  town: string;
}

export class ZodValidationError extends Error {
  public validationErrors: z.ZodIssue[]
  public isZodValidationError: boolean
  constructor(issues: z.ZodIssue[]) {
    super("検証エラー")
    this.name = "ZodValidationError"
    this.validationErrors = issues
    this.isZodValidationError = true
  }
}

export function reconstructError(e:unknown) : ZodValidationError | Error {
  const ze = e as ZodValidationError
  if (ze?.isZodValidationError) {
    return new ZodValidationError(ze?.validationErrors)
  }
  return e as Error
}