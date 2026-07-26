import { emit, on } from '@create-figma-plugin/utilities';
import { createComponent } from './api/components.api';
import { getStats } from './api/statsApi';
import { getMappedVariableCollections } from './api/variablesApi';
import { nodeToObject } from './ui/utils';

figma.showUI(__html__, {
  width: 350,
  height: 500,
  themeColors: true,
});

figma.ui.onmessage = async (message) => {
  console.log('message', message);

  let components;
  if (message[0] === 'REQ_SERIALIZE_JSON') {
    await figma.loadAllPagesAsync();

    for (const page of figma.root.children) {
      if (page.name === 'Test') {
        // traverseNode(page, (node: SceneNode) => components.push(node));
        components = page.findAll(node => node.type === 'FRAME' && node.name === 'Button');
      }

      console.log(`Page ${page.name} has ${page.children.length} children`);
    }
    const json = nodeToObject(components[0]);
    // const json = nodeToObject(figma.root.children);
    console.log('Plugin JSON', json);

    emit('RES_SERIALIZE_JSON', JSON.stringify(json));
  }

  else if (message[0] === 'REQ_UPLOAD_JSON') {
    const component = figma.createComponent();

    Object.assign(component, JSON.parse(message[1]));

    figma.root.children[4].appendChild(component);
  }

  else if (message[0] === 'REQ_VARIABLES') {
    const variableCollections = await getMappedVariableCollections(figma);

    emit('RES_VARIABLES', variableCollections);
  }

  else if (message[0] === 'GET_STATS') {
    const stats = await getStats(figma);
    console.log('Stats:', stats);

    emit('SET_STATS', stats);
  }

  else if (message[0] === 'CREATE_COMPONENT') {
    const component = await createComponent(figma, message[1]);

    emit('SET_COMPONENT', component);
  }
};

on('REQ_DOCUMENT_TITLE', async () => {
  const title = figma.root.name;
  console.log('Plugin Document Title:', title);
  emit('RES_DOCUMENT_TITLE', title);
});

figma.ui.postMessage(
  'test'
);
