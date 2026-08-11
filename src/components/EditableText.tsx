import { Check, Pencil, X } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSiteContent } from '../context/SiteContentContext';

interface EditableTextProps {
  contentKey: string;
  defaultValue: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3';
  className?: string;
  multiline?: boolean;
}

// عنصر نص عادي للزوار، وقابل للتعديل مباشرة لو الأدمن (صاحب الحساب) مسجل دخوله
export const EditableText: React.FC<EditableTextProps> = ({
  contentKey,
  defaultValue,
  as: Tag = 'span',
  className = '',
  multiline = false,
}) => {
  const { isAdmin } = useAuth();
  const { content, save } = useSiteContent();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);

  const currentValue = content[contentKey] ?? defaultValue;

  if (!isAdmin) {
    return <Tag className={className}>{currentValue}</Tag>;
  }

  if (!editing) {
    return (
      <span className="relative inline-flex items-start gap-1 group/editable">
        <Tag className={className}>{currentValue}</Tag>
        <button
          onClick={() => {
            setDraft(currentValue);
            setEditing(true);
          }}
          className="opacity-0 group-hover/editable:opacity-100 transition-opacity p-1 rounded-md bg-purple-600/80 text-white shrink-0 mt-1 cursor-pointer"
          title="تعديل النص"
        >
          <Pencil className="w-3 h-3" />
        </button>
      </span>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await save(contentKey, draft);
      setEditing(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'حصل خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <span className="inline-flex flex-col gap-1 items-start w-full">
      {multiline ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full min-w-[240px] rounded-lg bg-slate-900 border border-purple-500/40 text-slate-100 p-2 text-sm"
          rows={3}
          autoFocus
        />
      ) : (
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full min-w-[240px] rounded-lg bg-slate-900 border border-purple-500/40 text-slate-100 p-2 text-sm"
          autoFocus
        />
      )}
      <span className="flex items-center gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-600 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
        >
          <Check className="w-3 h-3" /> حفظ
        </button>
        <button
          onClick={() => setEditing(false)}
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-700 text-white text-xs font-bold cursor-pointer"
        >
          <X className="w-3 h-3" /> إلغاء
        </button>
      </span>
    </span>
  );
};
