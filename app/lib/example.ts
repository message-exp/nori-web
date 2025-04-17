// temporary chat room structure
export interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  avatar?: string;
}

// temporary chat room data
export const chats: Chat[] = [
  {
    id: "1",
    name: "Alice Johnson",
    lastMessage: "Can you send me the design files?",
    time: "2m ago",
    unread: 3,
    online: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Bob Smith",
    lastMessage: "I'll be there in 5 minutes",
    time: "25m ago",
    unread: 0,
    online: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Team Standup",
    lastMessage: "Carlos: Let's discuss the new feature",
    time: "1h ago",
    unread: 12,
    online: false,
  },
  {
    id: "4",
    name: "Dana White",
    lastMessage: "Thanks for your help yesterday!",
    time: "1d ago",
    unread: 0,
    online: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Marketing Team",
    lastMessage: "Emma: The campaign is ready to launch",
    time: "2d ago",
    unread: 0,
    online: false,
  },
  {
    id: "6",
    name: "Frank Miller",
    lastMessage: "Are we still meeting today?",
    time: "3d ago",
    unread: 0,
    online: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "7",
    name: "Grace Lee",
    lastMessage: "I've updated the document",
    time: "5d ago",
    unread: 0,
    online: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "8",
    name: "Product Discussion",
    lastMessage: "Henry: Let's finalize the roadmap",
    time: "1w ago",
    unread: 0,
    online: false,
  },
];
