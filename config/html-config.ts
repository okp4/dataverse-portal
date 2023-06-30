import { URL } from 'url'
import type { Options } from 'vite-plugin-html-config'
import pkg from '../package.json'

const options: Options = {
  favicon: '/favicon.svg',
  title: 'OKP4 Dataverse Portal',
  metas: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0'
    },
    {
      name: 'description',
      content: pkg.description
    },
    {
      name: 'author',
      content: pkg.author.name
    },
    {
      name: 'og:type',
      content: 'website'
    },
    {
      name: 'og:title',
      content: 'OKP4 Dataverse Portal'
    },
    {
      name: 'og:description',
      content: pkg.description
    },
    {
      name: 'keywords',
      content: [
        'OKP4',
        'Portal',
        'Data App',
        'Dataverse',
        'Services',
        'Dataset',
        'Zone',
        'Deposit',
        'Catalog',
        'Files',
        'Blockchain',
        'Metadata',
        'Exploration',
        'Know',
        'Token'
      ].join(', ')
    },
    {
      name: 'version',
      content: pkg.version
    }
  ],
  headScripts: [
    {
      src: '/assets/env.js',
      async: false
    }
  ]
}

export default options
