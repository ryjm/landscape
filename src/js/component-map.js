import { InboxPage } from './components/inbox';
import { ListPage } from './components/list';
import { MenuPage } from './components/menu';
import { ChatPage } from './components/chat';
import { StreamEditPage } from './components/stream/edit';
import { StreamCreatePage } from './components/stream/create';
import { CollectionCreatePage } from './components/collection/create';
import { TopicCreatePage } from './components/collection/createTopic';
import { CommentCreate } from './components/collection/comment';
import { Subscribe } from './components/subscribe';
import { Elapsed } from './components/common/elapsed';

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
  "ChatPage": {
    comp: ChatPage
  },
  "StreamCreatePage": {
    comp: StreamCreatePage
  },
  "CollectionCreatePage": {
    comp: CollectionCreatePage
  },
  "TopicCreatePage": {
    comp: TopicCreatePage
  },
  "StreamEditPage": {
    comp: StreamEditPage
  },
  "CommentCreate": {
    comp: CommentCreate
  },
  "InboxPage": {
    comp: InboxPage
  },
  "ListPage": {
    comp: ListPage
  },
  "MenuPage": {
    comp: MenuPage
  },
  "Subscribe": {
    comp: Subscribe
  },
  "Elapsed": {
    comp: Elapsed
  }
};
