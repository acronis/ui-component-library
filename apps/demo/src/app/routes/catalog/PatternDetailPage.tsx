import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
  Stack,
  Tag,
} from '@constructor-lab/ui-react';
import {
  ArrowLeftIcon,
  CheckIcon,
  FilesIcon,
} from '@constructor-lab/icons-react/stroke-mono';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { specIndex, statusVariant, type SpecPattern } from './spec-index';
import { patternDemos } from './pattern-demos';

// Reuse the demo's established syntax-highlighter setup (see DemoWithCode):
// Prism + the vscDarkPlus theme on a dark surface, transparent inner background.
const codeStyle = {
  margin: 0,
  padding: '1rem',
  background: 'transparent',
  fontSize: '0.75rem',
  lineHeight: '1.5',
  overflow: 'auto',
} as const;

function LabeledList({ title, items }: { title: string; items: string[] }) {
  return (
    <Stack gap="sm">
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="list-disc space-y-1 ps-5 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Stack>
  );
}

function ExampleBlock({ example }: { example: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(example);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-[#1e1e1e]">
      <Button
        variant="ghost"
        onClick={handleCopy}
        className="absolute end-2 top-2 z-10 h-7 bg-black/20 px-2 text-white hover:bg-black/40"
      >
        {copied ? (
          <>
            <CheckIcon className="me-1.5 h-3.5 w-3.5" />
            <span className="text-xs">Copied</span>
          </>
        ) : (
          <>
            <FilesIcon className="me-1.5 h-3.5 w-3.5" />
            <span className="text-xs">Copy</span>
          </>
        )}
      </Button>
      <SyntaxHighlighter
        language="tsx"
        style={vscDarkPlus}
        customStyle={codeStyle}
        wrapLongLines
      >
        {example}
      </SyntaxHighlighter>
    </div>
  );
}

function PatternNotFound() {
  return (
    <Stack gap="lg">
      <Button variant="ghost" render={<Link to=".." relative="path" />}>
        <ArrowLeftIcon className="me-1.5 h-4 w-4" />
        Back to Patterns
      </Button>
      <PageHeader>
        <PageHeaderTitle>Pattern not found</PageHeaderTitle>
        <PageHeaderDescription>
          No pattern in the spec index matches this route.
        </PageHeaderDescription>
      </PageHeader>
    </Stack>
  );
}

export function PatternDetailPage() {
  const { name } = useParams<{ name: string }>();
  const pattern: SpecPattern | undefined = specIndex.patterns.find(
    (entry) => entry.name === name
  );

  if (!pattern) return <PatternNotFound />;

  const Demo = patternDemos[pattern.name];

  return (
    <Stack gap="xl">
      <Button variant="ghost" render={<Link to=".." relative="path" />}>
        <ArrowLeftIcon className="me-1.5 h-4 w-4" />
        Back to Patterns
      </Button>

      <PageHeader>
        <div className="flex items-start justify-between gap-2">
          <PageHeaderTitle>{pattern.pattern}</PageHeaderTitle>
          <Tag variant={statusVariant(pattern.status)} size="sm">
            {pattern.status}
          </Tag>
        </div>
        {pattern.intent ? (
          <PageHeaderDescription>{pattern.intent}</PageHeaderDescription>
        ) : null}
      </PageHeader>

      <Stack gap="lg">
        {pattern.description ? (
          <p className="text-sm text-muted-foreground">{pattern.description}</p>
        ) : null}

        {pattern.components && pattern.components.length > 0 ? (
          <Stack gap="sm">
            <h3 className="text-sm font-semibold">Components</h3>
            <div className="flex flex-wrap gap-2">
              {pattern.components.map((component) => (
                <Tag key={component} variant="neutral" size="sm">
                  {component}
                </Tag>
              ))}
            </div>
          </Stack>
        ) : null}

        {pattern.implementedBy ? (
          <div>
            <Tag variant="success">{`Graduated → ${pattern.implementedBy}`}</Tag>
          </div>
        ) : null}

        {pattern.when_to_use && pattern.when_to_use.length > 0 ? (
          <LabeledList title="When to use" items={pattern.when_to_use} />
        ) : null}

        {pattern.when_not_to_use && pattern.when_not_to_use.length > 0 ? (
          <LabeledList
            title="When not to use"
            items={pattern.when_not_to_use}
          />
        ) : null}

        {pattern.anti_patterns && pattern.anti_patterns.length > 0 ? (
          <LabeledList title="Anti-patterns" items={pattern.anti_patterns} />
        ) : null}
      </Stack>

      {Demo ? (
        <Card>
          <CardHeader>
            <CardTitle>Live preview</CardTitle>
          </CardHeader>
          <CardContent>
            <Demo />
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Example</CardTitle>
        </CardHeader>
        <CardContent>
          {pattern.example ? (
            <ExampleBlock example={pattern.example} />
          ) : (
            <p className="text-sm italic text-muted-foreground">
              No example yet.
            </p>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
