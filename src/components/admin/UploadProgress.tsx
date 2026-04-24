import Icon from '@/components/ui/icon';

interface Props {
  current: number;
  total: number;
}

const UploadProgress = ({ current, total }: Props) => {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;
  const done = current >= total && total > 0;
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-muted/60 border border-border/60 mb-2">
      <Icon name={done ? 'Check' : 'Loader2'} size={16} className={done ? 'text-[hsl(var(--forest))]' : 'animate-spin text-[hsl(var(--forest))]'} />
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground mb-1">
          {done ? 'Готово' : `Обработка фото ${current}/${total}`}
        </div>
        <div className="h-1.5 w-full bg-border/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-[hsl(var(--forest))] transition-all duration-200"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      <div className="text-xs tabular-nums text-muted-foreground">{percent}%</div>
    </div>
  );
};

export default UploadProgress;
