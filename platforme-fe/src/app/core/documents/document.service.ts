import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable, map } from "rxjs";

import { environment } from "../../../environments/environment";

export interface StoredDocument {
  id: number;
  nom: string;
  typeMime?: string;
  url: string;
  taille?: number;
  module?: string;
  entiteId?: number;
  createdAt?: string;
}

@Injectable({ providedIn: "root" })
export class DocumentService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/documents`;

  upload(file: File, module?: string): Observable<StoredDocument> {
    const formData = new FormData();
    formData.append("file", file);
    if (module) {
      formData.append("module", module);
    }
    return this.http.post<StoredDocument>(this.base, formData);
  }

  resolveUrl(url: string): string {
    if (url.startsWith("http")) {
      return url;
    }
    const origin = environment.apiUrl.replace(/\/api$/, "");
    return `${origin}${url}`;
  }

  download(url: string, filename?: string): void {
    const fullUrl = this.resolveUrl(url);
    this.http
      .get(fullUrl, { responseType: "blob", observe: "response" })
      .subscribe({
        next: (response: HttpResponse<Blob>) => {
          const blob = response.body;
          if (!blob) {
            return;
          }
          const objectUrl = URL.createObjectURL(blob);
          const anchor = document.createElement("a");
          anchor.href = objectUrl;
          anchor.download = filename ?? "document";
          anchor.click();
          URL.revokeObjectURL(objectUrl);
        },
      });
  }

  extractFilename(url: string): string {
    return url.split("/").pop() ?? "document";
  }

  isManagedDocument(url?: string | null): boolean {
    return !!url?.includes("/api/documents/");
  }
}
