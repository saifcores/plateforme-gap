import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { PageQuery, PageResponse } from "../../core/models/page-response.model";
import { Seance } from "../formations/formation.models";
import { Insertion } from "../insertion/insertion.models";
import { Etudiant, EtudiantRequest } from "./etudiant.models";

@Injectable({ providedIn: "root" })
export class EtudiantService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/etudiants`;

  search(query: PageQuery): Observable<PageResponse<Etudiant>> {
    let params = new HttpParams()
      .set("page", query.page)
      .set("size", query.size);
    if (query.q) {
      params = params.set("q", query.q);
    }
    if (query.sort) {
      params = params.set("sort", query.sort);
    }
    return this.http.get<PageResponse<Etudiant>>(this.base, { params });
  }

  options(): Observable<Etudiant[]> {
    return this.http.get<Etudiant[]>(`${this.base}/options`);
  }

  get(id: number): Observable<Etudiant> {
    return this.http.get<Etudiant>(`${this.base}/${id}`);
  }

  create(payload: EtudiantRequest): Observable<Etudiant> {
    return this.http.post<Etudiant>(this.base, payload);
  }

  update(id: number, payload: EtudiantRequest): Observable<Etudiant> {
    return this.http.put<Etudiant>(`${this.base}/${id}`, payload);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  getMonDossier(): Observable<Etudiant> {
    return this.http.get<Etudiant>(`${this.base}/moi`);
  }

  getMonEmploiDuTemps(): Observable<Seance[]> {
    return this.http.get<Seance[]>(`${this.base}/moi/emploi-du-temps`);
  }

  getMonInsertion(): Observable<Insertion> {
    return this.http.get<Insertion>(`${environment.apiUrl}/insertions/moi`);
  }
}
