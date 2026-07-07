'use client';

import {
  Button,
  Tour,
  TourActions,
  TourBackButton,
  TourBeacon,
  TourBody,
  TourClose,
  TourContent,
  TourDescription,
  TourFooter,
  TourHeader,
  TourNextButton,
  TourSkipButton,
  TourStepCounter,
  TourTitle,
  TourTrigger,
} from '@spec-lab/ui-react';
import { useShadowMount } from '@/components/ShadowDemo';

export function TourDemo() {
  const mount = useShadowMount();
  return (
    <Tour stepCount={5} defaultActiveStep={1} defaultOpen>
      <span className="relative inline-flex">
        <TourBeacon className="absolute -left-1 -top-1" />
        <TourTrigger render={<Button variant="secondary">Protection</Button>} />
      </span>
      <TourContent side="right" portalContainer={mount}>
        <TourClose />
        <TourHeader>
          <TourTitle>Protection management</TourTitle>
        </TourHeader>
        <TourBody>
          <TourDescription>
            Manage backups, security, and recovery for every workload from this
            section.
          </TourDescription>
        </TourBody>
        <TourFooter>
          <TourStepCounter />
          <TourActions>
            <TourSkipButton />
            <TourBackButton />
            <TourNextButton />
          </TourActions>
        </TourFooter>
      </TourContent>
    </Tour>
  );
}
