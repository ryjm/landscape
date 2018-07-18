import { InboxPage } from '/components/inbox';
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
  "ChatPage": ChatPage,
  "ChatList": ChatList,
  "TopicCreatePage": TopicCreatePage,
  "CommentCreate": CommentCreate,
  "InboxPage": InboxPage,
  "Elapsed": Elapsed,
  "IconComment": IconComment,
  "AvatarSample1": AvatarSample1,
  "AvatarLg": AvatarLg,
  "ProfileMsgBtn": ProfileMsgBtn,
};
