import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { PageQuery, PageResponse } from "../../core/models/page-response.model";
import {
  AssignFormateurRequest,
  Formateur,
  FormateurRequest,
  Formation,
  FormationFormateurLink,
  FormationRequest,
  Reunion,
  ReunionRequest,
  Seance,
  SeanceRequest,
  StatGenre,
} from "./formation.models";

@Injectable({ providedIn: "root" })
export class FormationService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/formations`;
  private readonly formateursUrl = `${environment.apiUrl}/formateurs`;

  search(query: PageQuery): Observable<PageResponse<Formation>> {
    let params = new HttpParams()
      .set("page", query.page)
      .set("size", query.size);
    if (query.q) {
      params = params.set("q", query.q);
    }
    if (query.sort) {
      params = params.set("sort", query.sort);
    }
    return this.http.get<PageResponse<Formation>>(this.base, { params });
  }

  options(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.base}/options`);
  }

  get(id: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.base}/${id}`);
  }

  create(payload: FormationRequest): Observable<Formation> {
    return this.http.post<Formation>(this.base, payload);
  }

  update(id: number, payload: FormationRequest): Observable<Formation> {
    return this.http.put<Formation>(`${this.base}/${id}`, payload);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  statsGenre(formationId: number): Observable<StatGenre[]> {
    return this.http.get<StatGenre[]>(
      `${this.base}/${formationId}/stats-genre`,
    );
  }

  formateursAffectes(
    formationId: number,
  ): Observable<FormationFormateurLink[]> {
    return this.http.get<FormationFormateurLink[]>(
      `${this.base}/${formationId}/formateurs`,
    );
  }

  affecterFormateur(
    formationId: number,
    payload: AssignFormateurRequest,
  ): Observable<FormationFormateurLink> {
    return this.http.post<FormationFormateurLink>(
      `${this.base}/${formationId}/formateurs`,
      payload,
    );
  }

  retirerFormateur(formationId: number, formateurId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.base}/${formationId}/formateurs/${formateurId}`,
    );
  }

  seances(formationId: number): Observable<Seance[]> {
    return this.http.get<Seance[]>(`${this.base}/${formationId}/seances`);
  }

  createSeance(
    formationId: number,
    payload: SeanceRequest,
  ): Observable<Seance> {
    return this.http.post<Seance>(
      `${this.base}/${formationId}/seances`,
      payload,
    );
  }

  updateSeance(
    formationId: number,
    seanceId: number,
    payload: SeanceRequest,
  ): Observable<Seance> {
    return this.http.put<Seance>(
      `${this.base}/${formationId}/seances/${seanceId}`,
      payload,
    );
  }

  removeSeance(formationId: number, seanceId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.base}/${formationId}/seances/${seanceId}`,
    );
  }

  searchFormateurs(query: PageQuery): Observable<PageResponse<Formateur>> {
    let params = new HttpParams()
      .set("page", query.page)
      .set("size", query.size);
    if (query.q) {
      params = params.set("q", query.q);
    }
    if (query.sort) {
      params = params.set("sort", query.sort);
    }
    return this.http.get<PageResponse<Formateur>>(this.formateursUrl, {
      params,
    });
  }

  formateursOptions(): Observable<Formateur[]> {
    return this.http.get<Formateur[]>(`${this.formateursUrl}/options`);
  }

  getFormateur(id: number): Observable<Formateur> {
    return this.http.get<Formateur>(`${this.formateursUrl}/${id}`);
  }

  createFormateur(payload: FormateurRequest): Observable<Formateur> {
    return this.http.post<Formateur>(this.formateursUrl, payload);
  }

  updateFormateur(
    id: number,
    payload: FormateurRequest,
  ): Observable<Formateur> {
    return this.http.put<Formateur>(`${this.formateursUrl}/${id}`, payload);
  }

  deleteFormateur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.formateursUrl}/${id}`);
  }

  reunions(formationId: number): Observable<Reunion[]> {
    return this.http.get<Reunion[]>(`${this.base}/${formationId}/reunions`);
  }

  createReunion(
    formationId: number,
    payload: ReunionRequest,
  ): Observable<Reunion> {
    return this.http.post<Reunion>(
      `${this.base}/${formationId}/reunions`,
      payload,
    );
  }

  updateReunion(
    formationId: number,
    reunionId: number,
    payload: ReunionRequest,
  ): Observable<Reunion> {
    return this.http.put<Reunion>(
      `${this.base}/${formationId}/reunions/${reunionId}`,
      payload,
    );
  }

  removeReunion(formationId: number, reunionId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.base}/${formationId}/reunions/${reunionId}`,
    );
  }
}
