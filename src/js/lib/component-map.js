import { InboxPage } from '/components/inbox';
import { ListPage } from '/components/list';
import { ChatPage } from '/components/stream/chat';
import { StreamCreatePage } from '/components/stream/create';
import { TopicCreatePage } from '/components/collection/createTopic';
import { CommentCreate } from '/components/collection/comment';
import { Elapsed } from '/components/lib/elapsed';
import { IconComment } from '/components/lib/icons/icon-comment';
import { AvatarSample1 } from '/components/lib/icons/avatar-sample-1';
import { AvatarLg } from '/components/lib/icons/avatar-lg';
import { ChatList } from '/components/lib/chat-list';

export var ComponentMap = {
  "ChatPage": {
    comp: ChatPage
  },
  "ChatList": {
    comp: ChatList
  },
  "StreamCreatePage": {
    comp: StreamCreatePage
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
  "Elapsed": {
    comp: Elapsed
  },
  "IconComment": {
    comp: IconComment
  },
  "AvatarSample1": {
    comp: AvatarSample1
  },
  "AvatarLg": {
    comp: AvatarLg
  }
};
