import {
  setAllLembretes,
  addLembrete,
} from './../store/actions/lembrete.actions';
import { Lembrete, Lembretes, PrioridadeReceber, PrioridadeEnviar } from './../models/lembrete';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  NgForm,
  FormBuilder,
  Validators,
} from '@angular/forms';
import {
  PoPageDynamicTableComponent,
  PoPageDynamicTableCustomAction,
  PoPageDynamicTableOptions,
} from '@po-ui/ng-templates';
import { select, Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { LembreteService } from '../services/lembrete/lembrete.service';
import {
  PoComboOption,
  PoDynamicFormField,
  PoDynamicFormFieldChanged,
  PoDynamicFormLoad,
  PoDynamicFormValidation,
  PoModalComponent,
  PoNotificationService,
  PoTableColumn,
} from '@po-ui/ng-components';
import { PoFieldModule } from '@po-ui/ng-components';

@Component({
  selector: 'app-lembrete',
  templateUrl: './lembrete.component.html',
  styleUrls: ['./lembrete.component.scss'],
})
export class LembreteComponent implements OnInit {
  @ViewChild(PoModalComponent, { static: true }) poModal!: PoModalComponent;
  @ViewChild('dynamicForm', { static: true }) form!: NgForm;

  lembrete: Lembrete = { titulo: '', prioridade: '', conteudo: '' };
  isEdit:boolean = false;

  validateFields: Array<string> = ['titulo', 'conteudo'];

  fields: Array<PoDynamicFormField> = [
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
      // disabled: true,
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

  readonly columns: Array<PoTableColumn> = [
    {
      property: 'titulo',
      label: 'Título',
    },
    { property: 'prioridade', label: 'prioriade' },
    { property: 'conteudo', label: 'Conteúdo' },
    {
      property: 'acao',
      label: 'Ações',
      type: 'icon',
      sortable: false,
      icons: [
        {
          action: this.edit.bind(this),
          color: 'color-08',
          icon: 'po-icon-edit',
          tooltip: 'Editar Lembrete',
          value: 'editar'
        },
      ]
    }

  ];

  onChangeFields(changedValue: PoDynamicFormFieldChanged) {}

  onLoadFields(a:any): PoDynamicFormLoad {
    console.log(this.isEdit);

    let doc = {
      fields: [
        { property: 'prioridade', disabled: this.isEdit}
      ],
      // focus: 'titulo'
    };

    return doc;

  }

  lembretes: Lembretes = [];

  constructor(
    private store: Store<{ lembretes: Lembrete[] }>,
    private lembreteService: LembreteService,
    private fb: FormBuilder,
    public poNotification: PoNotificationService
  ) {}

  ngOnInit(): void {
    this.lembreteService.getLembretes().subscribe({
      next: (res) => {
        this.lembretes = res;
        // this.store.dispatch(setAllLembretes({ payload: res }));
      },
    });
  }

  openModal() {
    this.lembrete.titulo = '';
    this.lembrete.prioridade = '';
    this.lembrete.conteudo = '';
    this.poModal.open();
    this.fields = [
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
        disabled: false,
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
  }

  closeModal() {
    this.isEdit = false;
    this.poModal.close();
    console.log('asd');
  }

  salvarLembrete() {
    let form = this.form.form;

    if (form.valid) {
      this.lembrete = form.value;
      this.lembreteService.addLembrete(this.lembrete).subscribe((res) => {
        // this.store.dispatch(addLembrete({ payload: res }));
      });
    }
  }

  edit(row: any) {
    this.fields = [
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
        disabled: true,
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
    this.lembrete.titulo = row.titulo;
    this.lembrete.prioridade = PrioridadeEnviar[row.prioridade as keyof typeof PrioridadeEnviar];
    this.lembrete.conteudo = row.conteudo;
    this.isEdit = true;
    this.onLoadFields(row);
    this.poModal.open();
  }


}
