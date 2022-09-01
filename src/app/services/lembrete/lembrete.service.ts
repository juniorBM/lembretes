import { Lembrete, LembreteApi, Lembretes, PrioridadeReceber } from './../../models/lembrete';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PoDynamicFormField, PoTableColumn } from '@po-ui/ng-components';


@Injectable({
  providedIn: 'root'
})
export class LembreteService {

  constructor(private httpClient: HttpClient) { }

  getLembretes(page:number = 1): Observable<Lembretes> {
    return this.httpClient
      .get<Lembretes>('http://localhost:3000/lembretes?_page='+page+'&_limit=10')
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

  getLembretesConteudo(q: string): Observable<Lembretes> {

    return this.httpClient
      .get<Lembretes>('http://localhost:3000/lembretes?q='+q)
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
    lembrete.acao = ['editar'];
    return this.httpClient
      .post<Lembrete>('http://localhost:3000/lembretes', lembrete);
  }

  atualizarLembrete(lembrete: Lembrete) {
    console.log(lembrete);
    lembrete.acao = ['editar'];
    return this.httpClient
      .put<Lembrete>('http://localhost:3000/lembretes/'+lembrete.id, lembrete);
  }

  getCamposForm(desabilitarPrioridade: boolean) {
    console.log(desabilitarPrioridade);

    let fields: Array<PoDynamicFormField> = [
      {
        property: 'id',
        required: true,
        order: 1,
        placeholder: '',
        visible: desabilitarPrioridade,
        disabled: desabilitarPrioridade,
      },
      {
        property: 'titulo',
        required: true,
        minLength: 4,
        maxLength: 50,
        gridColumns: 12,
        gridSmColumns: 12,
        order: 1,
        placeholder: '',
        errorMessage: 'Mínimo de 4 caracteres',
      },
      {
        property: 'prioridade',
        required: true,
        gridColumns: 6,
        disabled: desabilitarPrioridade,
        options: [
          { label: 'Baixa', value: 'baixa' },
          { label: 'Média', value: 'media' },
          { label: 'Alta', value: 'alta' },
        ],
      },
      {
        required: true,
        property: 'conteudo',
        label: 'Conteúdo',
        gridColumns: 12,
        gridSmColumns: 12,
        rows: 5,
        placeholder: '',
      },
    ];

    return fields;
  }

  getCamposTabela(func: any) {
    let columns: Array<PoTableColumn> = [
      {
        property: 'titulo',
        label: 'Título',
      },
      { property: 'prioridade', label: 'Prioriade' },
      { property: 'conteudo', label: 'Conteúdo' },
      {
        property: 'acao',
        label: 'Ações',
        type: 'icon',
        sortable: false,
        icons: [
          {
            action: func,
            color: 'color-08',
            icon: 'po-icon-edit',
            tooltip: 'Editar Lembrete',
            value: 'editar'
          },
        ]
      }

    ];

    return columns;
  }
}
