export const menus = {
  0: {
    message: 'Olá! Já estou te encaminhando para um de nossos consultores. ',
  },
  1: {
    message: 'Any text',
    options: [{ id: 0, text: 'Back' }],
  },
  2: {
    message: 'Aguarde alguns instantes.',
  },
};

export interface States {
  name: string;
  idClient: string;
  currentMenu: number;
}

export const conversationState: States[] = [];
