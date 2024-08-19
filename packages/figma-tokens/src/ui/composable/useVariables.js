import { ref } from 'vue';
import { emit as emitFigma, on } from '@create-figma-plugin/utilities';
import { RGBToHSL } from '../utils';
import {setWith} from 'lodash-es';

function useVariables() {
  const variables = ref([]);
  const variablesMap = ref({});
  const cssVariables = ref('');
  const jsonVariables = ref('');

  function getDimension(variableName) {
    let dimension = '';
    const dimensions = {
      'border/width': 'px',
      'font/size': 'px',
      'font/weight': '',
      'height': 'px',
      'radius': 'px',
      'spacing': 'px',
      'shadow/blur': 'px',
      'shadow/position': 'px',
    };

    Object.keys(dimensions).forEach((val) => {
      if (variableName.includes(val)) {
        dimension = dimensions[val];
      }
    });

    return dimension;
  }

  function getValue(variable, modeId) {
    let value = variable.valuesByMode[modeId]/* || variable.cssAlias || variable.cssValue */;

    if (value?.type === 'VARIABLE_ALIAS') {
      const alias = variablesMap.value[value.id];
      if (!alias) {
        console.error('Unable to find alias for ' + value);
      }
      const dimension = getDimension(alias.name);
      value = `var(${alias.cssName.replace('--acv', '--acv-base')}, ${alias.cssValue}${dimension})`;
    }

    if (value?.a || value?.b || value?.g || value?.r) {
      value = RGBToHSL(value.r, value.g, value.b, value.a);
    }

    return value;
  }

  function getStyleDictionaryValue(variable, modeId) {
    const {name, cssValue} = variable;
    const dimension = getDimension(name);
    const taxonomy = name.split('/');
    const type = taxonomy[0] || taxonomy[1] || 'getSDType';
    let value = variable.valuesByMode[modeId] + dimension;

    if (cssValue?.type === 'VARIABLE_ALIAS') {
      const alias = variablesMap.value[cssValue.id];
      if (!alias) {
        console.error('Unable to find alias for ' + cssValue.id);
      }

      value = `{${['base'].concat(alias.name.split('/')).join('.')}}`;
    }

    if (type==='color') {
      value = cssValue;
    }

    return {
      value,
      name,
      dimension,
      type,
      isAlias: cssValue?.type === 'VARIABLE_ALIAS',
      category: taxonomy[0],
      ctype: taxonomy[1],
      citem: taxonomy[2],
      cssValue: variable.cssValue
    };
  }

  function outputCssMode({ modeName, modeId, variables, singleMode }) {
    const mode = singleMode ? '' : `[data-theme="${modeName.toLowerCase()}"]`;

    return `:root${mode} {\n${variables
      .sort((a, b) => a.cssName.localeCompare(b.cssName))
      .map((variable) => {
        const name = singleMode
            ? variable.cssName.replace('--acv', '--acv-base')
            : variable.cssName;
        const value = getValue(variable, modeId);
        const dimension = singleMode ? getDimension(variable.name) : '';

        return `  ${name}: ${value}${dimension};`;
      })
      .join('\n')}\n}\n\n`;
  }

  function outputCssVariables(json) {
    let vars = '';

    Object.values(json).forEach((collection) => {
      collection.modes.forEach(({ name, modeId }) => {
        vars += outputCssMode({
          modeName: name,
          modeId,
          variables: collection.variables,
          singleMode: collection.modes.length === 1
        });
      });
    });

    return vars;
  }

  function outputJsonMode({ modeName, modeId, variables, singleMode }) {
    const modeTitle = singleMode ? 'base' : modeName.toLowerCase()
    const output = {};

    variables.forEach((variable) => {
      const segments = variable.name.split('/');
      const value = getStyleDictionaryValue(variable, modeId);
      // const dimension = singleMode ? getDimension(variable.name) : '';

      setWith(output, [modeTitle, ...segments], value, Object);
    })

    return output;
  }

  function outputJsonVariables(json) {
    let vars = {};

    Object.values(json).forEach((collection) => {
      collection.modes.forEach(({ name, modeId }) => {
        Object.assign(vars, outputJsonMode({
          modeName: name,
          modeId,
          variables: collection.variables,
          singleMode: collection.modes.length === 1
        }));
      });
    });

    return vars;
  }

  const fetchVariables = async () => {
    emitFigma('REQ_VARIABLES');

    on('RES_VARIABLES', (json) => {
      variables.value = json;
      variablesMap.value = Object.values(json).reduce((acc, collection) => {
        collection.variables.forEach((variable) => {
          acc[variable.id] = variable;
        });

        return acc;
      }, {});

      cssVariables.value = outputCssVariables(json);
      jsonVariables.value = JSON.stringify(outputJsonVariables(json), null, 2);
    });
  };

  return { variables, fetchVariables, cssVariables, jsonVariables };
}

export default useVariables;
