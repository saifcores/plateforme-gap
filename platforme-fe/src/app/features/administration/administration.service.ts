import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import {
  Budget,
  Circulaire,
  Courrier,
  NoteAdministrative,
  NoteService,
  Personnel,
} from "./administration.models";

@Injectable({ providedIn: "root" })
export class AdministrationService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  // Courriers
  listCourriers(): Observable<Courrier[]> {
    return this.http.get<Courrier[]>(`${this.api}/courriers`);
  }
  getCourrier(id: number): Observable<Courrier> {
    return this.http.get<Courrier>(`${this.api}/courriers/${id}`);
  }
  createCourrier(p: Partial<Courrier>): Observable<Courrier> {
    return this.http.post<Courrier>(`${this.api}/courriers`, p);
  }
  updateCourrier(id: number, p: Partial<Courrier>): Observable<Courrier> {
    return this.http.put<Courrier>(`${this.api}/courriers/${id}`, p);
  }
  deleteCourrier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/courriers/${id}`);
  }

  // Notes administratives
  listNotesAdministratives(): Observable<NoteAdministrative[]> {
    return this.http.get<NoteAdministrative[]>(
      `${this.api}/notes-administratives`,
    );
  }
  getNoteAdministrative(id: number): Observable<NoteAdministrative> {
    return this.http.get<NoteAdministrative>(
      `${this.api}/notes-administratives/${id}`,
    );
  }
  createNoteAdministrative(
    p: Partial<NoteAdministrative>,
  ): Observable<NoteAdministrative> {
    return this.http.post<NoteAdministrative>(
      `${this.api}/notes-administratives`,
      p,
    );
  }
  updateNoteAdministrative(
    id: number,
    p: Partial<NoteAdministrative>,
  ): Observable<NoteAdministrative> {
    return this.http.put<NoteAdministrative>(
      `${this.api}/notes-administratives/${id}`,
      p,
    );
  }
  deleteNoteAdministrative(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/notes-administratives/${id}`);
  }

  // Notes de service
  listNotes(): Observable<NoteService[]> {
    return this.http.get<NoteService[]>(`${this.api}/notes-service`);
  }
  getNote(id: number): Observable<NoteService> {
    return this.http.get<NoteService>(`${this.api}/notes-service/${id}`);
  }
  createNote(p: Partial<NoteService>): Observable<NoteService> {
    return this.http.post<NoteService>(`${this.api}/notes-service`, p);
  }
  updateNote(id: number, p: Partial<NoteService>): Observable<NoteService> {
    return this.http.put<NoteService>(`${this.api}/notes-service/${id}`, p);
  }
  deleteNote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/notes-service/${id}`);
  }

  // Circulaires
  listCirculaires(): Observable<Circulaire[]> {
    return this.http.get<Circulaire[]>(`${this.api}/circulaires`);
  }
  getCirculaire(id: number): Observable<Circulaire> {
    return this.http.get<Circulaire>(`${this.api}/circulaires/${id}`);
  }
  createCirculaire(p: Partial<Circulaire>): Observable<Circulaire> {
    return this.http.post<Circulaire>(`${this.api}/circulaires`, p);
  }
  updateCirculaire(id: number, p: Partial<Circulaire>): Observable<Circulaire> {
    return this.http.put<Circulaire>(`${this.api}/circulaires/${id}`, p);
  }
  deleteCirculaire(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/circulaires/${id}`);
  }

  // Personnel
  listPersonnels(): Observable<Personnel[]> {
    return this.http.get<Personnel[]>(`${this.api}/personnels`);
  }
  getPersonnel(id: number): Observable<Personnel> {
    return this.http.get<Personnel>(`${this.api}/personnels/${id}`);
  }
  createPersonnel(p: Partial<Personnel>): Observable<Personnel> {
    return this.http.post<Personnel>(`${this.api}/personnels`, p);
  }
  updatePersonnel(id: number, p: Partial<Personnel>): Observable<Personnel> {
    return this.http.put<Personnel>(`${this.api}/personnels/${id}`, p);
  }
  deletePersonnel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/personnels/${id}`);
  }

  // Budgets
  listBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.api}/budgets`);
  }
  getBudget(id: number): Observable<Budget> {
    return this.http.get<Budget>(`${this.api}/budgets/${id}`);
  }
  createBudget(p: Partial<Budget>): Observable<Budget> {
    return this.http.post<Budget>(`${this.api}/budgets`, p);
  }
  updateBudget(id: number, p: Partial<Budget>): Observable<Budget> {
    return this.http.put<Budget>(`${this.api}/budgets/${id}`, p);
  }
  deleteBudget(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/budgets/${id}`);
  }

  exportBudgetPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.api}/budgets/${id}/export/pdf`, {
      responseType: "blob",
    });
  }

  exportBudgetExcel(id: number): Observable<Blob> {
    return this.http.get(`${this.api}/budgets/${id}/export/excel`, {
      responseType: "blob",
    });
  }
}
