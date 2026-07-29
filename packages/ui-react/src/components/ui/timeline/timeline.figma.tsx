// Figma Code Connect — status: COMPLETE
// The Figma "Timeline" page (6025:24403) publishes exactly one component:
// `TimelineItem` (7615:7791) — a single symbol with no variant set. Its five
// properties (verified via get_context_for_code_connect) map as follows:
//
//   Title#7615:1          TEXT     -> title
//   Tag#7615:2            BOOLEAN  -> tag (mapped to a <Tag> when true)
//   Content#7623:3        SLOT     -> children (the event body)
//   Footer#7623:4         BOOLEAN  -> actions (mapped to the FooterActions slot)
//   FooterActions#7623:6  SLOT     -> the nodes the Footer boolean reveals
//
// The booleans are mapped with `figma.boolean`'s value map rather than a ternary
// in the example: the parser resolves prop references statically and rejects
// `tag ? <Tag/> : undefined`.
//
// Two things are deliberately absent from the mapping:
//   • `Timestamp` is a plain text node in the design with no component
//     property, so Figma cannot supply it — the example shows a literal.
//   • the marker is an `Avatar` **instance**, not a property, so it is shown
//     composed rather than bound.
// There is no `Timeline` (list) component in Figma — the design's "Timeline"
// frames are plain frames of item instances — so only the item is connected.
import figma from '@figma/code-connect';

import { Timeline, TimelineItem } from './timeline';
import { Avatar, AvatarFallback } from '../avatar';
import { Tag } from '../tag';

figma.connect(
  TimelineItem,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=7615-7791',
  {
    props: {
      title: figma.string('Title#7615:1'),
      tag: figma.boolean('Tag#7615:2', {
        true: <Tag variant="success">To customer</Tag>,
        false: undefined,
      }),
      content: figma.children('Content'),
      actions: figma.boolean('Footer#7623:4', {
        true: figma.children('FooterActions'),
        false: undefined,
      }),
    },
    example: ({ title, tag, content, actions }) => (
      <Timeline>
        <TimelineItem
          marker={
            <Avatar color="gray">
              <AvatarFallback>MC</AvatarFallback>
            </Avatar>
          }
          title={title}
          timestamp="Dec 22, 08:30 AM"
          tag={tag}
          actions={actions}
        >
          {content}
        </TimelineItem>
      </Timeline>
    ),
  }
);
