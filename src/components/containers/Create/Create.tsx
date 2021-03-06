import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { toast } from 'react-toastify';

// Styles
import styles from './Create.module.scss';

// Store
import * as actions from '../../../store/actions';
import { TaskActionPartial } from '../../../store/reducers/task.reducer';

// Constants
import { PRIORITY_LEVELS, PRIORITY_ORDER_TYPE } from '../../../constants/priorityLevels.constants';
import { NEW_TASK_ID } from '../../../constants/common';

// Models
import { Priority } from '../../../models/priority.model';
import { Task } from '../../../models/task.model';

// Components
import { Button } from '../../presentational/UI/Button/Button';

type DispatchProps = {
  onSave: (newTask: Task) => void;
}

type Props = DispatchProps;

export const Create: React.FC<Props> = (props: Props) => {
  const history = useHistory();

  const defaultPriorityLevel =
    PRIORITY_LEVELS.find((priorityLevel) => priorityLevel.isDefaultSelected === true) as Priority;

  const [name, setName] = useState<string>('');
  const [errorOnName, setErrorOnName] = useState<boolean>(false);
  const [priority, setPriority] = useState<PRIORITY_ORDER_TYPE>(defaultPriorityLevel.order);

  const cancelHandler = () => {
    history.push('/todolist');
  };

  const saveHandler = () => {
    if (!name) {
      toast.warning('A task needs a name');
      setErrorOnName(true);
    } else {
      setErrorOnName(false);

      const newTask: Task = {
        id: NEW_TASK_ID,
        displayName: name,
        priority,
        done: false,
      };
      props.onSave(newTask);

      history.push('/todolist');
    }
  };

  const priorityChangeHandler = (event: React.SyntheticEvent<HTMLSelectElement, Event>) => {
    const priorityOrder = Number((event.target as HTMLSelectElement).value);
    setPriority(priorityOrder);
  };

  return (
    <React.Fragment>
      <header className={styles.createTask__header}>
        <h1>Create task</h1>
      </header>
      <main>
        <section>
          <form>
            <div className={styles.createTask__formRow}>
              <label>
                Task:
              </label>
              <input
                data-testid="createTask_inputName"
                onBlur={() => setErrorOnName(false)}
                onChange={(e) => setName(e.target.value)}
                value={name}
                type='text'
                className={` ${errorOnName ? styles.danger : ''}`} />
            </div>
            <div className={styles.createTask__formRow}>
              <label>
                Priority:
              </label>
              <select
                data-testid="createTask_prioritySelect"
                onChange={(e) => priorityChangeHandler(e)}
                value={priority}>
                {PRIORITY_LEVELS.map((priorityLevel) => {
                  return <option key={priorityLevel.order} value={priorityLevel.order}>{priorityLevel.displayText}</option>;
                })}
              </select>
            </div>
          </form>
          <div className={styles.createTask__buttonGroup}>
            <Button
              tooltip='Cancel changes and go to task list'
              displayText='Cancel'
              buttonStyle='dismiss'
              iconName='arrow-left'
              size='big'
              onClick={cancelHandler} />
            <Button
              tooltip='Save changes and go to task list'
              displayText='Save'
              buttonStyle='add'
              iconName='save'
              size='big'
              onClick={saveHandler} />
          </div>
        </section>
      </main>
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<TaskActionPartial>): DispatchProps => {
  return {
    onSave: (newTask) => dispatch(actions.task.taskCreate(newTask)),
  };
};


const connector = connect(null, mapDispatchToProps);
export default connector(Create);