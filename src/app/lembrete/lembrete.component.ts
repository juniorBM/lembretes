import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import {
  Lembrete,
  Lembretes,
  PrioridadeReceber,
  PrioridadeEnviar,
} from './../models/lembrete';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LembreteService } from '../services/lembrete/lembrete.service';
import { PoModalComponent, PoNotification } from '@po-ui/ng-components';
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
    this.isHideLoading = false;
    this.lembreteService.getLembretes().subscribe({
      next: (res) => {
        console.log('as');

        this.lembretes = res;
        this.isHideLoading = true;
      },
      error: (err) => {
        this.isHideLoading = true;
      },
    });
  }

  @ViewChild('modalCriar', { static: true }) modalCriar!: PoModalComponent;
  @ViewChild('modalEditar', { static: true }) modalEditar!: PoModalComponent;
  @ViewChild('formCriar', { static: true }) formCriar!: NgForm;
  @ViewChild('formEditar', { static: true }) formEditar!: NgForm;

  isHideLoading = true;
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
    this.conteudoInput.valueChanges.pipe(
      debounceTime(300),
      filter(
        (valorDigitado) => valorDigitado.length >= 3 || !valorDigitado.length
      ),
      distinctUntilChanged(),
      switchMap((valorDigitado) => {
        if (!valorDigitado.trim().length) {
          return this.lembreteService.getLembretes().pipe(
            map((res) => {
              this.lembretes = res;
              return res;
            }),
          );
        }

        return this.lembreteService.getLembretesConteudo(valorDigitado).pipe(
          map((res) => {
            this.lembretes = res;
            return res;
          }),
        );
      }),
    ).subscribe();
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
    let titulo = form.value.titulo.trim().length;
    let conteudo = form.value.conteudo.trim().length;

    if (!titulo || !conteudo) {
      this.poNotification.error('Verifique se o Título ou Conteúdo estão preenchidos corretamente!');
      return;
    }

    if (form.valid) {
      this.isHideLoading = false;
      this.lembrete = form.value;
      this.lembreteService.addLembrete(this.lembrete).subscribe({
        next: (res) => {
          res.prioridade =
            PrioridadeReceber[res.prioridade as keyof typeof PrioridadeReceber];
          this.lembretes.unshift(res);
          this.poNotification.success('Lembrete Salvo com Sucesso!');
          this.modalCriar.close();
          this.isHideLoading = true;
        },
        error: (err) => {
          this.isHideLoading = true;
        },
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

    let titulo = form.value.titulo.trim().length;
    let conteudo = form.value.conteudo.trim().length;

    if (!titulo || !conteudo) {
      this.poNotification.error('Verifique se o Título ou Conteúdo estão preenchidos corretamente!', );
      return;
    }

    if (form.valid) {
      this.lembrete = form.value;
      this.isHideLoading = false;

      this.lembreteService.atualizarLembrete(this.lembrete).subscribe({
        next: (res) => {
          res.prioridade =
            PrioridadeReceber[res.prioridade as keyof typeof PrioridadeReceber];
          let itemIndex = this.lembretes.findIndex((item) => item.id == res.id);
          this.lembretes[itemIndex] = res;
          this.poNotification.success('Lembrete Atualizado com Sucesso!');
          this.modalEditar.close();
          this.isHideLoading = true;
        },
        error: (err) => {
          this.isHideLoading = true;
        },
      });
    }
  }

  verMais() {
    this.isHideLoading = false;
    this.lembreteService.getLembretes((this.page += 1)).subscribe({
      next: (res) => {
        if (!res.length) {
          this.semLembretes = true;
        }
        let lembretes = [...this.lembretes, ...res];
        this.lembretes = lembretes;
        this.isHideLoading = true;
      },
      error: (err) => {
        this.isHideLoading = true;
      },
    });
  }
}
