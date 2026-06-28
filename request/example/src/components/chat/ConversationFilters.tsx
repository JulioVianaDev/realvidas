import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useChatStore } from '@/store/chat-store'
import type { ConversationTag, ConversationOrderBy } from '@/types/chat'

const TAGS: { value: ConversationTag | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'support', label: 'Support' },
  { value: 'sales', label: 'Sales' },
  { value: 'billing', label: 'Billing' },
  { value: 'technical', label: 'Technical' },
  { value: 'general', label: 'General' },
]

const ORDER_OPTIONS: { value: ConversationOrderBy; label: string }[] = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'unread', label: 'Most Unread' },
]

export function ConversationFiltersBar() {
  const filters = useChatStore((s) => s.filters)
  const setFilters = useChatStore((s) => s.setFilters)

  return (
    <div className="flex flex-col gap-2 p-3 border-b border-border">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className="pl-9 h-9"
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex flex-wrap gap-1 flex-1">
          {TAGS.map((tag) => (
            <Badge
              key={tag.value}
              variant={filters.tag === tag.value ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              onClick={() => setFilters({ tag: tag.value })}
            >
              {tag.label}
            </Badge>
          ))}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {ORDER_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onClick={() => setFilters({ orderBy: opt.value })}
                className={filters.orderBy === opt.value ? 'bg-accent' : ''}
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
