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
                "d": "M5.7192 5.6247c-.345-.4312-.2751-1.0605.1561-1.4055.4313-.345 1.0606-.2751 1.4056.1561l3 3a1 1 0 0 1 0 1.2494l-3 3c-.345.4313-.9743.5012-1.4056.1562-.4312-.345-.5011-.9743-.1561-1.4056L8.2194 8 5.7192 5.6247Z",
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
                "d": "M5.7192 5.6247c-.345-.4312-.2751-1.0605.1561-1.4055.4313-.345 1.0606-.2751 1.4056.1561l3 3a1 1 0 0 1 0 1.2494l-3 3c-.345.4313-.9743.5012-1.4056.1562-.4312-.345-.5011-.9743-.1561-1.4056L8.2194 8 5.7192 5.6247Z",
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
