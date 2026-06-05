import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { PageResponse } from "../../core/models/page-response.model";
import { CompteRendu, CompteRenduRequest } from "./communication.models";

export interface CompteRenduSearchQuery {
  page: number;
  size: number;
  q?: string;
  type?: string;
  auteur?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: string;
}

@Injectable({ providedIn: "root" })
export class CommunicationService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/comptes-rendus`;

  search(query: CompteRenduSearchQuery): Observable<PageResponse<CompteRendu>> {
    let params = new HttpParams()
      .set("page", query.page)
      .set("size", query.size);
    if (query.q) {
      params = params.set("q", query.q);
    }
    if (query.type) {
      params = params.set("type", query.type);
    }
    if (query.auteur) {
      params = params.set("auteur", query.auteur);
    }
    if (query.dateFrom) {
      params = params.set("dateFrom", query.dateFrom);
    }
    if (query.dateTo) {
      params = params.set("dateTo", query.dateTo);
    }
    if (query.sort) {
      params = params.set("sort", query.sort);
    }
    return this.http.get<PageResponse<CompteRendu>>(this.base, { params });
  }

  get(id: number): Observable<CompteRendu> {
    return this.http.get<CompteRendu>(`${this.base}/${id}`);
  }

  create(payload: CompteRenduRequest): Observable<CompteRendu> {
    return this.http.post<CompteRendu>(this.base, payload);
  }

  update(id: number, payload: CompteRenduRequest): Observable<CompteRendu> {
    return this.http.put<CompteRendu>(`${this.base}/${id}`, payload);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
