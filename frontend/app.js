const API_URL = window.API_URL || 'http://localhost:5000/api';
const form = document.querySelector('#student-form');
const fields = ['studentId', 'name', 'email', 'department', 'semester', 'contact'];
let editingId = null;
let students = [];

const message = (text, error = false) => { const element = document.querySelector('#message'); element.textContent = text; element.style.color = error ? '#b02a3b' : '#5667d8'; };
const payload = () => Object.fromEntries(fields.map((field) => [field, document.querySelector(`#${field}`).value.trim()]));
const clearForm = () => { form.reset(); editingId = null; document.querySelector('#form-title').textContent = 'Add student'; document.querySelector('#studentId').disabled = false; document.querySelector('#cancel').classList.add('hidden'); };

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, { headers: { 'Content-Type': 'application/json' }, ...options });
  const result = await response.json(); if (!response.ok) throw new Error(result.message || 'Request failed'); return result;
}

function render() {
  const query = document.querySelector('#search').value.toLowerCase();
  const visible = students.filter((student) => `${student.studentId} ${student.name}`.toLowerCase().includes(query));
  document.querySelector('#students').innerHTML = visible.length ? `<table><thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Semester</th><th>Actions</th></tr></thead><tbody>${visible.map((s) => `<tr><td>${s.studentId}</td><td>${s.name}<br><small>${s.email}</small></td><td>${s.department}</td><td>${s.semester}</td><td><button data-edit="${s.studentId}">Edit</button> <button class="delete" data-delete="${s.studentId}">Delete</button></td></tr>`).join('')}</tbody></table>` : '<p class="muted">No students found.</p>';
}

async function loadStudents() { try { students = (await request('/students')).data; render(); } catch (error) { message(error.message, true); } }
form.addEventListener('submit', async (event) => { event.preventDefault(); try { const data = payload(); const result = await request(editingId ? `/students/${editingId}` : '/students', { method: editingId ? 'PUT' : 'POST', body: JSON.stringify(data) }); message(result.message); clearForm(); await loadStudents(); } catch (error) { message(error.message, true); } });
document.querySelector('#cancel').addEventListener('click', clearForm);
document.querySelector('#search').addEventListener('input', render);
document.querySelector('#students').addEventListener('click', async (event) => { const editId = event.target.dataset.edit; const deleteId = event.target.dataset.delete; if (editId) { const student = students.find((s) => s.studentId === editId); fields.forEach((field) => { document.querySelector(`#${field}`).value = student[field] || ''; }); editingId = editId; document.querySelector('#form-title').textContent = 'Edit student'; document.querySelector('#studentId').disabled = true; document.querySelector('#cancel').classList.remove('hidden'); window.scrollTo({ top: 0, behavior: 'smooth' }); } if (deleteId && confirm(`Delete ${deleteId}?`)) { try { message((await request(`/students/${deleteId}`, { method: 'DELETE' })).message); await loadStudents(); } catch (error) { message(error.message, true); } } });
loadStudents();
