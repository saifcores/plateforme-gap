import { HttpErrorResponse } from "@angular/common/http";
import { WritableSignal } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

export interface ApiErrorBody {
  message?: string;
  errors?: Record<string, string>;
}

function parseApiErrorBody(
  body: ApiErrorBody | string | null | undefined,
  fallback: string,
): string {
  if (!body) {
    return fallback;
  }

  if (typeof body === "string") {
    return body.trim() || fallback;
  }

  const fieldMessages = body.errors
    ? Object.values(body.errors).filter((m) => !!m?.trim())
    : [];

  if (fieldMessages.length) {
    return fieldMessages.join(" · ");
  }

  if (body.message?.trim() && body.message !== "Validation echouee") {
    return body.message;
  }

  return fallback;
}

/** Extract a user-facing message from a Spring Boot API error response. */
export function extractApiErrorMessage(
  err: unknown,
  fallback = "Une erreur est survenue.",
): string {
  if (!(err instanceof HttpErrorResponse)) {
    return fallback;
  }

  if (err.error instanceof Blob) {
    return fallback;
  }

  return parseApiErrorBody(
    err.error as ApiErrorBody | string | null | undefined,
    fallback,
  );
}

/** Parse JSON error bodies returned with responseType: "blob". */
export async function readBlobApiError(
  err: unknown,
  fallback: string,
): Promise<string> {
  if (err instanceof HttpErrorResponse && err.error instanceof Blob) {
    try {
      const text = await err.error.text();
      return parseApiErrorBody(JSON.parse(text) as ApiErrorBody, fallback);
    } catch {
      return fallback;
    }
  }
  return extractApiErrorMessage(err, fallback);
}

export function finishListLoad(
  err: unknown,
  loading: WritableSignal<boolean>,
  loadError: WritableSignal<string | null>,
  fallback: string,
): void {
  loadError.set(extractApiErrorMessage(err, fallback));
  loading.set(false);
}

export function clearListLoadError(
  loadError: WritableSignal<string | null>,
): void {
  loadError.set(null);
}

export interface HttpErrorFallbacks {
  notFound?: string;
  forbidden?: string;
  default: string;
}

/** Map HTTP status to a friendly message, then fall back to API body details. */
export function extractHttpErrorMessage(
  err: unknown,
  fallbacks: HttpErrorFallbacks,
): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 404 && fallbacks.notFound) {
      return fallbacks.notFound;
    }
    if (err.status === 403 && fallbacks.forbidden) {
      return fallbacks.forbidden;
    }
  }
  return extractApiErrorMessage(err, fallbacks.default);
}

export function showApiErrorSnack(
  snack: MatSnackBar,
  err: unknown,
  fallback: string,
  duration = 4000,
): void {
  snack.open(extractApiErrorMessage(err, fallback), "OK", { duration });
}

export async function showBlobErrorSnack(
  snack: MatSnackBar,
  err: unknown,
  fallback: string,
  duration = 4000,
): Promise<void> {
  const message = await readBlobApiError(err, fallback);
  snack.open(message, "OK", { duration });
}

export function triggerFileDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
