import { RGBToHSL } from '../ui/utils';

const uiKitPrefix = 'acv';

async function getMappedVariableCollections(figma) {
  const localCollections = await figma.variables.getLocalVariableCollectionsAsync();
  const localVariables = await figma.variables.getLocalVariablesAsync();

  const localVariablesMap = localVariables.reduce((acc, variable) => {
    const { id, name, valuesByMode, variableCollectionId } = variable;

    return Object.assign({
      [id]: {
        id,
        name,
        valuesByMode,
        variableCollectionId,
      },
    }, acc);
  }, {});

  return localCollections.map((collection) => {
    const { id, name, modes, variableIds } = collection;

    const defaultModeId = modes[0].modeId;

    return {
      id,
      name,
      modes,
      variableIds,
      variables: variableIds
        .map(variableId => localVariablesMap[variableId])
        .map((variable) => {
          let { value } = variable;

          if (value?.type === 'VARIABLE_ALIAS' && value?.id) {
            value = value.id;
          }

          else if (variable.valuesByMode?.[defaultModeId] || variable.valuesByMode[defaultModeId] === 0) {
            value = variable.valuesByMode[defaultModeId];
          }

          if (value?.a || value?.b || value?.g || value?.r) {
            // value = `rgba(${roundNumber(value.r)}, ${roundNumber(value.g)}, ${roundNumber(value.b)}, ${roundNumber(value.a)})`;
            value = RGBToHSL(value.r, value.g, value.b, value.a);
          }

          return Object.assign(variable,
            // name: `${collection.name}-${variable.name}`,
            {
              cssName: `--${uiKitPrefix}-${variable.name.replace(/\/|\s+/g, '-').toLowerCase()}`,
              cssAlias: value?.type === 'VARIABLE_ALIAS' && value?.id ? `var(${localVariablesMap[value.id].cssName})` : null,
              cssValue: value
            },);
        }),
    };
  });
}

export { getMappedVariableCollections };
