export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  useMock: true,
  /** Link do Chat CAIXA (chatbot) no Microsoft Teams — ajuste conforme URL do tenant Caixa */
  chatCaixaTeamsUrl:
    'https://teams.microsoft.com/l/chat/0/0?topicName=Chat%20CAIXA&message=Ol%C3%A1',
  /** Agente IA personalizado no Microsoft Teams */
  agenteIaTeamsUrl:
    'https://teams.microsoft.com/l/app/?source=app-details-dialog&sharedAppResource=TaosSharedApp&titleId=T_ae38be8b-8a0d-b01b-da42-f0a0347d438a',
};
