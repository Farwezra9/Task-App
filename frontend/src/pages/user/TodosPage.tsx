'use client';

import React, { useEffect, useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Button from '../../components/ui/button/button'; 
import Card from '../../components/card/card';
import Modal from '../../components/modal/modal';
import { Input, Textarea, Select } from '../../components/ui/form/input';
import { Plus, Trash2, Calendar as CalIcon, LayoutList, CheckCircle2, Circle, Filter } from 'lucide-react';
import API from '../../api/api';

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

function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string>('');
  
  // State Filter Baru
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<Todo | null>(null);

  const load = async () => {
    try {
      const res = await API.get('/todos');
      setTodos(res.data);
    } catch (err) {
      console.error("Gagal memuat data:", err);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error("Gagal memuat kategori:", err);
    }
  };

  useEffect(() => {
    load();
    loadCategories();
  }, []);

  // --- LOGIK FILTER (Mempengaruhi List dan Kalender) ---
  const filteredTodos = useMemo(() => {
    if (selectedFilter === 'all') return todos;
    return todos.filter(t => t.category_id?.toString() === selectedFilter);
  }, [todos, selectedFilter]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await API.post('/todos', {
        title,
        description,
        category_id: categoryId,
        due_date: dueDate || null
      });

      setTodos(prev => [res.data, ...prev]);
      setTitle('');
      setDescription('');
      setDueDate('');
      setCategoryId('');
      setIsModalOpen(false);
    } catch (err) {
      alert("Gagal menambah tugas");
    }
  };

  const toggle = async (task: Todo) => {
    const newStatus = !task.is_completed;
    try {
      const res = await API.put(`/todos/${task.id}`, {
        ...task,
        is_completed: newStatus,
        completed_at: newStatus ? new Date().toISOString() : null,
      });
      setTodos(prev => prev.map(t => (t.id === task.id ? res.data : t)));
    } catch (err) {
      console.error("Gagal update status");
    }
  };

  const remove = async (id: number) => {
    if (!window.confirm("Hapus tugas ini?")) return;
    try {
      await API.delete(`/todos/${id}`);
      setTodos(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Gagal menghapus");
    }
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

  // --- LOGIC CALENDAR (MENGGUNAKAN filteredTodos) ---
  const events = useMemo(() => {
    const calendarEvents: any[] = [];
    filteredTodos.forEach(task => {
      if (task.created_at) {
        calendarEvents.push({
          id: `created-${task.id}`,
          title: `📋 ${task.title}`,
          start: task.created_at,
          backgroundColor: '#0000CD', borderColor: '#0000CD', textColor: '#ffffff', display: 'block'
        });
      }
      if (task.due_date) {
        const isLate = !task.is_completed && new Date(task.due_date) < new Date();
        calendarEvents.push({
          id: `due-${task.id}`,
          title: `📌 ${task.title}`,
          start: task.due_date,
          backgroundColor: isLate ? '#DC143C' : '#FF8C00', borderColor: isLate ? '#DC143C' : '#FF8C00', textColor: isLate ? '#ffffff' : '#ffffff', display: 'block'
        });
      }
      if (task.is_completed && task.completed_at) {
        calendarEvents.push({
          id: `done-${task.id}`,
          title: `✅ ${task.title}`,
          start: task.completed_at,
          backgroundColor: '#32CD32', borderColor: '#32CD32', textColor: '#ffffff', display: 'block'
        });
      }
    });
    return calendarEvents;
  }, [filteredTodos]);

  const handleDateClick = (info: any) => {
    setDueDate(`${info.dateStr}T09:00`);
    setIsModalOpen(true);
  };

  const handleEventDrop = async (info: any) => {
    const eventIdPart = info.event.id.split('-');
    const type = eventIdPart[0];
    const id = parseInt(eventIdPart[1]);
    if (type !== 'due') {
        alert("Hanya tenggat waktu (📌) yang bisa digeser");
        info.revert();
        return;
    }
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    try {
        const res = await API.put(`/todos/${id}`, { ...todo, due_date: info.event.start?.toISOString() });
        setTodos(prev => prev.map(t => (t.id === id ? res.data : t)));
    } catch (err) {
        info.revert();
    }
  };

  return (
    <div className="p-5 md:p-8 max-w-[1440px] mx-auto font-sans bg-gray-50 min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-5 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <span className="text-indigo-600">
              <LayoutList size={36} strokeWidth={2.5} />
            </span> 
            Atur Tugasmu
          </h1>
          <p className="text-gray-500 mt-1">Kelola tugas dan pantau progres aktivitas harianmu.</p>
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
              <Card
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className="flex gap-4 items-start"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(task);
                  }}
                  className={`mt-1 transition-colors flex-shrink-0 ${
                    task.is_completed ? 'text-green-500' : 'text-gray-300 hover:text-indigo-500'
                  }`}
                >
                  {task.is_completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <span className={`text-base font-medium truncate ${task.is_completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                      {task.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(task.id);
                      }}
                      className="text-red-400 hover:text-red-600 transition-all flex-shrink-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="mt-2 pt-2 border-t border-gray-50 flex flex-col gap-1.5">
                    {task.due_date && (
                      <div className={`flex items-center gap-2 text-[11px] ${!task.is_completed && isOverdue(task.due_date) ? 'text-red-600' : 'text-amber-600'}`}>
                        <CalIcon size={12} />
                        <span>Tenggat: {formatDate(task.due_date)}</span>
                      </div>
                    )}
                    {task.completed_at && (
                      <div className="flex items-center gap-2 text-[11px] text-green-600">
                        <CheckCircle2 size={12} />
                        <span>Selesai: {formatDate(task.completed_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL: FULL CALENDAR + FILTER CATEGORY SIDEBAR */}
        <div className="flex-1 w-full flex flex-col xl:flex-row gap-6">
          
          {/* Calendar Container */}
          <div className="flex-1 bg-white p-6 rounded-[24px] border border-gray-200 shadow-sm">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' }}
                events={events}
                editable selectable 
                dayMaxEvents={false}
                displayEventTime={false}
                dateClick={handleDateClick} 
                eventDrop={handleEventDrop}
                eventClick={(info) => setSelectedEvent(info.event)}
                height="auto"
            />
          </div>

          {/* FILTER CATEGORY (DI SAMPING KANAN KALENDER) */}
          <div className="w-full xl:w-60 flex flex-col gap-4">
            <div className="bg-white p-5 rounded-[24px] border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Filter size={16} className="text-indigo-500" /> Filter Kategori
              </h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    selectedFilter === 'all' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
                  }`}
                >
                  Semua Tugas
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedFilter(cat.id.toString())}
                    className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all truncate ${
                      selectedFilter === cat.id.toString()
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* END FILTER CATEGORY */}

        </div>
      </div>

      {/* --- MODALS SECTION --- */}
      <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title="Detail Tugas">
        {selectedTask && (
          <div className="space-y-4 text-sm">
            <div><h3 className="text-lg font-bold text-gray-900">{selectedTask.title}</h3></div>
            {selectedTask.description && <div className="text-gray-700">{selectedTask.description}</div>}
            <div className="space-y-2 pt-3 border-t">
              {selectedTask.category_name && <div className="text-indigo-600 font-medium">Kategori: {selectedTask.category_name}</div>}
              {selectedTask.created_at && <div className="text-gray-500">Dibuat: {formatDate(selectedTask.created_at)}</div>}
              {selectedTask.due_date && <div className="text-amber-600">Tenggat: {formatDate(selectedTask.due_date)}</div>}
              {selectedTask.completed_at && <div className="text-green-600">Selesai: {formatDate(selectedTask.completed_at)}</div>}
            </div>
            <div className="pt-4"><Button onClick={() => setSelectedTask(null)}>Tutup</Button></div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Buat Tugas Baru">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Judul Tugas" autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="Contoh: Meeting Proyek A" />
          <Textarea label="Deskripsi (Opsional)" value={description} onChange={e => setDescription(e.target.value)} placeholder="Detail tugas..." />
          <Select
            label="Kategori"
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            options={[{ value: '', label: 'Pilih Kategori' }, ...categories.map(cat => ({ value: cat.id, label: cat.name }))]}
          />
          <Input label="Tenggat Waktu" type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 bg-white border border-gray-200 text-gray-700 py-3">Batal</Button>
            <Button type="submit" className="flex-1 py-3">Simpan Agenda</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} title="Detail Agenda">
        <div className="text-center">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4"><CalIcon size={24} /></div>
          <h4 className="text-lg font-bold text-gray-900 mb-1">{selectedEvent?.title}</h4>
          <p className="text-sm text-gray-500 mb-6">Waktu: <span className="font-semibold">{selectedEvent?.start?.toLocaleString('id-ID')}</span></p>
          <Button onClick={() => setSelectedEvent(null)}>Tutup</Button>
        </div>
      </Modal>

      <style>{`
        .fc-event { border-radius: 4px !important; padding: 3px 6px !important; cursor: pointer; margin-bottom: 2px !important; border: none !important; }
        .fc-event-title { font-size: 10px !important; font-weight: 500 !important; white-space: normal !important; }
        .fc-daygrid-event-harness { margin-bottom: 2px !important; }
        .fc-daygrid-day-frame { min-height: 120px !important; }
        .fc-toolbar-title { font-size: 1.2rem !important; font-weight: 800; }
        .fc-button-primary { background-color: #ffffff !important; border-color: #d1d5db !important; color: #374151 !important; }
        .fc-button-primary:not(:disabled).fc-button-active, .fc-button-primary:not(:disabled):active { background-color: #2563eb !important; border-color: #2563eb !important; color: #fff !important; }
      `}</style>
    </div>
  );
}

export default TodosPage;