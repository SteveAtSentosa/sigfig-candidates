import * as Api from '#/api'

import { CommonIndividualPayload, CommonListPayload, DeleteTaskPayload, ErrorPayload, SortAndFilterTasksPayload, UpdateTaskPayload } from './types'
import { CreateOptionsFromValues, populatePatientFromAppointment } from '#/utils'
import { EditableTask, EntityId, TaskFromAPI as Task } from '#/types'

import { createSelector } from 'reselect'
import { createSelectors } from './common'
import { defineAction } from 'redoodle'

// Actions

export const SortAndFilterTasks = defineAction('[tasks] filter_tasks')<SortAndFilterTasksPayload>()
export const SortAndFilterTasksError = defineAction('[tasks] filter_tasks_error')<ErrorPayload>()

export const ReloadTasks = defineAction('[tasks] reload_tasks')()

export const GetTasks = defineAction('[tasks] get_tasks')<CommonListPayload>()
export const GetTasksSuccess = defineAction('[tasks] get_tasks_success')<{ tasks: Task[] }>()
export const GetTasksError = defineAction('[tasks] get_tasks_error')<ErrorPayload>()

export const GetTaskById = defineAction('[tasks] get_task_by_id')<CommonIndividualPayload>()
export const GetTaskByIdSuccess = defineAction('[tasks] get_task_by_id_success')<{ id: EntityId }>()
export const GetTaskByIdError = defineAction('[tasks] get_task_by_id_error')<ErrorPayload>()

export const MergeTasks = defineAction('[tasks] store (merge) normalized tasks')<{ tasks: Record<EntityId, Task> }>()
export const AssignTasks = defineAction('[tasks] store (assign) normalized tasks')<{ tasks: Record<EntityId, Task> }>()

export const UpdateTask = defineAction('[tasks] update_task for main tasks page')<UpdateTaskPayload>()
export const UpdateTaskForList = defineAction('[tasks] update_task for manage tasks')<UpdateTaskPayload>()

export const CreateTask = defineAction('[tasks] create_task')<{ data: Api.CreateTaskEntity }>()
export const CreateTaskSuccess = defineAction('[tasks] create_task_success')<{ task: Task }>()
export const CreateTaskError = defineAction('[tasks] create_task_error')<ErrorPayload>()

export const DeleteTask = defineAction('[tasks] delete')<DeleteTaskPayload>()
export const DeleteTaskForList = defineAction('[tasks] delete task for list')<DeleteTaskPayload>()

export const DeleteTaskSuccess = defineAction('[tasks] delete success')()
export const DeleteTaskError = defineAction('[tasks] delete error')<{ error: Error }>()

export const SetCurrentTaskForEditing = defineAction('[tasks] set current task')<{ id: EntityId }>()
export const ClearCurrentTask = defineAction('[tasks] clear current task')()

// Caution: ClearTaskList also clears filters!
export const ClearTaskList = defineAction('[tasks] clear data')()
export const ClearTaskFilters = defineAction('[tasks] clear filters')()

export const currentTaskIdSelector = state => state.tasks.current && state.tasks.current.id
const tasksByIdSelector = state => state.tasks.byId

const _transformCurrentTask = (id: string, tasksById: { [taskId: string]: Task }): EditableTask => {
  const transformedTask: Task = id && tasksById[id] && populatePatientFromAppointment(tasksById[id])
  return transformedTask && CreateOptionsFromValues(['type', 'patients', 'assignments'], transformedTask) as EditableTask
}
export const selectCurrentTaskForEditing = createSelector([currentTaskIdSelector, tasksByIdSelector], _transformCurrentTask)

export const selectors = createSelectors<Task>('tasks')
