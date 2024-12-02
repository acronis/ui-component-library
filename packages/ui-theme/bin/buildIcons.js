import { globSync } from 'glob';
import fs from 'fs';
import path from 'path';

const acronisIcons = globSync('node_modules/@acronis-platform/icons/**/*.svg');

const icons = {
    asset: {
        icon: acronisIcons.reduce((acc, icon) => {
            const name= icon.split('/').pop().split('.').shift();
            const fileName = path.basename(icon);
            acc[name] = {
                name,
                value: `${fileName}`,
                icon,
                type: 'asset'
            }

            return acc;
        }, {})
    }
};

fs.writeFile(
    "tokens/assets/icons.json",
    JSON.stringify(icons, null, 2),
    { type: 'application/json' },
    function(err) {
    if (err) {
        console.log(err);
    }
});

console.log('Found ' + acronisIcons.length + ' icons');
