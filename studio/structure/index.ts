import type {ComponentType} from 'react'
import {CaseIcon} from '@sanity/icons/Case'
import {CogIcon} from '@sanity/icons/Cog'
import {DocumentIcon} from '@sanity/icons/Document'
import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {HomeIcon} from '@sanity/icons/Home'
import {InboxIcon} from '@sanity/icons/Inbox'
import {TagIcon} from '@sanity/icons/Tag'
import {ThListIcon} from '@sanity/icons/ThList'
import {UsersIcon} from '@sanity/icons/Users'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'

const singleton = (S: StructureBuilder, type: string, title: string, icon: ComponentType) =>
  S.listItem()
    .title(title)
    .id(type)
    .icon(icon)
    .child(S.document().schemaType(type).documentId(type).title(title))

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenu')
    .items([
      singleton(S, 'homePage', 'Accueil', HomeIcon),
      singleton(S, 'aboutPage', 'À propos', UsersIcon),
      singleton(S, 'projectsPage', 'Page Réalisations', ThListIcon),
      singleton(S, 'contactPage', 'Contact', EnvelopeIcon),
      S.divider(),
      S.documentTypeListItem('project').title('Projets').icon(CaseIcon),
      S.documentTypeListItem('projectCategory').title('Catégories').icon(TagIcon),
      S.divider(),
      S.listItem()
        .title('Demandes de devis')
        .icon(InboxIcon)
        .child(
          S.documentTypeList('contactSubmission')
            .title('Demandes de devis')
            .defaultOrdering([{field: 'submittedAt', direction: 'desc'}]),
        ),
      S.divider(),
      S.documentTypeListItem('legalPage').title('Pages légales').icon(DocumentIcon),
      singleton(S, 'siteSettings', 'Paramètres du site', CogIcon),
    ])
