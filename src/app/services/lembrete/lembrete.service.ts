import { Lembrete, LembreteApi, Lembretes, PrioridadeReceber } from './../../models/lembrete';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, pluck, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LembreteService {

  constructor(private httpClient: HttpClient) { }

  getLembretes(): Observable<Lembretes> {
    return this.httpClient
      .get<Lembretes>('http://localhost:3000/lembretes?_page=1&_limit=10')
      .pipe(
        map((res) => {
          res.map((item) => {
            item.prioridade = PrioridadeReceber[item.prioridade as keyof typeof PrioridadeReceber];
          });


          return res;
        }),
        catchError(err => {
          throw 'Detalhes do erro ' + err;
        })
      );
  }

  addLembrete(lembrete: Lembrete) {
    console.log(lembrete);

    return this.httpClient
      .post<Lembrete>('http://localhost:3000/lembretes', lembrete);
  }
}
