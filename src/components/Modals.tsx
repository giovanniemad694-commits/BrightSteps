import { X, Check } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Modal } from './ui';
import type { Child, Task, Reward, TaskCategory, TaskFrequency, Difficulty, RewardType } from '@/lib/types';
import type { Translation } from '@/lib/i18n';
import { AVATAR_OPTIONS, TASK_CATEGORIES, TASK_ICONS, REWARD_ICONS, DIFFICULTIES, REWARD_TYPES, TASK_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface TaskModalProps {
  t: Translation;
  children: Child[];
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
}

export function TaskModal({ t, children, onClose, onSave }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [childId, setChildId] = useState(children[0]?.id || '');
  const [category, setCategory] = useState<TaskCategory>('other');
  const [frequency, setFrequency] = useState<TaskFrequency>('daily');
  const [rewardType, setRewardType] = useState<RewardType>('points');
  const [rewardAmount, setRewardAmount] = useState('10');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [icon, setIcon] = useState('✅');
  const [color, setColor] = useState('blue');
  const [dueDate, setDueDate] = useState('');

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title, description: description || null, child_id: childId || null, category, frequency,
      due_date: dueDate || null, due_time: null, reward_type: rewardType,
      reward_amount: Number(rewardAmount) || 0, reward_unit: rewardType === 'money' ? 'EGP' : rewardType === 'screen_time' ? 'min' : 'points',
      difficulty, icon, color, status: 'assigned',
    });
    onClose();
  };

  return (
    <Modal title={t.addTask} onClose={onClose}>
      <div className="modal-form">
        <label>{t.taskName}<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Tidy your desk" autoFocus /></label>
        <label>{t.description}<input value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t.taskDescription} /></label>
        <label>{t.assignTo}
          <select value={childId} onChange={(e) => setChildId(e.target.value)}>
            {children.map((c) => <option key={c.id} value={c.id}>{c.avatar} {c.name}</option>)}
          </select>
        </label>
        <div className="form-row">
          <label>{t.category}
            <select value={category} onChange={(e) => setCategory(e.target.value as TaskCategory)}>
              {TASK_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.icon} {c.value}</option>)}
            </select>
          </label>
          <label>{t.frequency}
            <select value={frequency} onChange={(e) => setFrequency(e.target.value as TaskFrequency)}>
              <option value="daily">{t.daily}</option>
              <option value="weekly">{t.weekly}</option>
              <option value="one_time">{t.oneTime}</option>
            </select>
          </label>
        </div>
        <div className="form-row">
          <label>{t.rewardType}
            <select value={rewardType} onChange={(e) => setRewardType(e.target.value as RewardType)}>
              {REWARD_TYPES.map((r) => <option key={r.value} value={r.value}>{r.icon} {r.value}</option>)}
            </select>
          </label>
          <label>{t.rewardAmount}<input type="number" value={rewardAmount} onChange={(e) => setRewardAmount(e.target.value)} /></label>
        </div>
        <div className="form-row">
          <label>{t.difficulty}
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
              {DIFFICULTIES.map((d) => <option key={d.value} value={d.value}>{d.value}</option>)}
            </select>
          </label>
          <label>{t.dueDate}<input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></label>
        </div>
        <div>
          <span className="field-label">{t.chooseIcon}</span>
          <div className="emoji-picker">
            {Object.keys(TASK_ICONS).map((item) => (
              <button key={item} className={cn(icon === item && 'selected')} onClick={() => setIcon(item)}>{item}</button>
            ))}
          </div>
        </div>
        <div>
          <span className="field-label">Color</span>
          <div className="color-picker">
            {TASK_COLORS.map((c) => (
              <button key={c} className={cn('color-dot', `color-${c}`, color === c && 'selected')} onClick={() => setColor(c)} />
            ))}
          </div>
        </div>
        <div className="modal-actions">
          <button className="secondary-button" onClick={onClose}>{t.cancel}</button>
          <button className="primary-button" disabled={!title.trim()} onClick={handleSave}>{t.save}</button>
        </div>
      </div>
    </Modal>
  );
}

interface RewardModalProps {
  t: Translation;
  onClose: () => void;
  onSave: (reward: Partial<Reward>) => void;
}

export function RewardModal({ t, onClose, onSave }: RewardModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('50');
  const [icon, setIcon] = useState('🎁');
  const [rewardType, setRewardType] = useState<RewardType>('custom');

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      name, description: description || null, icon, reward_type: rewardType,
      cost: Number(cost) || 0, cost_unit: 'points', availability: 'available', stock: null,
    });
    onClose();
  };

  return (
    <Modal title={t.addReward} onClose={onClose}>
      <div className="modal-form">
        <label>{t.rewardName}<input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Choose dinner" autoFocus /></label>
        <label>{t.description}<input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A special family treat" /></label>
        <div className="form-row">
          <label>{t.rewardType}
            <select value={rewardType} onChange={(e) => setRewardType(e.target.value as RewardType)}>
              {REWARD_TYPES.map((r) => <option key={r.value} value={r.value}>{r.icon} {r.value}</option>)}
            </select>
          </label>
          <label>{t.costInPoints}<input type="number" value={cost} onChange={(e) => setCost(e.target.value)} /></label>
        </div>
        <div>
          <span className="field-label">{t.chooseIcon}</span>
          <div className="emoji-picker">
            {Object.keys(REWARD_ICONS).map((item) => (
              <button key={item} className={cn(icon === item && 'selected')} onClick={() => setIcon(item)}>{item}</button>
            ))}
          </div>
        </div>
        <div className="modal-actions">
          <button className="secondary-button" onClick={onClose}>{t.cancel}</button>
          <button className="primary-button" disabled={!name.trim()} onClick={handleSave}>{t.save}</button>
        </div>
      </div>
    </Modal>
  );
}

interface ChildModalProps {
  t: Translation;
  onClose: () => void;
  onSave: (child: Partial<Child>) => void;
}

export function ChildModal({ t, onClose, onSave }: ChildModalProps) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATAR_OPTIONS[0]);
  const [ageGroup, setAgeGroup] = useState<Child['age_group']>('primary');

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name, nickname: null, avatar, age_group: ageGroup });
    onClose();
  };

  return (
    <Modal title={t.addChild} onClose={onClose}>
      <div className="modal-form">
        <label>{t.childNickname}<input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Omar" autoFocus /></label>
        <label>{t.category}
          <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value as Child['age_group'])}>
            <option value="kg">KG</option>
            <option value="primary">Primary</option>
            <option value="prep">Prep</option>
          </select>
        </label>
        <div>
          <span className="field-label">{t.chooseAvatar}</span>
          <div className="avatar-picker">
            {AVATAR_OPTIONS.map((item) => (
              <button key={item} className={cn(avatar === item && 'selected')} onClick={() => setAvatar(item)}>{item}</button>
            ))}
          </div>
        </div>
        <div className="modal-actions">
          <button className="secondary-button" onClick={onClose}>{t.cancel}</button>
          <button className="primary-button" disabled={!name.trim()} onClick={handleSave}>{t.addChildBtn}</button>
        </div>
      </div>
    </Modal>
  );
}
