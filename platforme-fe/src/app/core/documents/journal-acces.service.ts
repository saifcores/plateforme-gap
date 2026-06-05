import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";

export interface JournalEntry {
  id: number;
  documentId: number;
  documentNom: string;
  utilisateurEmail?: string;
  utilisateurNom?: string;
  action: string;
  accedeLe: string;
}

@Injectable({ providedIn: "root" })
export class JournalAccesService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/journal-acces-documents`;

  list(): Observable<JournalEntry[]> {
    return this.http.get<JournalEntry[]>(this.base);
  }

  exportExcel(): Observable<Blob> {
    return this.http.get(`${this.base}/export/excel`, {
      responseType: "blob",
    });
  }
}
