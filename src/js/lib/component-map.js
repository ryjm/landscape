import { InboxPage } from '/components/inbox';
import { ListPage } from '/components/list';
import { MenuPage } from '/components/menu';
import { ChatPage } from '/components/stream/chat';
import { StreamCreatePage } from '/components/stream/create';
import { CollectionCreatePage } from '/components/collection/create';
import { TopicCreatePage } from '/components/collection/createTopic';
import { CommentCreate } from '/components/collection/comment';
import { Elapsed } from '/components/lib/elapsed';
import { IconComment } from '/components/lib/icons/icon-comment';
import { AvatarSample1 } from '/components/lib/icons/avatar-sample-1';

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
