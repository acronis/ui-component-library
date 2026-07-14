import { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  Button,
  ButtonIcon,
  Chip,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  InputTextArea,
  ScrollArea,
  Separator,
  Spinner,
} from '@constructor-lab/ui-react';
import { SendIcon } from '@constructor-lab/icons-react/stroke-mono';

type Message = { id: string; role: 'user' | 'assistant'; content: string };

const initialMessages: Message[] = [
  {
    id: 'm1',
    role: 'user',
    content: 'Which workloads failed their last backup?',
  },
  {
    id: 'm2',
    role: 'assistant',
    content:
      'Two workloads failed overnight: “db-prod-01” (timeout) and “web-eu-03” (auth error). Want me to retry them?',
  },
];

const suggestions = [
  'Summarize last night’s alerts',
  'Retry failed backups',
  'Show storage trends',
];

export interface IntelligencePanelDemoProps {
  // Where the drawer overlay portals to. In shadow-root hosts (docs preview)
  // pass the shadow mount so the drawer inherits its styles; omit it in a
  // regular document (Vite portal) to portal to document.body.
  portalContainer?: HTMLElement | null;
}

export function IntelligencePanelDemo({
  portalContainer,
}: IntelligencePanelDemoProps = {}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [streaming, setStreaming] = useState(false);
  const [draft, setDraft] = useState('');

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    setMessages((prev) => [
      ...prev,
      { id: `u-${prev.length}`, role: 'user', content: value },
    ]);
    setDraft('');
    setStreaming(true);
    window.setTimeout(() => {
      setStreaming(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${prev.length}`,
          role: 'assistant',
          content: 'Done — I’ve queued that up and will report back shortly.',
        },
      ]);
    }, 1200);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Ask assistant
      </Button>

      <Drawer open={open} onOpenChange={setOpen} side="right">
        <DrawerContent side="right" portalContainer={portalContainer}>
          <DrawerHeader>
            <DrawerTitle>Assistant</DrawerTitle>
            <DrawerCloseButton />
          </DrawerHeader>
          <DrawerBody className="p-0">
            <ScrollArea className="h-full">
              <div className="flex flex-col gap-4 px-5 py-4">
                {messages.map((m) => (
                  <div key={m.id} className="flex gap-3">
                    {m.role === 'assistant' && (
                      <Avatar>
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                    )}
                    <p
                      className={
                        'text-sm leading-relaxed ' +
                        (m.role === 'user' ? 'ml-auto text-right' : '')
                      }
                    >
                      {m.content}
                    </p>
                  </div>
                ))}
                {streaming && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Avatar>
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <Spinner />
                  </div>
                )}
              </div>
            </ScrollArea>
          </DrawerBody>
          <Separator />
          <DrawerFooter className="flex-col items-stretch gap-3">
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <Chip key={s} variant="operational" onClick={() => setDraft(s)}>
                  {s}
                </Chip>
              ))}
            </div>
            <form
              className="flex items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                send(draft);
              }}
            >
              <InputTextArea
                className="flex-1"
                placeholder="Ask anything…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <ButtonIcon
                type="submit"
                aria-label="Send"
                disabled={!draft.trim() || streaming}
              >
                <SendIcon />
              </ButtonIcon>
            </form>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
