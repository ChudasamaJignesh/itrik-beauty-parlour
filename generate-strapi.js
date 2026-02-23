const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'backend', 'src', 'api');

const apis = [
    {
        name: 'category',
        kind: 'collectionType',
        schema: {
            "kind": "collectionType",
            "collectionName": "categories",
            "info": {
                "singularName": "category",
                "pluralName": "categories",
                "displayName": "Category",
                "description": "Categories for beauty parlor services"
            },
            "options": {
                "draftAndPublish": true
            },
            "pluginOptions": {},
            "attributes": {
                "name": {
                    "type": "string",
                    "required": true
                },
                "description": {
                    "type": "text"
                },
                "services": {
                    "type": "relation",
                    "relation": "oneToMany",
                    "target": "api::service.service",
                    "mappedBy": "category"
                }
            }
        }
    },
    {
        name: 'service',
        kind: 'collectionType',
        schema: {
            "kind": "collectionType",
            "collectionName": "services",
            "info": {
                "singularName": "service",
                "pluralName": "services",
                "displayName": "Service",
                "description": "Services offered in the beauty parlor"
            },
            "options": {
                "draftAndPublish": true
            },
            "pluginOptions": {},
            "attributes": {
                "name": {
                    "type": "string",
                    "required": true
                },
                "description": {
                    "type": "text"
                },
                "price": {
                    "type": "decimal",
                    "required": true
                },
                "image": {
                    "type": "media",
                    "multiple": false,
                    "required": false,
                    "allowedTypes": [
                        "images"
                    ]
                },
                "category": {
                    "type": "relation",
                    "relation": "manyToOne",
                    "target": "api::category.category",
                    "inversedBy": "services"
                }
            }
        }
    },
    {
        name: 'about',
        kind: 'singleType',
        schema: {
            "kind": "singleType",
            "collectionName": "abouts",
            "info": {
                "singularName": "about",
                "pluralName": "abouts",
                "displayName": "About",
                "description": "About page content"
            },
            "options": {
                "draftAndPublish": true
            },
            "pluginOptions": {},
            "attributes": {
                "title": {
                    "type": "string",
                    "required": true
                },
                "content": {
                    "type": "richtext",
                    "required": true
                },
                "image": {
                    "type": "media",
                    "multiple": false,
                    "required": false,
                    "allowedTypes": [
                        "images"
                    ]
                }
            }
        }
    },
    {
        name: 'contact',
        kind: 'singleType',
        schema: {
            "kind": "singleType",
            "collectionName": "contacts",
            "info": {
                "singularName": "contact",
                "pluralName": "contacts",
                "displayName": "Contact Info",
                "description": "Contact Information"
            },
            "options": {
                "draftAndPublish": true
            },
            "pluginOptions": {},
            "attributes": {
                "address": {
                    "type": "text"
                },
                "email": {
                    "type": "email"
                },
                "phone": {
                    "type": "string"
                },
                "workingHours": {
                    "type": "string"
                }
            }
        }
    }
];

apis.forEach(api => {
    const apiDir = path.join(srcDir, api.name);
    const contentTypesDir = path.join(apiDir, 'content-types', api.name);
    const controllersDir = path.join(apiDir, 'controllers');
    const routesDir = path.join(apiDir, 'routes');
    const servicesDir = path.join(apiDir, 'services');

    fs.mkdirSync(contentTypesDir, { recursive: true });
    fs.mkdirSync(controllersDir, { recursive: true });
    fs.mkdirSync(routesDir, { recursive: true });
    fs.mkdirSync(servicesDir, { recursive: true });

    fs.writeFileSync(
        path.join(contentTypesDir, 'schema.json'),
        JSON.stringify(api.schema, null, 2)
    );

    const factory = 'factories.' + (api.kind === 'singleType' ? 'createCoreController' : 'createCoreController'); // Strapi v4/v5 format uses createCoreController for both

    fs.writeFileSync(
        path.join(controllersDir, `${api.name}.ts`),
        `/**
 * ${api.name} controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::${api.name}.${api.name}');
`
    );

    fs.writeFileSync(
        path.join(routesDir, `${api.name}.ts`),
        `/**
 * ${api.name} router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::${api.name}.${api.name}');
`
    );

    fs.writeFileSync(
        path.join(servicesDir, `${api.name}.ts`),
        `/**
 * ${api.name} service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::${api.name}.${api.name}');
`
    );

    console.log(`Created API for ${api.name}`);
});
