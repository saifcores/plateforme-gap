import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import {
  Insertion,
  InsertionStats,
  Partenaire,
  RegistreContact,
  Stage,
} from "./insertion.models";

@Injectable({ providedIn: "root" })
export class InsertionService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  // Partenaires
  listPartenaires(): Observable<Partenaire[]> {
    return this.http.get<Partenaire[]>(`${this.api}/partenaires`);
  }
  getPartenaire(id: number): Observable<Partenaire> {
    return this.http.get<Partenaire>(`${this.api}/partenaires/${id}`);
  }
  createPartenaire(p: Partial<Partenaire>): Observable<Partenaire> {
    return this.http.post<Partenaire>(`${this.api}/partenaires`, p);
  }
  updatePartenaire(id: number, p: Partial<Partenaire>): Observable<Partenaire> {
    return this.http.put<Partenaire>(`${this.api}/partenaires/${id}`, p);
  }
  deletePartenaire(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/partenaires/${id}`);
  }

  // Stages
  listStages(): Observable<Stage[]> {
    return this.http.get<Stage[]>(`${this.api}/stages`);
  }
  getStage(id: number): Observable<Stage> {
    return this.http.get<Stage>(`${this.api}/stages/${id}`);
  }
  createStage(p: Partial<Stage>): Observable<Stage> {
    return this.http.post<Stage>(`${this.api}/stages`, p);
  }
  updateStage(id: number, p: Partial<Stage>): Observable<Stage> {
    return this.http.put<Stage>(`${this.api}/stages/${id}`, p);
  }
  deleteStage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/stages/${id}`);
  }

  // Registre contacts
  listContacts(): Observable<RegistreContact[]> {
    return this.http.get<RegistreContact[]>(`${this.api}/registre-contacts`);
  }
  getContact(id: number): Observable<RegistreContact> {
    return this.http.get<RegistreContact>(
      `${this.api}/registre-contacts/${id}`,
    );
  }
  createContact(p: Partial<RegistreContact>): Observable<RegistreContact> {
    return this.http.post<RegistreContact>(`${this.api}/registre-contacts`, p);
  }
  updateContact(
    id: number,
    p: Partial<RegistreContact>,
  ): Observable<RegistreContact> {
    return this.http.put<RegistreContact>(
      `${this.api}/registre-contacts/${id}`,
      p,
    );
  }
  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/registre-contacts/${id}`);
  }

  // Insertions
  listInsertions(): Observable<Insertion[]> {
    return this.http.get<Insertion[]>(`${this.api}/insertions`);
  }
  getInsertion(id: number): Observable<Insertion> {
    return this.http.get<Insertion>(`${this.api}/insertions/${id}`);
  }
  createInsertion(p: Partial<Insertion>): Observable<Insertion> {
    return this.http.post<Insertion>(`${this.api}/insertions`, p);
  }
  updateInsertion(id: number, p: Partial<Insertion>): Observable<Insertion> {
    return this.http.put<Insertion>(`${this.api}/insertions/${id}`, p);
  }
  deleteInsertion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/insertions/${id}`);
  }

  // Stats & exports
  stats(): Observable<InsertionStats> {
    return this.http.get<InsertionStats>(`${this.api}/insertions/stats`);
  }
  exportPdf(): Observable<Blob> {
    return this.http.get(`${this.api}/insertions/export/pdf`, {
      responseType: "blob",
    });
  }
  exportExcel(): Observable<Blob> {
    return this.http.get(`${this.api}/insertions/export/excel`, {
      responseType: "blob",
    });
  }
}
