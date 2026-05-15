export interface AuditEvent {
  action: string;
  entityType: string;
  entityId?: string;
}

