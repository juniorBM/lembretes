import {
  Lembrete,
  Lembretes,
  PrioridadeReceber,
  PrioridadeEnviar,
} from './../models/lembrete';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LembreteService } from '../services/lembrete/lembrete.service';
import { PoModalComponent } from '@po-ui/ng-components';
import { FormControl, NgForm } from '@angular/forms';
import { PoNotificationService } from '@po-ui/ng-components';

@Component({
  selector: 'app-lembrete',
  templateUrl: './lembrete.component.html',
  styleUrls: ['./lembrete.component.scss'],
})

export class LembreteComponent implements OnInit {
  constructor(
    private lembreteService: LembreteService,
    private poNotification: PoNotificationService
  ) {}

  ngOnInit(): void {
    this.lembreteService.getLembretes().subscribe({
      next: (res) => {
        this.lembretes = res;
      },
    });
  }

  @ViewChild('modalCriar', { static: true }) modalCriar!: PoModalComponent;
  @ViewChild('modalEditar', { static: true }) modalEditar!: PoModalComponent;
  @ViewChild('formCriar', { static: true }) formCriar!: NgForm;
  @ViewChild('formEditar', { static: true }) formEditar!: NgForm;

  lembrete: Lembrete = { id: '', titulo: '', prioridade: '', conteudo: '' };
  lembretes: Lembretes = [];
  page: number = 1;
  semLembretes: boolean = false;
  conteudoInput = new FormControl();

  validateFields: Array<string> = ['titulo', 'conteudo'];

  fieldsCreate = this.lembreteService.getCamposForm(false);
  fieldsEdit = this.lembreteService.getCamposForm(true);
  columns = this.lembreteService.getCamposTabela(this.edit.bind(this));

  filtro() {
    this.conteudoInput.valueChanges.subscribe((value) => {
      value = value.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      if (value.length >= 3) {
        setTimeout(() => {
          this.lembreteService.getLembretesConteudo(value).subscribe({
            next: (res) => {
              if (res.length) {
                this.semLembretes = true;
              }
              this.lembretes = res;
            },
          });
        }, 300);
      } else if (!value.length) {
        this.lembreteService.getLembretes().subscribe({
          next: (res) => {
            this.lembretes = res;
            this.semLembretes = false;
          },
        });
      }
    });
  }

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
        res.prioridade = PrioridadeReceber[res.prioridade as keyof typeof PrioridadeReceber];
        this.lembretes.unshift(res);
        this.poNotification.success('Lembrete Salvo com Sucesso!');
        this.modalCriar.close();
      });
    }
  }

  edit(row: Lembrete) {
    this.lembrete.id = row.id;
    this.lembrete.titulo = row.titulo;
    this.lembrete.prioridade =
      PrioridadeEnviar[row.prioridade as keyof typeof PrioridadeEnviar];
    this.lembrete.conteudo = row.conteudo;
    this.modalEditar.open();
  }

  atualizarLembrete() {
    let form = this.formEditar.form;

    if (form.valid) {
      this.lembrete = form.value;

      this.lembreteService.atualizarLembrete(this.lembrete).subscribe((res) => {
        res.prioridade =
          PrioridadeReceber[res.prioridade as keyof typeof PrioridadeReceber];
        let itemIndex = this.lembretes.findIndex((item) => item.id == res.id);
        this.lembretes[itemIndex] = res;
        this.poNotification.success('Lembrete Atualizado com Sucesso!');
        this.modalEditar.close();
      });
    }
  }

  verMais() {
    this.lembreteService.getLembretes((this.page += 1)).subscribe({
      next: (res) => {
        if (!res.length) {
          this.semLembretes = true;
        }
        let lembretes = [...this.lembretes, ...res];
        this.lembretes = lembretes;
      },
    });
  }
}
