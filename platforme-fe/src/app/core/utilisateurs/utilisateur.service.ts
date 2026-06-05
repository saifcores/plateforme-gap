import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { PageQuery, PageResponse } from "../models/page-response.model";
import { RoleCode, Utilisateur } from "../auth/auth.models";

export interface CreateUtilisateurRequest {
  email: string;
  motDePasse: string;
  nom: string;
  prenom: string;
  telephone?: string;
  roles: RoleCode[];
}

export interface UpdateUtilisateurRequest {
  nom: string;
  prenom: string;
  telephone?: string;
  actif: boolean;
  roles: RoleCode[];
  motDePasse?: string;
}

@Injectable({ providedIn: "root" })
export class UtilisateurService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/utilisateurs`;

  search(query: PageQuery): Observable<PageResponse<Utilisateur>> {
    let params = new HttpParams()
      .set("page", query.page)
      .set("size", query.size);
    if (query.q) {
      params = params.set("q", query.q);
    }
    if (query.sort) {
      params = params.set("sort", query.sort);
    }
    return this.http.get<PageResponse<Utilisateur>>(this.base, { params });
  }

  get(id: number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.base}/${id}`);
  }

  create(payload: CreateUtilisateurRequest): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(this.base, payload);
  }

  update(
    id: number,
    payload: UpdateUtilisateurRequest,
  ): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.base}/${id}`, payload);
  }
}
