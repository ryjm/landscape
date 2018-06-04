import { InboxPage } from './components/inbox';
import { ListPage } from './components/list';
import { MenuPage } from './components/menu';
import { ChatPage } from './components/chat';
import { StreamCreatePage } from './components/stream/create';
import { CollectionCreatePage } from './components/collection/create';
import { TopicCreatePage } from './components/collection/createTopic';
import { CommentCreate } from './components/collection/comment';
import { Subscribe } from './components/subscribe';
import { Elapsed } from './common/elapsed';
import { IconComment } from './icons/icon-comment';
import { AvatarSample1 } from './icons/avatar-sample-1';

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
  },
  "IconComment": {
    comp: IconComment
  },
  "AvatarSample1": {
    comp: AvatarSample1
  }
};
