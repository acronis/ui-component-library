import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import MarkupTable from './markupTable.vue';
import type { MarkupTableProps } from './markupTable.ts';

describe('uiMarkupTable', () => {
  it('default props', () => {
    const wrapper = mount(MarkupTable);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "bordered": true,
        "columns": undefined,
        "data": undefined,
        "dense": false,
        "height": undefined,
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(MarkupTable, {
      props: {
        close: true,
        variant: 'success',
      } as MarkupTableProps,
    });
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "bordered": true,
        "columns": undefined,
        "data": undefined,
        "dense": false,
        "height": undefined,
      }
    `);
  });

  it('renders by default', () => {
    const wrapper = mount(MarkupTable);

    expect(wrapper.element).toMatchInlineSnapshot(`
      <div
        class="wrapper"
        data-v-fb7cfc51=""
      >
        <table
          class="acv-table acv-markup-table bordered"
          data-v-fb7cfc51=""
        >
          
          <caption
            data-v-fb7cfc51=""
          >
            
             Students list 
            
          </caption>
          <thead
            class=""
            data-v-fb7cfc51=""
          >
            <tr
              data-v-fb7cfc51=""
            >
              
              
            </tr>
            <tr
              data-v-fb7cfc51=""
            >
              
              
            </tr>
          </thead>
          <tbody
            data-v-fb7cfc51=""
          >
            
            
          </tbody>
          
        </table>
      </div>
    `);
  });
});
