import { InboxPage } from './components/inbox';
import { AppHeader } from './components/app-header';
import { StreamPage, StreamPageHeader } from './components/stream';
import { StreamEditPage } from './components/stream/edit';
import { StreamCreatePage } from './components/stream/create';

/**
  Anatomy:

  "ComponentLabel": {
    comp:         // main component
    compProps:    // props for main component
    head:         // header component
    headProps:    // props for header
}
**/

export var ComponentMap = {
  "StreamPage": {
    comp: StreamPage,
    head: StreamPageHeader
  },
  "StreamCreatePage": {
    comp: StreamCreatePage
  },
  "StreamEditPage": {
    comp: StreamEditPage
  },
  "InboxPage": {
    comp: InboxPage
  },
  "AppHeader": {
    comp: AppHeader
  },
};
