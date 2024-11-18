import type { AcvMarkupTableProps } from '@/components/__dev__/markup-table/markupTable.ts';
import MarkupTable from '@/components/__dev__/markup-table/markupTable.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

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
      } as AcvMarkupTableProps,
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
        style="--fb7cfc51-tableHeight: 100%; --fb7cfc51-gridColumns: repeat(auto-fit, minmax(250px, 1fr));"
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
