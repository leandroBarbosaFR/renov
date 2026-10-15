import {blockContent} from './objects/blockContent'
import {cta} from './objects/cta'
import {figure} from './objects/figure'
import {galleryFull, galleryPair, galleryText} from './objects/gallery'
import {navItem, projectDetail, socialLink, valueItem} from './objects/misc'
import {seo} from './objects/seo'
import {aboutPage} from './documents/aboutPage'
import {contactPage} from './documents/contactPage'
import {contactSubmission} from './documents/contactSubmission'
import {homePage} from './documents/homePage'
import {legalPage} from './documents/legalPage'
import {project} from './documents/project'
import {projectCategory} from './documents/projectCategory'
import {projectsPage} from './documents/projectsPage'
import {siteSettings} from './documents/siteSettings'

export const singletonTypes = new Set(['siteSettings', 'homePage', 'aboutPage', 'projectsPage', 'contactPage'])

export const schemaTypes = [
  // Objects
  figure,
  cta,
  seo,
  blockContent,
  galleryFull,
  galleryPair,
  galleryText,
  navItem,
  socialLink,
  projectDetail,
  valueItem,
  // Singletons
  siteSettings,
  homePage,
  aboutPage,
  projectsPage,
  contactPage,
  // Collections
  project,
  projectCategory,
  legalPage,
  contactSubmission,
]
