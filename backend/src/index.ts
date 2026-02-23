import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // 1. Give public role permission to find and findOne for all our new APIs
    try {
      const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' },
      });

      if (publicRole) {
        const apis = ['category', 'service', 'about', 'contact'];
        const actions = ['find', 'findOne'];

        for (const api of apis) {
          for (const action of actions) {
            const actionName = `api::${api}.${api}.${action}`;

            // Check if permission already exists
            const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
              where: {
                action: actionName,
                role: publicRole.id,
              },
            });

            if (!existingPermission) {
              await strapi.query('plugin::users-permissions.permission').create({
                data: {
                  action: actionName,
                  role: publicRole.id,
                },
              });
            }
          }
        }
      }
    } catch (error) {
      console.log('Error setting permissions:', error);
    }

    // 2. Add Dummy Categories and Services
    try {
      const existingCategories = await strapi.documents('api::category.category').findMany();
      if (existingCategories.length === 0) {
        console.log('Adding dummy categories and services...');

        // Create Categories
        const hairCare = await strapi.documents('api::category.category').create({
          data: { name: 'Hair Care', description: 'All types of haircuts and hair treatments', status: 'published' }
        });

        const skinCare = await strapi.documents('api::category.category').create({
          data: { name: 'Skin Care', description: 'Facials, cleanups, and glowing skin treatments', status: 'published' }
        });

        // Create Services
        await strapi.documents('api::service.service').create({
          data: { name: 'Basic Haircut', description: 'A standard haircut for everyday look.', price: 15.00, category: hairCare.documentId, status: 'published' }
        });
        await strapi.documents('api::service.service').create({
          data: { name: 'Hair Coloring', description: 'Full hair coloring with premium products.', price: 50.00, category: hairCare.documentId, status: 'published' }
        });
        await strapi.documents('api::service.service').create({
          data: { name: 'Gold Facial', description: 'A luxurious gold facial for radiant skin.', price: 40.00, category: skinCare.documentId, status: 'published' }
        });
        await strapi.documents('api::service.service').create({
          data: { name: 'Bridal Makeup', description: 'Complete bridal makeup package.', price: 150.00, category: skinCare.documentId, status: 'published' }
        });
      }

      // 3. Add Dummy About Page
      const existingAbout = await strapi.documents('api::about.about').findMany();
      if (existingAbout.length === 0) {
        console.log('Adding dummy about info...');
        await strapi.documents('api::about.about').create({
          data: {
            title: 'Welcome to Itrik Beauty Parlour',
            content: 'At Itrik Beauty Parlour, guided by the vision of Kirti Chudasama, we believe in enhancing your natural beauty. We offer a wide range of premium services using the highest quality products.',
            status: 'published'
          }
        });
      }

      // 4. Add Dummy Contact Info
      const existingContact = await strapi.documents('api::contact.contact').findMany();
      if (existingContact.length === 0) {
        console.log('Adding dummy contact info...');
        await strapi.documents('api::contact.contact').create({
          data: {
            address: '123 Beauty Lane, Glamour City, GC 45678',
            email: 'hello@itrikbeauty.com',
            phone: '+1 (555) 123-4567',
            workingHours: 'Mon-Sat: 9:00 AM - 8:00 PM, Sun: Closed',
            status: 'published'
          }
        });
      }

      console.log('Bootstrap finished successfully.');
    } catch (error) {
      console.log('Error during bootstrap:', error);
    }
  },
};
