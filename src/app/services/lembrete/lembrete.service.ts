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
  url = 'https://qcpadrao.mazzafc.tech/lembretes';

  getLembretes(page:number = 1): Observable<Lembretes> {
    return this.httpClient
      .get<Lembretes>(this.url+'?_page='+page+'&_sort=id&_order=desc')
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
      .get<Lembretes>(this.url+'?q='+q+'&_sort=id&_order=desc')
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

  addLembrete(lembrete: Lembrete): Observable<Lembrete>  {
    lembrete.acao = ['editar'];
    return this.httpClient
      .post<Lembrete>(this.url, lembrete);
  }

  atualizarLembrete(lembrete: Lembrete): Observable<Lembrete>  {
    console.log(lembrete);
    lembrete.acao = ['editar'];
    return this.httpClient
      .put<Lembrete>(this.url+'/'+lembrete.id, lembrete);
  }

  getCamposForm(desabilitarPrioridade: boolean) {

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
        errorMessage: 'M??nimo de 4 caracteres',
      },
      {
        property: 'prioridade',
        required: true,
        gridColumns: 6,
        disabled: desabilitarPrioridade,
        options: [
          { label: 'Baixa', value: 'baixa' },
          { label: 'M??dia', value: 'media' },
          { label: 'Alta', value: 'alta' },
        ],
      },
      {
        required: true,
        property: 'conteudo',
        label: 'Conte??do',
        gridColumns: 12,
        gridSmColumns: 12,
        maxLength: 100,
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
        label: 'T??tulo',
      },
      { property: 'prioridade', label: 'Prioriade' },
      { property: 'conteudo', label: 'Conte??do' },
      {
        property: 'acao',
        label: 'A????es',
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
