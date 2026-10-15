import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'y4030ro7',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  deployment: {
    autoUpdates: true,
  },
  typegen: {
    path: '../src/**/*.{ts,tsx}',
    schema: 'schema.json',
    generates: '../src/sanity/types.ts',
    overloadClientMethods: true,
  },
})
