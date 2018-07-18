import { InboxPage } from '/components/inbox';
import { ListPage } from '/components/list';
import { ChatPage } from '/components/stream/chat';
import { TopicCreatePage } from '/components/collection/createTopic';
import { CommentCreate } from '/components/collection/comment';
import { Elapsed } from '/components/lib/elapsed';
import { IconComment } from '/components/lib/icons/icon-comment';
import { AvatarSample1 } from '/components/lib/icons/avatar-sample-1';
import { AvatarLg } from '/components/lib/icons/avatar-lg';
import { ChatList } from '/components/lib/chat-list';
import { ProfileMsgBtn } from '/components/lib/profile-msg-btn';

export var ComponentMap = {
  "ChatPage": {
    comp: ChatPage
  },
  "ChatList": {
    comp: ChatList
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
  },
  "ProfileMsgBtn": {
    comp: ProfileMsgBtn
  }
};
