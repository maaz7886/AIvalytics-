// components/StudentList.jsx
'use client';

export default function StudentList({ students, selectedStudent, onSelectStudent }) {
  return (
    <div className="space-y-2">
      {students.map((student) => (
        <div 
          key={student.id}
          className={`p-3 border rounded-md cursor-pointer transition-colors ${
            selectedStudent?.id === student.id ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'
          }`}
          onClick={() => onSelectStudent(student)}
        >
          <div className="font-medium">{student.name}</div>
          <div className="text-sm text-gray-600">ID: {student.id}</div>
          <div className="text-sm text-gray-600">{student.class}</div>
        </div>
      ))}
    </div>
  );
}