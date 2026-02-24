'use client';

import React, { useEffect, useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Button from '../../components/ui/button/button'; 
import Card from '../../components/card/card';
import Modal from '../../components/modal/modal';
import Alert from '../../components/ui/alert/alert';
import { Input, Textarea, Select } from '../../components/ui/form/input';
import { Plus, Trash2, Clock, Calendar as CalIcon, LayoutList, CheckCircle2, Circle, Filter } from 'lucide-react';

// --- Types ---
type Todo = {
  id: number;
  title: string;
  description?: string;
  is_completed: boolean;
  category_id?: number;
  category_name?: string;
  due_date?: string;
  created_at?: string;
  completed_at?: string | null;
};

type Category = {
  id: number;
  name: string;
};

// --- Dummy Data untuk Demo ---
const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: 'Pekerjaan' },
  { id: 2, name: 'Pribadi' },
  { id: 3, name: 'Belanja' },
  { id: 4, name: 'Kesehatan' },
];
const getFutureDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};
const INITIAL_TODOS: Todo[] = [
  {
    id: 1,
    title: 'Meeting Persiapan Demo',
    description: 'Membahas fitur utama aplikasi ke stakeholder.',
    is_completed: false,
    category_id: 1,
    category_name: 'Pekerjaan',
    due_date: getFutureDate(3),
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Olahraga Pagi',
    is_completed: true,
    category_id: 4,
    category_name: 'Kesehatan',
    due_date: getFutureDate(6),
    created_at: new Date().toISOString(),
    completed_at: getFutureDate(3),
  }
];

function TodosPage() {
  // State Management (Local Only)
  const [todos, setTodos] = useState<Todo[]>(INITIAL_TODOS);
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');

  // Filter State
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<Todo | null>(null);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
    onConfirm: undefined as (() => void) | undefined,
    confirmLabel: 'Oke'
  });

  const showAlert = (
    title: string, 
    message: string, 
    type: 'success' | 'error' | 'warning' | 'info' = 'success', 
    onConfirm?: () => void,
    confirmLabel: string = 'Oke'
  ) => {
    setAlertConfig({ isOpen: true, title, message, type, onConfirm, confirmLabel });
  };

  const closeAlert = () => setAlertConfig(prev => ({ ...prev, isOpen: false }));

  // Detect mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Filter logic
  const filteredTodos = useMemo(() => {
    if (selectedFilter === 'all') return todos;
    return todos.filter(t => t.category_id?.toString() === selectedFilter);
  }, [todos, selectedFilter]);

  // --- Handlers (Mocking API Logic) ---

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedCat = categories.find(c => c.id.toString() === categoryId);

    const newTodo: Todo = {
      id: Date.now(),
      title,
      description,
      category_id: categoryId ? parseInt(categoryId) : undefined,
      category_name: selectedCat?.name,
      due_date: dueDate || undefined,
      is_completed: false,
      created_at: new Date().toISOString(),
      completed_at: null,
    };

    setTodos(prev => [newTodo, ...prev]);
    setTitle(''); setDescription(''); setDueDate(''); setCategoryId('');
    setIsModalOpen(false);
    
    // Alert Berhasil Tambah
    showAlert("Berhasil Tambah", `Tugas "${title}" telah ditambahkan ke daftar.`, "success");
  };

  const toggle = (task: Todo) => {
    const newStatus = !task.is_completed;
    setTodos(prev => prev.map(t => 
      t.id === task.id 
        ? { ...t, is_completed: newStatus, completed_at: newStatus ? new Date().toISOString() : null } 
        : t
    ));

    // Alert Ceklis Tugas
    if (newStatus) {
      showAlert("Tugas Selesai", `Selamat! Tugas "${task.title}" telah diselesaikan.`, "success");
    }
  };

  const remove = (id: number) => {
    const task = todos.find(t => t.id === id);
    showAlert(
      "Hapus Tugas?", 
      `Apakah Anda yakin ingin menghapus "${task?.title}"? Tugas yang dihapus tidak bisa dikembalikan lagi ke daftar.`, 
      "warning", 
      () => {
        setTodos(prev => prev.filter(p => p.id !== id));
        closeAlert();
        // Feedback Berhasil Hapus
        setTimeout(() => showAlert("Berhasil Hapus", "Tugas telah dihapus.", "success"), 100);
      },
      "Ya, Hapus"
    );
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const isOverdue = (dateStr?: string) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  };

  // Calendar events transformation
  const events = useMemo(() => {
    const calendarEvents: any[] = [];
    filteredTodos.forEach(task => {
      if (task.created_at) {
        calendarEvents.push({
          id: `created-${task.id}`,
          title: `📋 ${task.title}`,
          start: task.created_at,
          backgroundColor: '#4F46E5',
          borderColor: '#4F46E5',
          textColor: '#ffffff',
          display: 'block',
          extendedProps: { created_at: task.created_at }
        });
      }
      if (task.due_date) {
        const isLate = !task.is_completed && new Date(task.due_date) < new Date();
        calendarEvents.push({
          id: `due-${task.id}`,
          title: `📌 ${task.title}`,
          start: task.due_date,
          backgroundColor: isLate ? '#EF4444' : '#F59E0B',
          borderColor: isLate ? '#EF4444' : '#F59E0B',
          textColor: '#ffffff',
          display: 'block',
          extendedProps: { created_at: task.created_at }
        });
      }
      if (task.is_completed && task.completed_at) {
        calendarEvents.push({
          id: `done-${task.id}`,
          title: `✅ ${task.title}`,
          start: task.completed_at,
          backgroundColor: '#10B981',
          borderColor: '#10B981',
          textColor: '#ffffff',
          display: 'block',
          extendedProps: { created_at: task.created_at }
        });
      }
    });
    return calendarEvents;
  }, [filteredTodos]);

  const handleDateClick = (info: any) => {
    setDueDate(`${info.dateStr}T09:00`);
    setIsModalOpen(true);
  };

  const handleEventDrop = (info: any) => {
    const [type, idStr] = info.event.id.split('-');
    const id = parseInt(idStr);

    if (type !== 'due') {
      showAlert(
        "Aksi Dibatalkan", 
        "Hanya tenggat waktu (📌) yang bisa digeser posisinya.", 
        "info"
      );
      info.revert();
      return;
    }

    setTodos(prev => prev.map(t => 
      t.id === id ? { ...t, due_date: info.event.start?.toISOString() } : t
    ));
    showAlert("Tenggat Diperbarui", "Jadwal berhasil dipindahkan.", "success");
  };

  return (
    <div className="p-5 md:p-8 max-w-[1440px] mx-auto font-sans bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-5 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <span className="text-indigo-600"><LayoutList size={36} strokeWidth={2.5} /></span>
            Atur Tugasmu
          </h1>
          <p className="text-gray-500 mt-1">Simulasi pengelolaan tugas tanpa database.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus size={18} /> Tambah Tugas
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* LEFT PANEL: TASK LIST */}
        <div className="w-full lg:w-[400px] space-y-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 px-1">
            <CalIcon size={20} className="text-indigo-500" /> Daftar Tugas
          </h3>
          <div className="flex flex-col gap-3">
            {filteredTodos.length === 0 && (
              <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400">
                Belum ada tugas di kategori ini.
              </div>
            )}

            {filteredTodos.map(task => (
              <Card key={task.id} onClick={() => setSelectedTask(task)} className="flex gap-4 items-start cursor-pointer hover:shadow-md transition-shadow">
                <button
                  onClick={(e) => { e.stopPropagation(); toggle(task); }}
                  className={`mt-1 transition-colors flex-shrink-0 ${task.is_completed ? 'text-green-500' : 'text-gray-300 hover:text-indigo-500'}`}
                >
                  {task.is_completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <span className={`text-base font-medium truncate ${task.is_completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                      {task.title}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); remove(task.id); }}
                      className="text-red-400 hover:text-red-600 transition-all flex-shrink-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="mt-2 pt-2 border-t border-gray-50 flex flex-col gap-1.5">
                    {task.due_date && (
                      <div className={`flex items-center gap-2 text-[11px] ${!task.is_completed && isOverdue(task.due_date) ? 'text-red-600' : 'text-amber-600'}`}>
                        <CalIcon size={12} /> Tenggat: {formatDate(task.due_date)}
                      </div>
                    )}
                    {task.completed_at && (
                      <div className="flex items-center gap-2 text-[11px] text-green-600">
                        <CheckCircle2 size={12} /> Selesai: {formatDate(task.completed_at)}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL: CALENDAR + FILTER */}
        <div className="flex-1 w-full flex flex-col xl:flex-row gap-6">
          <div className="flex-1 bg-white p-6 rounded-[24px] border border-gray-200 shadow-sm">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={isMobile
                ? { left: "prev,next", center: "title", right: "" }
                : { left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek" }}
              events={events}
              editable
              selectable
              dayMaxEvents={isMobile ? 2 : false}
              displayEventTime={false}
              dateClick={handleDateClick}
              eventDrop={handleEventDrop}
              eventClick={(info) => setSelectedEvent(info.event)}
              height="auto"
            />
          </div>

          <div className="w-full xl:w-60 flex flex-col gap-4">
            <div className="bg-white p-5 rounded-[24px] border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Filter size={16} className="text-indigo-500" /> Filter Kategori
              </h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedFilter === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'}`}
                >
                  Semua Tugas
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedFilter(cat.id.toString())}
                    className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all truncate ${selectedFilter === cat.id.toString() ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      
      {/* Detail Task Modal */}
      <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title="Detail Tugas">
        {selectedTask && (
          <div className="space-y-4 text-sm">
            <h3 className="text-lg font-bold text-gray-900">{selectedTask.title}</h3>
            {selectedTask.description && <div className="text-gray-700">{selectedTask.description}</div>}
            <div className="space-y-2 pt-3 border-t">
              {selectedTask.category_name && <div className="text-indigo-600 font-medium">Kategori: {selectedTask.category_name}</div>}
              {selectedTask.created_at && <div className="text-gray-500">Dibuat: {formatDate(selectedTask.created_at)}</div>}
              {selectedTask.due_date && <div className="text-amber-600">Tenggat: {formatDate(selectedTask.due_date)}</div>}
              {selectedTask.completed_at && <div className="text-green-600">Selesai: {formatDate(selectedTask.completed_at)}</div>}
            </div>
            <div className="pt-4"><Button className="w-full" onClick={() => setSelectedTask(null)}>Tutup</Button></div>
          </div>
        )}
      </Modal>

      {/* Add Task Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Buat Tugas Baru">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Judul Tugas" autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="Contoh: Meeting Proyek A" required />
          <Textarea label="Deskripsi (Opsional)" value={description} onChange={e => setDescription(e.target.value)} placeholder="Detail tugas..." />
          <Select
            label="Kategori"
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            options={[{ value: '', label: 'Pilih Kategori' }, ...categories.map(cat => ({ value: cat.id, label: cat.name }))]}
          />
          <Input label="Tenggat Waktu" type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 bg-white border border-gray-200 text-gray-700">Batal</Button>
            <Button type="submit" className="flex-1">Simpan Agenda</Button>
          </div>
        </form>
      </Modal>

      {/* Event Detail Modal (Calendar) */}
      <Modal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} title="Detail Agenda">
        <div className="text-center p-2">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5 rotate-3">
            <CalIcon size={32} strokeWidth={2.5} />
          </div>

          <h4 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
            {selectedEvent?.title.replace(/📋|📌|✅/g, '').trim()}
          </h4>
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-100 rounded-full text-xs font-semibold text-gray-600 mb-6">
            <CalIcon size={14} />
            {selectedEvent?.start?.toLocaleString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
            {selectedEvent?.start && (() => {
              const taskProps = selectedEvent.extendedProps;
              const baseDate = taskProps?.created_at ? new Date(taskProps.created_at) : new Date();
              const eventDate = new Date(selectedEvent.start);
              
              const d1 = Date.UTC(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
              const d2 = Date.UTC(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
              const diffDays = Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
              
              if (selectedEvent.title.includes('✅')) {
                return (
                  <div className="flex flex-col items-center gap-2 text-green-600">
                    <CheckCircle2 size={32} strokeWidth={2.5} />
                    <p className="text-lg font-bold">Selesai!</p>
                    <span className="text-xs text-gray-400 font-medium italic">Tugas telah diselesaikan</span>
                  </div>
                );
              }

              if (diffDays < 0) {
                return (
                  <div className="flex flex-col items-center gap-2 text-red-500">
                    <Trash2 size={32} strokeWidth={2.5} />
                    <p className="text-lg font-bold">Terlambat {Math.abs(diffDays)} Hari</p>
                    <span className="text-xs text-gray-400 font-medium italic">Melewati batas waktu sejak dibuat</span>
                  </div>
                );
              }

              if (diffDays === 0) {
                return (
                  <div className="flex flex-col items-center gap-2 text-amber-500">
                    <Plus size={32} strokeWidth={2.5} />
                    <p className="text-lg font-bold">Dibuat Hari Ini</p>
                    <span className="text-xs text-gray-400 font-medium italic">Tugas baru saja ditambahkan</span>
                  </div>
                );
              }

              return (
                <div className="flex flex-col items-center gap-2 text-indigo-600">
                  <Clock size={32} strokeWidth={2.5} />
                  <p className="text-lg font-bold">{diffDays} Hari Lagi!</p>
                  <span className="text-xs text-gray-400 font-medium italic">Selesaikan sebelum tenggat waktu</span>
                </div>
              );
            })()}
          </div>

          <Button 
            variant="royal" 
            className="w-full h-12 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
            onClick={() => setSelectedEvent(null)}
          >
            Tutup Detail
          </Button>
        </div>
      </Modal>

      <Alert 
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        confirmLabel={alertConfig.confirmLabel}
        onClose={closeAlert}
        onConfirm={alertConfig.onConfirm}
      />

      {/* --- Global CSS Styles --- */}
      <style>{`
        .fc-event { border-radius: 6px !important; padding: 4px 8px !important; cursor: pointer; margin-bottom: 2px !important; border: none !important; transition: opacity 0.2s; }
        .fc-event:hover { opacity: 0.9; }
        .fc-event-title { font-size: 11px !important; font-weight: 600 !important; }
        .fc-daygrid-day-frame { min-height: 120px !important; }
        .fc-toolbar-title { font-size: 1.25rem !important; font-weight: 800; color: #111827; }
        .fc-button-primary { background-color: #ffffff !important; border-color: #e5e7eb !important; color: #374151 !important; font-weight: 600 !important; text-transform: capitalize !important; }
        .fc-button-primary:not(:disabled).fc-button-active, .fc-button-primary:not(:disabled):active { background-color: #4F46E5 !important; border-color: #4F46E5 !important; color: #fff !important; }
        .fc-theme-standard td, .fc-theme-standard th { border-color: #f3f4f6 !important; }

        @media (max-width: 768px) {
          .fc-toolbar { flex-direction: column !important; gap: 12px; }
          .fc-daygrid-day-frame { min-height: 90px !important; }
          .fc-toolbar-title { font-size: 1.1rem !important; }
        }
      `}</style>
    </div>
  );
}

export default TodosPage;