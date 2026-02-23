const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'backend', 'src', 'api');

const apiName = 'global';

const schema = {
    "kind": "singleType",
    "collectionName": "globals",
    "info": {
        "singularName": "global",
        "pluralName": "globals",
        "displayName": "Global Settings",
        "description": "Global settings for the beauty parlor website (logo, favicon)"
    },
    "options": {
        "draftAndPublish": true
    },
    "pluginOptions": {},
    "attributes": {
        "siteName": {
            "type": "string",
            "default": "ITRIK Beauty Parlour"
        },
        "logo": {
            "type": "media",
            "multiple": false,
            "required": false,
            "allowedTypes": ["images"]
        },
        "favicon": {
            "type": "media",
            "multiple": false,
            "required": false,
            "allowedTypes": ["images", "files"]
        }
    }
};

const apiDir = path.join(srcDir, apiName);
const contentTypesDir = path.join(apiDir, 'content-types', apiName);
const controllersDir = path.join(apiDir, 'controllers');
const routesDir = path.join(apiDir, 'routes');
const servicesDir = path.join(apiDir, 'services');

fs.mkdirSync(contentTypesDir, { recursive: true });
fs.mkdirSync(controllersDir, { recursive: true });
fs.mkdirSync(routesDir, { recursive: true });
fs.mkdirSync(servicesDir, { recursive: true });

fs.writeFileSync(
    path.join(contentTypesDir, 'schema.json'),
    JSON.stringify(schema, null, 2)
);

fs.writeFileSync(
    path.join(controllersDir, `${apiName}.ts`),
    `/**
 * ${apiName} controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::${apiName}.${apiName}');
`
);

fs.writeFileSync(
    path.join(routesDir, `${apiName}.ts`),
    `/**
 * ${apiName} router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::${apiName}.${apiName}');
`
);

fs.writeFileSync(
    path.join(servicesDir, `${apiName}.ts`),
    `/**
 * ${apiName} service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::${apiName}.${apiName}');
`
);

console.log(`Created API for ${apiName}`);
