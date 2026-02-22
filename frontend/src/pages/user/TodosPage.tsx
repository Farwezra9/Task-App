'use client';

import React, { useEffect, useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Button from '../../components/ui/button/button'; 
import Card from '../../components/card/card';
import Modal from '../../components/modal/modal';
import { Input, Textarea } from '../../components/ui/form/input';
import { Plus, Trash2, Calendar as CalIcon, LayoutList, ClipboardPlus, CheckCircle2, Circle, X } from 'lucide-react';
import API from '../../api/api';

type Todo = {
  id: number;
  title: string;
  description?: string;
  is_completed: boolean;
  due_date?: string;
  created_at?: string;
  completed_at?: string | null;
};

function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const load = async () => {
    try {
      const res = await API.get('/todos');
      setTodos(res.data);
    } catch (err) {
      console.error("Gagal memuat data:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await API.post('/todos', {
        title,
        description,
        due_date: dueDate || null
      });

      setTodos(prev => [res.data, ...prev]);
      // Reset & Close
      setTitle('');
      setDescription('');
      setDueDate('');
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

  // --- LOGIC CALENDAR (TIDAK BERUBAH) ---
  const events = useMemo(() => {
    const calendarEvents: any[] = [];
    todos.forEach(task => {
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
  }, [todos]);

  const handleDateClick = (info: any) => {
    setDueDate(`${info.dateStr}T09:00`);
    setIsModalOpen(true); // Buka modal saat tanggal diklik
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
<div className="w-full lg:w-[450px] space-y-4">
  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 px-1">
    <CalIcon size={20} className="text-indigo-500" /> Daftar Tugas
  </h3>
  
  <div className="flex flex-col gap-3">
    {todos.length === 0 && (
      <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400">
        Belum ada tugas hari ini.
      </div>
    )}

    {todos.map(task => (
      <Card key={task.id} className="flex gap-4">
        {/* Tombol Checkbox */}
        <button 
          onClick={() => toggle(task)}
          className={`mt-1 transition-colors flex-shrink-0 ${task.is_completed ? 'text-green-500' : 'text-gray-300 hover:text-indigo-500'}`}
        >
          {task.is_completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <span className={`text-base transition-all truncate ${task.is_completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
              {task.title}
            </span>
            <button 
              onClick={() => remove(task.id)} 
              className="text-red-400 hover:text-red-600 transition-all flex-shrink-0"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {task.description && <p className="mt-1 text-sm text-gray-600 line-clamp-2">{task.description}</p>}

          {/* Timestamps */}
          <div className="mt-3 pt-3 border-t border-gray-50 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[10px] text-indigo-600">
              <ClipboardPlus size={12}/> 
              <span>Dibuat : {formatDate(task.created_at)}</span>
            </div>
            
            {task.due_date && (
              <div className={`flex items-center gap-2 text-[10px] ${!task.is_completed && isOverdue(task.due_date) ? 'text-red-600' : 'text-amber-600'}`}>
                <CalIcon size={12} /> <span>Tenggat : {formatDate(task.due_date)}</span>
              </div>
            )}

            {task.is_completed && (
              <div className="flex items-center gap-2 text-[10px] text-green-600">
                <CheckCircle2 size={12} /> <span>Selesai : {formatDate(task.completed_at)}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    ))}
  </div>
</div>

        {/* RIGHT PANEL: FULL CALENDAR */}
        <div className="flex-1 w-full bg-white p-6 rounded-[24px] border border-gray-200 shadow-sm">
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
      </div>

      {/* ... bagian atas sama ... */}

{/* MODAL INPUT TASK */}
<Modal 
  isOpen={isModalOpen} 
  onClose={() => setIsModalOpen(false)} 
  title="Buat Tugas Baru"
>
  <form onSubmit={handleAdd} className="space-y-4">
    <Input 
      label="Judul Tugas"
      autoFocus
      value={title}
      onChange={e => setTitle(e.target.value)}
      placeholder="Contoh: Meeting Proyek A"
    />
    
    <Textarea 
      label="Deskripsi (Opsional)"
      value={description}
      onChange={e => setDescription(e.target.value)}
      placeholder="Detail tugas..."
    />

    <Input 
      label="Tenggat Waktu"
      type="datetime-local"
      value={dueDate}
      onChange={e => setDueDate(e.target.value)}
    />

    <div className="flex gap-3 pt-2">
      <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 bg-white border border-gray-200 text-gray-700 py-3">
        Batal
      </Button>
      <Button type="submit" className="flex-1 py-3">
        Simpan Agenda
      </Button>
    </div>
  </form>
</Modal>

{/* MODAL DETAIL EVENT (Klik Kalender) */}
<Modal 
  isOpen={!!selectedEvent} 
  onClose={() => setSelectedEvent(null)} 
  title="Detail Agenda"
>
  <div className="text-center">
    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
      <CalIcon size={24} />
    </div>
    <h4 className="text-lg font-bold text-gray-900 mb-1">{selectedEvent?.title}</h4>
    <p className="text-sm text-gray-500 mb-6">
      Waktu: <span className="font-semibold">{selectedEvent?.start?.toLocaleString('id-ID')}</span>
    </p>
    <Button onClick={() => setSelectedEvent(null)} 
    >
      Tutup
    </Button>
  </div>
</Modal>

      {/* CSS CALENDAR REMAINS THE SAME */}
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