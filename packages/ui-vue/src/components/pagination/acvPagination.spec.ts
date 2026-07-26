import type { AcvPaginationProps } from './acvPagination.ts';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import AcvPagination from './AcvPagination.vue';

describe('test AcvPagination component', () => {
  it('pass accessibility tests', async () => {
    const wrapper = mount(AcvPagination, {
      props: {
        total: 100,
        limit: 10,
        modelValue: 1,
      } as AcvPaginationProps,
    });

    expect(await axe(wrapper.element)).toHaveNoViolations();
  });

  it('default props', () => {
    const wrapper = mount(AcvPagination, {
      props: {
        total: 100,
        limit: 10,
        modelValue: 1,
      } as AcvPaginationProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "limit": 10,
        "modelValue": 1,
        "total": 100,
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(AcvPagination, {
      props: {
        total: 100,
        limit: 10,
        modelValue: 1,
      } as AcvPaginationProps,
    });

    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-d9d2d41b="" class="acv-pagination">
        <!-- Previous page button --><button data-v-7a9642c5="" data-v-d9d2d41b="" type="button" disabled="" aria-disabled="true" class="acv-button acv-button_variant_ghost acv-button_size_medium acv-button_disabled">
          <!--v-if-->
          <!--v-if-->
          <!--v-if--><span data-v-7a9642c5="" class="content"><!-- @slot Default slot content. Usually for text --> ← </span>
          <!--v-if-->
        </button><!-- First page --><button data-v-7a9642c5="" data-v-d9d2d41b="" type="button" class="acv-button acv-button_variant_ghost acv-button_size_medium acv-button_selected">
          <!--v-if-->
          <!--v-if-->
          <!--v-if--><span data-v-7a9642c5="" class="content"><!-- @slot Default slot content. Usually for text -->1</span>
          <!--v-if-->
        </button><!-- Pages 2-5 or ellipsis --><button data-v-7a9642c5="" data-v-d9d2d41b="" type="button" class="acv-button acv-button_variant_ghost acv-button_size_medium">
          <!--v-if-->
          <!--v-if-->
          <!--v-if--><span data-v-7a9642c5="" class="content"><!-- @slot Default slot content. Usually for text -->2</span>
          <!--v-if-->
        </button><button data-v-7a9642c5="" data-v-d9d2d41b="" type="button" class="acv-button acv-button_variant_ghost acv-button_size_medium">
          <!--v-if-->
          <!--v-if-->
          <!--v-if--><span data-v-7a9642c5="" class="content"><!-- @slot Default slot content. Usually for text -->3</span>
          <!--v-if-->
        </button><button data-v-7a9642c5="" data-v-d9d2d41b="" type="button" class="acv-button acv-button_variant_ghost acv-button_size_medium">
          <!--v-if-->
          <!--v-if-->
          <!--v-if--><span data-v-7a9642c5="" class="content"><!-- @slot Default slot content. Usually for text -->4</span>
          <!--v-if-->
        </button><button data-v-7a9642c5="" data-v-d9d2d41b="" type="button" class="acv-button acv-button_variant_ghost acv-button_size_medium">
          <!--v-if-->
          <!--v-if-->
          <!--v-if--><span data-v-7a9642c5="" class="content"><!-- @slot Default slot content. Usually for text -->5</span>
          <!--v-if-->
        </button>
        <div data-v-d9d2d41b="" class="page-group"> ... </div><!-- Last page --><button data-v-7a9642c5="" data-v-d9d2d41b="" type="button" class="acv-button acv-button_variant_ghost acv-button_size_medium">
          <!--v-if-->
          <!--v-if-->
          <!--v-if--><span data-v-7a9642c5="" class="content"><!-- @slot Default slot content. Usually for text -->10</span>
          <!--v-if-->
        </button><!-- Next page button --><button data-v-7a9642c5="" data-v-d9d2d41b="" type="button" class="acv-button acv-button_variant_ghost acv-button_size_medium">
          <!--v-if-->
          <!--v-if-->
          <!--v-if--><span data-v-7a9642c5="" class="content"><!-- @slot Default slot content. Usually for text --> → </span>
          <!--v-if-->
        </button>
      </div>"
    `);
  });
});
