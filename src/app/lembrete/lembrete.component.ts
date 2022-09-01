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

  @ViewChild('modalCriar', { static: true }) modalCriar!: PoModalComponent;
  @ViewChild('modalEditar', { static: true }) modalEditar!: PoModalComponent;
  @ViewChild('formCriar', { static: true }) formCriar!: NgForm;
  @ViewChild('formEditar', { static: true }) formEditar!: NgForm;

  lembrete: Lembrete = { titulo: '', prioridade: '', conteudo: '' };
  lembretes: Lembretes = [];
  page: number = 1;
  semLembretes: boolean = false;

  validateFields: Array<string> = ['titulo', 'conteudo'];

  fieldsCreate = this.lembreteService.getCamposForm(false);
  fieldsEdit = this.lembreteService.getCamposForm(true);
  columns = this.lembreteService.getCamposTabela(this.edit.bind(this));



  openModal() {
    this.lembrete.titulo = '';
    this.lembrete.prioridade = '';
    this.lembrete.conteudo = '';
    this.modalCriar.open();
  }

  closeModal() {
    this.modalCriar.close();
  }

  salvarLembrete() {
    let form = this.formCriar.form;

    if (form.valid) {
      this.lembrete = form.value;
      this.lembreteService.addLembrete(this.lembrete).subscribe((res) => {
        // this.store.dispatch(addLembrete({ payload: res }));
      });
    }
  }

  edit(row: any) {
    this.lembrete.titulo = row.titulo;
    this.lembrete.prioridade = PrioridadeEnviar[row.prioridade as keyof typeof PrioridadeEnviar];
    this.lembrete.conteudo = row.conteudo;
    this.modalEditar.open();
  }

  atualizarLembrete() {
    let form = this.formEditar.form;

    if (form.valid) {
      this.lembrete = form.value;

      // this.lembreteService.addLembrete(this.lembrete).subscribe((res) => {
      //   // this.store.dispatch(addLembrete({ payload: res }));
      // });
    }
  }

  verMais() {

    this.lembreteService.getLembretes(this.page+=1).subscribe({
      next: (res) => {
        console.log(res);
        if (!res.length) {
          this.semLembretes = true;
        }
        let lembretes = [...this.lembretes, ...res];
        this.lembretes = lembretes;
      },
    });
  }


}
