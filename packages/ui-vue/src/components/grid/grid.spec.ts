import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h, nextTick } from 'vue';
import AcvCell from '../cell/cell.vue';
import AcvGrid from '../grid/grid.vue';

describe('test grid component', () => {
  it('default props', () => {
    const wrapper = mount(AcvGrid);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "align": "stretch",
        "autoColumns": "auto",
        "autoRows": "auto",
        "cellFlex": false,
        "columns": 24,
        "dense": false,
        "gap": 0,
        "justify": "start",
        "rows": "none",
        "tag": "div",
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(AcvGrid, {
      props: {
        tag: 'dl',
      },
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "align": "stretch",
        "autoColumns": "auto",
        "autoRows": "auto",
        "cellFlex": false,
        "columns": 24,
        "dense": false,
        "gap": 0,
        "justify": "start",
        "rows": "none",
        "tag": "dl",
      }
    `);
  });

  it('render', () => {
    const wrapper = mount(AcvGrid, {
      slots: {
        default: [
          h(AcvCell, { width: 16 }),
          h(AcvCell, { width: 8 }),
        ],
      },
    });
    const cells = wrapper.findAll('.acv-cell');

    expect(wrapper.find('.acv-grid').attributes('style')).toContain(
      'grid-template-columns: repeat(24, 1fr);',
    );
    expect(cells.length).toEqual(2);
    expect(cells[0].attributes('style')).toContain('grid-column-start: span 16;');
    expect(cells[1].attributes('style')).toContain('grid-column-start: span 8;');
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-a143837c="" class="acv-grid acv-grid--start" style="grid-template-columns: repeat(24, 1fr);">
        <div data-v-a7944e7c="" class="acv-cell acv-cell--inherit" style="grid-row-end: span 1; grid-column-start: span 16;"></div>
        <div data-v-a7944e7c="" class="acv-cell acv-cell--inherit" style="grid-row-end: span 1; grid-column-start: span 8;"></div>
      </div>"
    `);
  });

  it('gap', async () => {
    const wrapper = mount(AcvGrid, {
      props: { gap: 16 },
    });

    expect(wrapper.attributes('style')).toContain('gap: 16px;');

    await wrapper.setProps({ gap: [12, 20] });
    expect(wrapper.attributes('style')).toContain('gap: 12px 20px;');
  });

  it('columns', async () => {
    const wrapper = mount(AcvGrid, {
      props: { columns: 10 },
      slots: {
        default: h(AcvCell),
      },
    });

    expect(wrapper.attributes('style')).toContain('grid-template-columns: repeat(10, 1fr);');
    expect(wrapper.find('.acv-cell').attributes('style')).toContain('grid-column-start: span 10;');

    await wrapper.setProps({
      columns: ['300px', 'repeat(2, 1fr)'],
    });
    await nextTick();
    expect(wrapper.attributes('style')).toContain('grid-template-columns: 300px repeat(2, 1fr);');
    // not responsive
    expect(wrapper.find('.acv-cell').attributes('style')).toContain('grid-column-start: span 10;');
  });

  it('justify', () => {
    (['start', 'end', 'center', 'space-around', 'space-between', 'space-evenly'] as const).forEach(
      (justify) => {
        const wrapper = mount(AcvGrid, {
          props: {
            justify,
          },
        });

        expect(wrapper.find('.acv-grid').classes()).toContain(`acv-grid--${justify}`);
      },
    );
  });

  it('align', () => {
    (['top', 'middle', 'bottom', 'stretch'] as const).forEach((align) => {
      const wrapper = mount(AcvGrid, {
        props: {
          align,
        },
      });

      if (align !== 'stretch')
        expect(wrapper.find('.acv-grid').classes()).toContain(`acv-grid--${align}`);
      else
        expect(wrapper.find('.acv-grid').classes()).not.toContain('acv-grid--stretch');
    });
  });

  it('dense', () => {
    const wrapper = mount(AcvGrid, {
      props: {
        dense: true,
      },
    });

    expect(wrapper.find('.acv-grid').classes()).toContain('acv-grid--dense');
  });

  it('tag', () => {
    const wrapper = mount(AcvGrid, {
      props: {
        tag: 'ul',
      },
      slots: {
        default: h(AcvCell, { tag: 'li' }),
      },
    });

    expect(wrapper.find('.acv-grid').element.tagName).toEqual('UL');
    expect(wrapper.find('.acv-cell').element.tagName).toEqual('LI');
  });

  it('free layout', () => {
    const wrapper = mount(AcvGrid, {
      slots: {
        default: [
          h(AcvCell, { left: 0, right: 8 }),
          h(AcvCell, { left: 8, right: 16 }),
          h(AcvCell, { width: 8, top: 1, right: 16 }),
          h(AcvCell, { width: 8, top: 2 }),
          h(AcvCell, { width: 8, top: 2, right: 16 }),
        ],
      },
    });
    const cells = wrapper.findAll('.acv-cell');

    expect(cells.length).toEqual(5);

    // snapshots
    expect(cells[0].attributes('style')).toContain('grid-column-start: 1; grid-column-end: 9;');
    expect(cells[1].attributes('style')).toContain('grid-column-start: 9; grid-column-end: 17;');
    expect(cells[2].attributes('style')).toContain('grid-row-start: 2; grid-row-end: span 1;');
    expect(cells[2].attributes('style')).toContain(
      'grid-column-start: span 8; grid-column-end: 17;',
    );
    expect(cells[3].attributes('style')).toContain('grid-row-start: 3; grid-row-end: span 1;');
    expect(cells[3].attributes('style')).toContain('grid-column-start: span 8;');
    expect(cells[4].attributes('style')).toContain('grid-row-start: 3; grid-row-end: span 1;');
    expect(cells[4].attributes('style')).toContain(
      'grid-column-start: span 8; grid-column-end: 17;',
    );
  });

  it('cell use flex', () => {
    const wrapper = mount(AcvGrid, {
      slots: {
        default: h(AcvCell, { useFlex: true }),
      },
    });

    expect(wrapper.find('.acv-cell').classes()).toContain('acv-cell--flex');
    expect(wrapper.find('.acv-cell').classes()).toContain('acv-cell--start');
    expect(wrapper.find('.acv-cell').classes()).toContain('acv-cell--top');
  });

  it('row cell flex', () => {
    const wrapper = mount(AcvGrid, {
      props: {
        cellFlex: true,
      },
      slots: {
        default: h(AcvCell),
      },
    });

    expect(wrapper.find('.acv-cell').classes()).toContain('acv-cell--flex');
    expect(wrapper.find('.acv-cell').classes()).toContain('acv-cell--start');
    expect(wrapper.find('.acv-cell').classes()).toContain('acv-cell--top');
  });
});
