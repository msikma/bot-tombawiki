// @dada78641/bot-tombawiki <https://github.com/msikma/bot-tombawiki>
// © MIT license

import type {RcEditRecord} from '@dada78641/mwrecent'
import type {FeedItem, FeedItemUpdate} from '@dada78641/cronbot'

// The full config for this task.
export interface TombaWikiConfig {
  taskRecentChanges: TombaWikiRecentChangesData[]
}

// A single search request, defined in the config.
export interface TombaWikiRecentChangesData {
  options?: {}
  identifier?: string
  channel: string
}

// A full search result object with unique identifier.
export type TombaWikiSearchResult = {
  guid: string
  data: RcEditRecord
}

export type TombaWikiFeedItem = FeedItem<RcEditRecord, TombaWikiRecentChangesData>
export type TombaWikiFeedItemUpdate = FeedItemUpdate<RcEditRecord, TombaWikiRecentChangesData>
