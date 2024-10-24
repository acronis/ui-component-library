import type { AcvBreadcrumbsProps } from './breadcrumbs.ts';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Breadcrumbs from './breadcrumbs.vue';

describe('test Breadcrumbs component', () => {
  it('default props', () => {
    const wrapper = mount(Breadcrumbs);
    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "maxItems": Infinity,
        "multiline": false,
        "separator": undefined,
        "separatorIcon": {
          "__v_isVNode": true,
          "__v_skip": true,
          "anchor": null,
          "appContext": null,
          "children": [
            {
              "__v_isVNode": true,
              "__v_skip": true,
              "anchor": null,
              "appContext": null,
              "children": null,
              "component": null,
              "ctx": null,
              "dirs": null,
              "dynamicChildren": null,
              "dynamicProps": null,
              "el": null,
              "key": null,
              "patchFlag": -1,
              "props": {
                "d": "M5.72 5.625a1 1 0 1 1 1.56-1.25l3 3a1 1 0 0 1 0 1.25l-3 3a1 1 0 1 1-1.56-1.25L8.22 8l-2.5-2.375Z",
                "fill": "currentColor",
              },
              "ref": null,
              "scopeId": null,
              "shapeFlag": 1,
              "slotScopeIds": null,
              "ssContent": null,
              "ssFallback": null,
              "staticCount": 0,
              "suspense": null,
              "target": null,
              "targetAnchor": null,
              "targetStart": null,
              "transition": null,
              "type": "path",
            },
          ],
          "component": null,
          "ctx": null,
          "dirs": null,
          "dynamicChildren": [],
          "dynamicProps": null,
          "el": null,
          "key": null,
          "patchFlag": 0,
          "props": {
            "class": "acv-icon",
            "fill": "none",
            "viewBox": "0 0 16 16",
            "xmlns": "http://www.w3.org/2000/svg",
          },
          "ref": null,
          "scopeId": null,
          "shapeFlag": 17,
          "slotScopeIds": null,
          "ssContent": null,
          "ssFallback": null,
          "staticCount": 0,
          "suspense": null,
          "target": null,
          "targetAnchor": null,
          "targetStart": null,
          "transition": null,
          "type": "svg",
        },
        "size": "md",
      }
    `);
  });

  it('pass props', () => {
    const wrapper = mount(Breadcrumbs, {
      props: {
        title: 'test',
      } as AcvBreadcrumbsProps,
    });

    expect(wrapper.props()).toMatchInlineSnapshot(`
      {
        "maxItems": Infinity,
        "multiline": false,
        "separator": undefined,
        "separatorIcon": {
          "__v_isVNode": true,
          "__v_skip": true,
          "anchor": null,
          "appContext": null,
          "children": [
            {
              "__v_isVNode": true,
              "__v_skip": true,
              "anchor": null,
              "appContext": null,
              "children": null,
              "component": null,
              "ctx": null,
              "dirs": null,
              "dynamicChildren": null,
              "dynamicProps": null,
              "el": null,
              "key": null,
              "patchFlag": -1,
              "props": {
                "d": "M5.72 5.625a1 1 0 1 1 1.56-1.25l3 3a1 1 0 0 1 0 1.25l-3 3a1 1 0 1 1-1.56-1.25L8.22 8l-2.5-2.375Z",
                "fill": "currentColor",
              },
              "ref": null,
              "scopeId": null,
              "shapeFlag": 1,
              "slotScopeIds": null,
              "ssContent": null,
              "ssFallback": null,
              "staticCount": 0,
              "suspense": null,
              "target": null,
              "targetAnchor": null,
              "targetStart": null,
              "transition": null,
              "type": "path",
            },
          ],
          "component": null,
          "ctx": null,
          "dirs": null,
          "dynamicChildren": [],
          "dynamicProps": null,
          "el": null,
          "key": null,
          "patchFlag": 0,
          "props": {
            "class": "acv-icon",
            "fill": "none",
            "viewBox": "0 0 16 16",
            "xmlns": "http://www.w3.org/2000/svg",
          },
          "ref": null,
          "scopeId": null,
          "shapeFlag": 17,
          "slotScopeIds": null,
          "ssContent": null,
          "ssFallback": null,
          "staticCount": 0,
          "suspense": null,
          "target": null,
          "targetAnchor": null,
          "targetStart": null,
          "transition": null,
          "type": "svg",
        },
        "size": "md",
      }
    `);
  });

  it('renders', () => {
    const wrapper = mount(Breadcrumbs);
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<nav data-v-22b64bca="" class="acv-breadcrumbs size-md" aria-label="Breadcrumb" role="navigation">
        <ol data-v-22b64bca="" class=""></ol>
      </nav>"
    `);
  });
});
