/** Emitted on `social-midia:connection-changed` when Meow instance connects/disconnects. */
export interface ISocialMidiaConnectionChangedPayload {
  socialMidiaId: number;
  enterpriseId: string;
  instanceKey: string;
  connected: boolean;
  event: string;
}
