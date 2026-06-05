import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { RoleCode } from "../auth/auth.models";

export interface RoleOption {
  id: number;
  code: RoleCode;
  libelle: string;
}

@Injectable({ providedIn: "root" })
export class RoleService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/roles`;

  list(): Observable<RoleOption[]> {
    return this.http.get<RoleOption[]>(this.base);
  }
}
