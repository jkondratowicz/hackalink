import React from 'react';
import { HackathonDetailsProps } from './HackathonDetails';

export function AddPrize({ hackathonMetadata }: HackathonDetailsProps) {
  // TODO form to add a prize
  return (
    <pre>{JSON.stringify(hackathonMetadata, null, 2) }</pre>
  )
}
