import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface MensagemChat {
  autor: 'usuario' | 'agente';
  texto: string;
}

@Component({
  selector: 'app-agente-ia',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './agente-ia.component.html',
  styleUrl: './agente-ia.component.scss',
})
export class AgenteIaComponent {
  pergunta = '';
  enviando = signal(false);

  mensagens = signal<MensagemChat[]>([
    {
      autor: 'agente',
      texto:
        'Olá! Sou o Agente IA do Portal de Sistemas. Posso ajudar com dúvidas sobre sistemas, acessos e navegação no portal.',
    },
  ]);

  enviar(): void {
    const texto = this.pergunta.trim();
    if (!texto || this.enviando()) return;

    this.mensagens.update(msgs => [...msgs, { autor: 'usuario', texto }]);
    this.pergunta = '';
    this.enviando.set(true);

    setTimeout(() => {
      this.mensagens.update(msgs => [
        ...msgs,
        {
          autor: 'agente',
          texto:
            'Recebi sua mensagem. Em breve esta integração estará conectada ao assistente corporativo da Caixa. Enquanto isso, use o menu Buscar ou Chat CAIXA para mais suporte.',
        },
      ]);
      this.enviando.set(false);
    }, 800);
  }
}
