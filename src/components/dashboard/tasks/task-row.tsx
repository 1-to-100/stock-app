'use client';

import * as React from 'react';
import Typography from '@mui/joy/Typography';
import { Clock as ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';
import dayjs from 'dayjs';

import { TaskCategory } from './task-category';
import { TaskPriority } from './task-priority';
import type { Column, Task } from './types';

export interface TaskRowProps {
  column?: Pick<Column, 'id' | 'name'>;
  onOpen?: (taskId: string) => void;
  task: Omit<Task, 'columnId'>;
}

export function TaskRow({ column, onOpen, task }: TaskRowProps): React.JSX.Element {
  const { category, dueDate, id, priority, title } = task;

  return (
    <tr>
      <td>
        <Typography
          noWrap
          onClick={(): void => onOpen?.(id)}
          sx={{ cursor: 'pointer', ':hover': { color: 'var(--joy-palette-primary-plainColor)' } }}
        >
          {title}
        </Typography>
      </td>
      <td>{category ? <TaskCategory category={category} /> : null}</td>
      <td>
        {dueDate ? (
          <Typography level="body-xs" startDecorator={<ClockIcon fontSize="var(--Icon-fontSize)" weight="bold" />}>
            {dayjs(dueDate).diff(dayjs(), 'day')} days
          </Typography>
        ) : null}
      </td>
      <td>{priority ? <TaskPriority priority={priority} /> : null}</td>
      <td>{column?.name}</td>
    </tr>
  );
}
