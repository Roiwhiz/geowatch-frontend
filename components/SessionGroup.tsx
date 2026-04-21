import SessionItem from "./SessionItem";
import { Session } from "@/lib/validators/schemas";

export default function SessionGroup({
  label,
  sessions,
  activeSessionId,
  onDelete,
  onRename,
}: {
  label: string;
  sessions: Session[];
  activeSessionId: string | null;
  onDelete: (id: string) => void | Promise<void>;
  onRename: (id: string, title: string) => void | Promise<void>;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-muted-foreground uppercase px-2">
        {label}
      </p>

      {sessions.map((session) => (
        <SessionItem
          key={session.id}
          session={session}
          isActive={activeSessionId === session.id}
          onDelete={onDelete}
          onRename={onRename}
        />
      ))}
    </div>
  );
}
