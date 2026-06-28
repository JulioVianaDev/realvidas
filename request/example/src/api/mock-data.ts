import type {
  Conversation,
  ConversationTag,
  ConversationStatus,
  Message,
  MessageType,
  MessageSender,
} from '@/types/chat'

const TAGS: ConversationTag[] = ['support', 'sales', 'billing', 'technical', 'general']
const STATUSES: ConversationStatus[] = ['active', 'closed', 'pending']
const NAMES = [
  'Alice Johnson', 'Bob Smith', 'Carlos Rivera', 'Diana Chen', 'Erik Andersson',
  'Fatima Al-Rashid', 'George Patel', 'Hannah Kim', 'Ivan Petrov', 'Julia Santos',
  'Kevin O\'Brien', 'Lina Müller', 'Mohamed Hassan', 'Nina Kowalski', 'Oscar Fernandez',
  'Patricia Lee', 'Quinn Taylor', 'Rachel Nakamura', 'Samuel Brown', 'Tanya Volkov',
  'Umberto Rossi', 'Vera Johansson', 'William Park', 'Xena Papadopoulos', 'Yuki Tanaka',
  'Zara Williams', 'Andre Martin', 'Bianca Costa', 'Christian Larsen', 'Daphne Nguyen',
]

const LAST_MESSAGES = [
  'Hey, I need help with my order',
  'Thanks for the quick response!',
  'Can you check the status of my ticket?',
  'I\'d like to upgrade my plan',
  'The feature isn\'t working as expected',
  'When will the new update be available?',
  'I have a billing question',
  'Great, that solved my problem!',
  'Can you send me the invoice?',
  'I\'m interested in the enterprise plan',
]

const MESSAGE_CONTENTS: Record<MessageSender, string[]> = {
  customer: [
    'Hi, I need some help with my account.',
    'I\'ve been having issues with the dashboard.',
    'Can you explain how this feature works?',
    'I tried restarting but it didn\'t help.',
    'That makes sense, thank you!',
    'Is there a way to export the data?',
    'I noticed the price changed on my invoice.',
    'How do I add more team members?',
    'The error keeps happening every time I try.',
    'Perfect, that\'s exactly what I needed.',
    'Can I schedule a call to discuss this further?',
    'I\'ve attached a screenshot of the issue.',
    'What are the available integrations?',
    'My team is growing and we need more seats.',
    'The loading time has been really slow lately.',
  ],
  ai: [
    'Hello! I\'d be happy to help you with that. Let me look into it.',
    'I can see the issue you\'re referring to. Here\'s what we can do...',
    'Based on your account, I recommend the following steps:',
    'I\'ve checked our system and found the following information:',
    'That\'s a great question! Here\'s how it works:',
    'I understand your concern. Let me explain the pricing changes.',
    'You can find this option under Settings > Team Management.',
    'I\'ve escalated this to our technical team for further investigation.',
    'Here are some troubleshooting steps you can try:',
    'Your request has been processed successfully!',
    'I\'m generating a report for you. This may take a moment.',
    'Would you like me to walk you through the setup process?',
    'I\'ve updated your account settings as requested.',
    'Here\'s a summary of the changes we discussed:',
    'Is there anything else I can help you with today?',
  ],
  user: [
    'Let me check that for you right away.',
    'I\'ve reviewed your case and here\'s my recommendation.',
    'I\'ll transfer you to our specialist team for this.',
    'Thank you for your patience while I look into this.',
    'I\'ve applied a credit to your account.',
    'The fix has been deployed, please try again.',
    'I understand the frustration. Let me make this right.',
    'Here\'s a link to our documentation on this topic.',
    'I\'ve scheduled the meeting for tomorrow at 2 PM.',
    'Your ticket has been updated with the latest information.',
  ],
}

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

const rand = seededRandom(42)

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)]
}

function generateConversations(count: number): Conversation[] {
  const conversations: Conversation[] = []
  const baseTime = new Date('2026-06-01T12:00:00Z').getTime()

  for (let i = 0; i < count; i++) {
    const minutesAgo = i * 3 + Math.floor(rand() * 10)
    conversations.push({
      id: `conv-${i + 1}`,
      customerName: NAMES[i % NAMES.length] + (i >= NAMES.length ? ` (${Math.floor(i / NAMES.length) + 1})` : ''),
      customerAvatar: undefined,
      lastMessage: pick(LAST_MESSAGES),
      lastMessageAt: new Date(baseTime - minutesAgo * 60000).toISOString(),
      unreadCount: Math.floor(rand() * 8),
      tag: pick(TAGS),
      status: pick(STATUSES),
    })
  }

  return conversations
}

function generateMessages(conversationId: string, totalCount: number): Message[] {
  const messages: Message[] = []
  const baseTime = new Date('2026-06-01T12:00:00Z').getTime()
  const senders: MessageSender[] = ['customer', 'ai', 'user']
  const types: MessageType[] = ['text', 'text', 'text', 'text', 'text', 'text', 'image', 'audio', 'video', 'buttons']

  for (let i = 0; i < totalCount; i++) {
    const sender = senders[i % 3 === 0 ? 0 : i % 3 === 1 ? 1 : Math.floor(rand() * 2) === 0 ? 0 : 2]
    const type = pick(types)
    const minutesAgo = (totalCount - i) * 2

    let content = pick(MESSAGE_CONTENTS[sender])
    let mediaUrl: string | undefined
    let buttons: { id: string; label: string; value: string }[] | undefined
    let replyToId: number | undefined
    let replyToPreview: string | undefined

    if (type === 'image') {
      content = 'Shared an image'
      mediaUrl = `https://picsum.photos/seed/${conversationId}-${i}/400/300`
    } else if (type === 'audio') {
      content = 'Sent a voice message'
      mediaUrl = '#audio-placeholder'
    } else if (type === 'video') {
      content = 'Shared a video'
      mediaUrl = '#video-placeholder'
    } else if (type === 'buttons') {
      content = 'Please select an option:'
      buttons = [
        { id: `btn-${i}-1`, label: 'Option A', value: 'option_a' },
        { id: `btn-${i}-2`, label: 'Option B', value: 'option_b' },
        { id: `btn-${i}-3`, label: 'Option C', value: 'option_c' },
      ]
    }

    if (i > 5 && rand() > 0.8) {
      const replyIdx = Math.max(0, i - Math.floor(rand() * 5) - 1)
      replyToId = replyIdx + 1
      replyToPreview = messages[replyIdx]?.content.slice(0, 60) || 'Previous message'
    }

    messages.push({
      id: i + 1,
      conversationId,
      sender,
      type,
      content,
      mediaUrl,
      buttons,
      replyToId,
      replyToPreview,
      timestamp: new Date(baseTime - minutesAgo * 60000).toISOString(),
      read: i < totalCount - 3,
    })
  }

  return messages
}

export const ALL_CONVERSATIONS = generateConversations(200)

const messageCache = new Map<string, Message[]>()

export function getMessagesForConversation(conversationId: string): Message[] {
  if (!messageCache.has(conversationId)) {
    const convIndex = ALL_CONVERSATIONS.findIndex((c) => c.id === conversationId)
    const count = 80 + Math.floor(rand() * 120)
    messageCache.set(conversationId, generateMessages(conversationId, convIndex >= 0 ? count : 50))
  }
  return messageCache.get(conversationId)!
}
