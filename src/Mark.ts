import { Mark } from '@tiptap/core';

export const Interim = Mark.create({
    name: 'interim',
  
    addAttributes() {
      return {
        id: {
          default: null,
        },
      };
    },
  
    parseHTML() {
      return [
        {
          tag: 'span[data-interim-id]',
        },
      ];
    },
  
    renderHTML({ HTMLAttributes }) {
      return ['span', {
        ...HTMLAttributes,
        style: 'color: gray; font-style: italic;',
        'data-interim-id': HTMLAttributes.id,
      }, 0];
    },
  });
  