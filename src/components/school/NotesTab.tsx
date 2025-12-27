import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Note {
  id: number;
  student_id: number;
  title: string;
  subject: string;
  topic: string;
  content: string;
  note_type: string;
  created_at: string;
}

interface NotesTabProps {
  studentId: number | null;
}

export const NotesTab = ({ studentId }: NotesTabProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadNotes();
  }, [studentId]);

  const loadNotes = () => {
    try {
      const storedNotes = JSON.parse(localStorage.getItem('student_notes') || '[]');
      const filteredNotes = studentId 
        ? storedNotes.filter((note: Note) => note.student_id === studentId)
        : storedNotes;
      setNotes(filteredNotes);
    } catch (err) {
      console.error('Failed to load notes:', err);
      setNotes([]);
    }
  };

  const deleteNote = (noteId: number) => {
    try {
      const storedNotes = JSON.parse(localStorage.getItem('student_notes') || '[]');
      const updatedNotes = storedNotes.filter((note: Note) => note.id !== noteId);
      localStorage.setItem('student_notes', JSON.stringify(updatedNotes));
      loadNotes();
      setSelectedNote(null);
      toast({
        title: 'Заметка удалена',
        description: 'Конспект успешно удалён из библиотеки'
      });
    } catch (err) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить заметку',
        variant: 'destructive'
      });
    }
  };

  const exportNote = (note: Note) => {
    const text = `${note.title}\n\n${note.content}\n\nСоздано: ${new Date(note.created_at).toLocaleDateString('ru-RU')}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: 'Экспортировано! 📄',
      description: 'Конспект сохранён в файл'
    });
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getNoteTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'explanation': 'Объяснение',
      'task': 'Задание',
      'homework_check': 'Проверка ДЗ'
    };
    return types[type] || type;
  };

  const getNoteTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'explanation': 'bg-blue-100 text-blue-700 border-blue-300',
      'task': 'bg-purple-100 text-purple-700 border-purple-300',
      'homework_check': 'bg-green-100 text-green-700 border-green-300'
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  if (selectedNote) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Card className="border-4 border-blue-200">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedNote(null)}
                    className="flex items-center gap-2"
                  >
                    <Icon name="ArrowLeft" size={20} />
                    Назад
                  </Button>
                </div>
                <CardTitle className="text-2xl">{selectedNote.title}</CardTitle>
                <CardDescription className="text-base mt-2">
                  <Badge className={getNoteTypeColor(selectedNote.note_type)}>
                    {getNoteTypeLabel(selectedNote.note_type)}
                  </Badge>
                  <span className="ml-3 text-gray-600">
                    {new Date(selectedNote.created_at).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <div className="prose max-w-none whitespace-pre-wrap">
                {selectedNote.content}
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => exportNote(selectedNote)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Icon name="Download" size={18} />
                Экспортировать
              </Button>
              <Button
                onClick={() => deleteNote(selectedNote.id)}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Icon name="Trash2" size={18} />
                Удалить
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Icon name="BookMarked" size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                Мои конспекты 📚
              </h2>
              <p className="text-xl md:text-2xl text-white/95 font-semibold mt-2">
                Библиотека сохранённых объяснений
              </p>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle>Поиск в конспектах</CardTitle>
          <CardDescription>Найди нужную тему быстро</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Введи предмет или тему..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        </CardContent>
      </Card>

      {filteredNotes.length === 0 ? (
        <Card className="border-2 border-gray-200">
          <CardContent className="p-12 text-center">
            <Icon name="BookOpen" size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              {searchQuery ? 'Ничего не найдено' : 'Пока нет конспектов'}
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? 'Попробуй изменить запрос поиска'
                : 'Объяснения от ИИ-репетитора будут автоматически сохраняться здесь'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredNotes.map(note => (
            <Card
              key={note.id}
              className="border-2 border-gray-200 hover:border-blue-300 transition-all cursor-pointer hover:shadow-xl"
              onClick={() => setSelectedNote(note)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getNoteTypeColor(note.note_type)}>
                        {getNoteTypeLabel(note.note_type)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {note.subject}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{note.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {new Date(note.created_at).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </CardDescription>
                  </div>
                  <Icon name="ChevronRight" size={20} className="text-gray-400 flex-shrink-0 mt-1" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {note.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
