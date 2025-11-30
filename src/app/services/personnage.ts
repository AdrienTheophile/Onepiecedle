import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonnageModel } from '../models/personnage.model';

@Injectable({
  providedIn: 'root',
})

export class Personnage {
  constructor(private http: HttpClient) {}

  private readonly path = 'https://onepiecedle-api.onrender.com/api/personnages'

  public getPersonnages(): Observable<PersonnageModel[]> {
    return this.http.get<PersonnageModel[]>(this.path);
  }
}
